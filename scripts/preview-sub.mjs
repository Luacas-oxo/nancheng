// 本地模拟 GitHub Pages 子路径部署：http://localhost:4174/nancheng/
// 用法：node scripts/preview-sub.mjs [子路径=/nancheng/] [端口=4174]
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const BASE = (process.argv[2] || '/nancheng/').replace(/\/?$/, '/')
const PORT = Number(process.argv[3] || 4174)
const ROOT = 'dist'

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  if (!url.startsWith(BASE)) {
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('not under base')
    return
  }
  let rel = url.slice(BASE.length)
  if (rel === '' || rel.endsWith('/')) rel += 'index.html'
  const file = path.join(ROOT, rel)
  try {
    const s = await stat(file)
    if (!s.isFile()) throw new Error('not file')
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    // 单页应用兜底：找不到就回 index.html
    const body = await readFile(path.join(ROOT, 'index.html'))
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(body)
  }
}).listen(PORT, () => console.log(`preview ${BASE} → http://localhost:${PORT}${BASE}`))
