// 用 CDP 在真实 Chrome 里按 PC 视口截图（整页 / 指定滚动位置）
const PORT = 9222

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
const page = targets.find((t) => t.type === 'page')
if (!page) throw new Error('no page target')

const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))

let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
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

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: Number(process.env.W || 1700),
  height: 1080,
  deviceScaleFactor: 1,
  mobile: false,
})

const url = process.argv[2] || 'http://localhost:5173/'
const mode = process.argv[3] || 'full'
const out = process.argv[4] || 'shots/shot.png'
const pre = process.argv[5]

await send('Page.navigate', { url })
await sleep(2800)

const scrollTo = async (y) => {
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` })
  await sleep(900)
}

if (mode === 'full') {
  // 先把整页滚一遍，触发入场动画
  const h = (
    await send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollHeight',
      returnByValue: true,
    })
  ).result.result.value
  for (let y = 0; y < h; y += 700) await scrollTo(y)
  await scrollTo(h)
  await sleep(600)
  await scrollTo(0)
  await sleep(600)
  const { result } = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  })
  const fs = await import('node:fs')
  fs.writeFileSync(out, Buffer.from(result.data, 'base64'))
  console.log('saved', out, 'height', h)
} else {
  await scrollTo(Number(mode))
  if (pre) {
    await send('Runtime.evaluate', { expression: pre })
    await sleep(1200)
  }
  const { result } = await send('Page.captureScreenshot', { format: 'png' })
  const fs = await import('node:fs')
  fs.writeFileSync(out, Buffer.from(result.data, 'base64'))
  console.log('saved', out)
}

ws.close()
