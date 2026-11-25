import sharp from 'sharp'
import fs from 'node:fs'

const CUT = 'shots/me2-cutout.png'
const SRC = 'shots/me2.jpg'
const OUT = 'public/images/portrait-new.jpg'

const INK = '#0F0F0F'
const BLUE = '#1B47E8'
const YELLOW = '#FFCE00'
const RED = '#F5452F'
const CREAM = '#FFFBF0'

const cut = await sharp(CUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const src = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const w = cut.info.width
const h = cut.info.height
const rch = src.info.channels

const rgb = src.data
const alphaBuf = cut.data
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]
const C_Y = hex(YELLOW)
const C_B = hex(BLUE)
const C_R = hex(RED)

const PHOTO_H = 730
const BAND_H = 150
const CANVAS_H = PHOTO_H + BAND_H

function target(x, y) {
  if (x < 190 && y < 620) return C_B
  if (x > 560 && y > 400) return C_R
  return C_Y
}

const out = Buffer.alloc(w * h * 3)

// 半透明边缘的 RGB 用邻近不透明像素的颜色替换，避免“银发”色斑
const solid = Buffer.alloc(w * h * 3)
for (let i = 0; i < w * h; i++) {
  const a = alphaBuf[i * 4 + 3]
  if (a >= 250) {
    solid[i * 3] = rgb[i * rch]
    solid[i * 3 + 1] = rgb[i * rch + 1]
    solid[i * 3 + 2] = rgb[i * rch + 2]
  }
}
const R3 = 4
const edgeColor = Buffer.alloc(w * h * 3)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const k = y * w + x
    const a = alphaBuf[k * 4 + 3] / 255
    if (a < 0.45 || a >= 0.98) continue
    let r = 0
    let g = 0
    let b = 0
    let n = 0
    for (let dy = -R3; dy <= R3; dy++) {
      const ny = y + dy
      if (ny < 0 || ny >= h) continue
      for (let dx = -R3; dx <= R3; dx++) {
        const nx = x + dx
        if (nx < 0 || nx >= w) continue
        const j = ny * w + nx
        if (alphaBuf[j * 4 + 3] < 250) continue
        r += solid[j * 3]
        g += solid[j * 3 + 1]
        b += solid[j * 3 + 2]
        n++
      }
    }
    if (n > 0) {
      edgeColor[k * 3] = r / n
      edgeColor[k * 3 + 1] = g / n
      edgeColor[k * 3 + 2] = b / n
    }
  }
}

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const pi = (y * w + x) * rch
    const ai = (y * w + x) * 4
    const R = rgb[pi]
    const G = rgb[pi + 1]
    const B = rgb[pi + 2]
    const a = alphaBuf[ai + 3] / 255
    const oi = (y * w + x) * 3

    const t = target(x, y)
    const bgR = t[0]
    const bgG = t[1]
    const bgB = t[2]

    if (a >= 0.996) {
      out[oi] = R
      out[oi + 1] = G
      out[oi + 2] = B
      continue
    }
    if (a <= 0.45) {
      out[oi] = bgR
      out[oi + 1] = bgG
      out[oi + 2] = bgB
      continue
    }
    const ec = (y * w + x) * 3
    const hasEdge = edgeColor[ec] !== 0 || edgeColor[ec + 1] !== 0 || edgeColor[ec + 2] !== 0
    const sR = hasEdge ? edgeColor[ec] : R
    const sG = hasEdge ? edgeColor[ec + 1] : G
    const sB = hasEdge ? edgeColor[ec + 2] : B
    out[oi] = a * sR + (1 - a) * bgR
    out[oi + 1] = a * sG + (1 - a) * bgG
    out[oi + 2] = a * sB + (1 - a) * bgB
  }
}

const photo = await sharp(out, { raw: { width: w, height: h, channels: 3 } })
  .extract({ left: 0, top: 0, width: w, height: PHOTO_H })
  .png()
  .toBuffer()

const bandSvg = `<svg width="${w}" height="${BAND_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${BAND_H}" fill="${CREAM}"/>
  <rect width="${w}" y="0" height="4" fill="${INK}"/>
  <rect x="36" y="${BAND_H / 2 - 13}" width="30" height="26" fill="${RED}" stroke="${INK}" stroke-width="3"/>
</svg>`

const band = await sharp(Buffer.from(bandSvg)).png().toBuffer()

await sharp({ create: { width: w, height: CANVAS_H, channels: 3, background: CREAM } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: band, left: 0, top: PHOTO_H }
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUT)

const meta = await sharp(OUT).metadata()
const size = (await fs.promises.stat(OUT)).size
console.log('written', OUT, meta.width, meta.height, (size / 1024).toFixed(0) + 'KB')

