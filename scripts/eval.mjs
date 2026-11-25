const PORT = 9222
const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
const page = targets.find((t) => t.type === 'page')
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
  new Promise((res) => {
    const i = ++id
    pending.set(i, res)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1700, height: 1080, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: process.argv[2] })
await new Promise((r) => setTimeout(r, 2200))

const out = await send('Runtime.evaluate', {
  expression: process.argv[3],
  returnByValue: true,
  awaitPromise: true,
})
console.log(JSON.stringify(out.result.result.value ?? out.result, null, 2))
ws.close()
