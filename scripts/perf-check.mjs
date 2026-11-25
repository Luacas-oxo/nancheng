// 首屏性能体检：资源体积、请求时序、视频/字体状态、JS 报错
// 用法：node scripts/perf-check.mjs [url]
const PORT = 9222
const url = process.argv[2] || 'http://localhost:5173/'

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
const page = targets.find((t) => t.type === 'page')
if (!page) throw new Error('no page target')

const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))

let id = 0
const pending = new Map()
const errors = []
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    errors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''))
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    errors.push(msg.params.args.map((a) => a.value || a.description).join(' '))
  }
}
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const i = ++id
    pending.set(i, resolve)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const evalJS = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  return r.result?.result?.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Network.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1700, height: 1080, deviceScaleFactor: 1, mobile: false })

await send('Page.navigate', { url })
await sleep(2500)
const early = await evalJS(`
  performance.getEntriesByType('resource').map(r => ({ url: r.name.replace(location.origin,''), type: r.initiatorType, kb: +(r.transferSize/1024).toFixed(1) }))
`)
const earlyNav = await evalJS(`
  (() => {
    const n = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint').map(p => ({ name: p.name, ms: Math.round(p.startTime) }))
    return { domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), paint }
  })()
`)

await sleep(4000)
const late = await evalJS(`
  performance.getEntriesByType('resource').map(r => ({ url: r.name.replace(location.origin,''), kb: +(r.transferSize/1024).toFixed(1) }))
`)
const state = await evalJS(`
  (() => {
    const v = document.querySelector('.hero__video')
    return {
      videoSrc: v ? v.currentSrc.replace(location.origin,'') : null,
      videoTime: v ? +v.currentTime.toFixed(2) : null,
      videoReady: v ? v.readyState : null,
      paused: v ? v.paused : null,
      fontsStatus: document.fonts ? document.fonts.status : null,
      imgCount: document.querySelectorAll('img').length,
      lazyImg: document.querySelectorAll('img[loading=lazy]').length,
    }
  })()
`)

const total = (list) => list.reduce((s, r) => s + r.kb, 0)
console.log('--- 首屏 2.5s 内请求 ---')
early.forEach((r) => console.log(`${String(r.kb).padStart(7)} KB  ${r.type.padEnd(10)} ${r.url}`))
console.log(`合计 ${total(early).toFixed(1)} KB`)
console.log('--- 导航/绘制 ---')
console.log(earlyNav)
console.log('--- 6.5s 后全部请求 ---')
late.forEach((r) => console.log(`${String(r.kb).padStart(7)} KB  ${r.url}`))
console.log(`合计 ${total(late).toFixed(1)} KB`)
console.log('--- 运行状态 ---')
console.log(state)
console.log('--- JS 错误 ---')
console.log(errors.length ? errors : 'none')
ws.close()
