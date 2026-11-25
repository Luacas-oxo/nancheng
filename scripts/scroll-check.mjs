// 验证：滚出首屏后视频是否暂停、滚回是否续播；顺便看滚动监听状态
const PORT = 9222
const url = process.argv[2] || 'http://localhost:4173/'

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
const page = targets.find((t) => t.type === 'page')
if (!page) throw new Error('no page target')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m)
    pending.delete(m.id)
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
  const r = await send('Runtime.evaluate', { expression, returnByValue: true })
  return r.result?.result?.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1700, height: 1080, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url })
await sleep(3200)

const read = () =>
  evalJS(`(() => {
    const v = document.querySelector('.hero__video')
    const bar = document.querySelector('.progress__bar')
    return {
      paused: v ? v.paused : null,
      time: v ? +v.currentTime.toFixed(2) : null,
      scrollY: Math.round(window.scrollY),
      progressWidth: bar ? bar.style.width : null,
      navScrolled: document.querySelector('.nav')?.className.includes('is-scrolled') || false,
      backtopOn: document.querySelector('.backtop')?.className.includes('is-on') || false,
    }
  })()`)

console.log('首屏:', await read())
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 2200)' })
await sleep(900)
console.log('滚到 2200:', await read())
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' })
await sleep(900)
console.log('回顶部:', await read())
ws.close()
