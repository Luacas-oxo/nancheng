import sharp from 'sharp'
import fs from 'node:fs'

const SRC = 'shots/me-cutout.png'
const OUT = 'public/images/portrait-real.jpg'
const W = 768
const H = 785
const INK = '#0F0F0F'
const BLUE = '#1B47E8'
const YELLOW = '#FFCE00'
const RED = '#F5452F'
const CREAM = '#FFFBF0'

// ---------- 1. 取原始像素 ----------
const src = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { data, info } = src
const w = info.width
const h = info.height

// ---------- 2. 侵蚀 alpha 1.5px，去掉抠图残留的白边 ----------
const a = new Uint8Array(w * h)
for (let i = 0; i < w * h; i++) a[i] = data[i * 4 + 3]
const a2 = new Uint8Array(w * h)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    let min = 255
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
        const v = a[ny * w + nx]
        if (v < min) min = v
      }
    }
    a2[y * w + x] = min
  }
}

// ---------- 3. 去白边：边缘像素的颜色从邻近不透明像素扩散过来 ----------
const out = Buffer.alloc(w * h * 4)
for (let i = 0; i < w * h; i++) {
  out[i * 4] = data[i * 4]
  out[i * 4 + 1] = data[i * 4 + 1]
  out[i * 4 + 2] = data[i * 4 + 2]
  out[i * 4 + 3] = a2[i]
}

const R = 3
// 先标记“边缘带”：alpha 半透明像素 2px 邻域内的所有像素都重绘颜色
const edgeMask = new Uint8Array(w * h)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = y * w + x
    if (a2[i] > 0 && a2[i] < 250) {
      for (let dy = -2; dy <= 2; dy++) {
        const ny = y + dy
        if (ny < 0 || ny >= h) continue
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx
          if (nx < 0 || nx >= w) continue
          edgeMask[ny * w + nx] = 1
        }
      }
    }
  }
}

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = y * w + x
    if (!edgeMask[i] || a2[i] === 0) continue
    let r = 0
    let g = 0
    let b = 0
    let n = 0
    for (let dy = -R; dy <= R; dy++) {
      const ny = y + dy
      if (ny < 0 || ny >= h) continue
      for (let dx = -R; dx <= R; dx++) {
        const nx = x + dx
        if (nx < 0 || nx >= w) continue
        const j = ny * w + nx
        if (edgeMask[j]) continue
        if (a2[j] < 250) continue
        r += data[j * 4]
        g += data[j * 4 + 1]
        b += data[j * 4 + 2]
        n++
      }
    }
    if (n > 0) {
      out[i * 4] = r / n
      out[i * 4 + 1] = g / n
      out[i * 4 + 2] = b / n
    }
  }
}

const personPng = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left: 0, top: 0, width: W, height: H })
  .png()
  .toBuffer()

// ---------- 4. 背景 ----------
const bgSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${YELLOW}"/>
  <path d="M0 0 H500 V596 L286 630 H0 Z" fill="${BLUE}"/>
  <path d="M768 548 L768 796 L356 796 Z" fill="${RED}"/>
</svg>`
const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer()

// ---------- 5. 人物硬阴影 ----------
const silhouette = await sharp(personPng)
  .composite([
    {
      input: Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${INK}"/></svg>`),
      blend: 'dest-in'
    }
  ])
  .png()
  .toBuffer()
const shadow = await sharp(silhouette).blur(6).png().toBuffer()

// ---------- 6. 合成 ----------
const body = await sharp(bg)
  .composite([
    { input: shadow, left: 9, top: 12, blend: 'over', opacity: 0.38 },
    { input: personPng, left: 0, top: 0, blend: 'over' }
  ])
  .png()
  .toBuffer()

// ---------- 7. 底部色条 + 细黑线（压住肩部截断处） ----------
const barH = 30
const barSvg = `<svg width="${W}" height="${barH}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${barH}" fill="${RED}"/>
  <rect width="${W}" height="3" fill="${INK}"/>
</svg>`
const bar = await sharp(Buffer.from(barSvg)).png().toBuffer()

const finalPng = await sharp(body)
  .composite([{ input: bar, left: 0, top: H - barH, blend: 'over' }])
  .png()
  .toBuffer()

await sharp(finalPng).jpeg({ quality: 88, mozjpeg: true }).toFile(OUT)
const meta = await sharp(OUT).metadata()
const size = (await fs.promises.stat(OUT)).size
console.log('written', OUT, meta.width, meta.height, (size / 1024).toFixed(0) + 'KB')
