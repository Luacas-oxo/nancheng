// 真实鼠标点击测试：点开某张生活卡，检查浮层是否出现，并收集控制台错误
const PORT = 9222
const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
const page = targets.find((t) => t.type === 'page')
if (!page) throw new Error('no page target')

const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))

let id = 0
const pending = new Map()
const logs = []
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    logs.push(msg.params.args.map((a) => a.value ?? a.description).join(' '))
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    logs.push('EXCEPTION: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text))
  }
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
}
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const i = ++id
    pending.set(i, resolve)
    ws.send(JSON.stringify({ id: i, method, params }))
  })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const evaluate = async (expression) => {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true })
  return res.result?.result?.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 950, deviceScaleFactor: 1, mobile: false })

await send('Page.navigate', { url: 'http://localhost:5173/life' })
await sleep(3000)

const target = await evaluate(`(() => {
  const card = [...document.querySelectorAll('.life-card')].find(el => el.textContent.includes('迪拜'));
  if (!card) return null;
  card.scrollIntoView({block: 'center'});
  const r = card.getBoundingClientRect();
  return {x: r.x + r.width/2, y: r.y + r.height/2, cls: card.className, w: r.width, h: r.height};
})()`)
await sleep(800)
const rect = await evaluate(`(() => {
  const card = [...document.querySelectorAll('.life-card')].find(el => el.textContent.includes('迪拜'));
  const r = card.getBoundingClientRect();
  return {x: r.x + r.width/2, y: r.y + r.height/2};
})()`)
console.log('card rect', rect, 'target', target)

if (rect) {
  for (const type of ['mousePressed', 'mouseReleased']) {
    await send('Input.dispatchMouseEvent', { type, x: rect.x, y: rect.y, button: 'left', clickCount: 1 })
    await sleep(120)
  }
}
await sleep(1200)

const modal = await evaluate(`!!document.querySelector('.life-modal')`)
const modalRect = await evaluate(`(() => { const m = document.querySelector('.life-modal__card'); if(!m) return null; const r = m.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), vh: window.innerHeight}; })()`)
const imgRect = await evaluate(`(() => { const i = document.querySelector('.life-modal__imgs img'); if(!i) return null; const r = i.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width), vh: window.innerHeight}; })()`)
console.log('modal?', modal, 'card', modalRect, 'img', imgRect)
if (logs.length) console.log('console errors:', logs.slice(0, 5))

const { result } = await send('Page.captureScreenshot', { format: 'png' })
const fs = await import('node:fs')
fs.writeFileSync('shots/click-test.png', Buffer.from(result.data, 'base64'))
console.log('saved shots/click-test.png')
ws.close()
