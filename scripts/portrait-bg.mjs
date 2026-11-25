import sharp from 'sharp'
import fs from 'node:fs'

const CUT = 'shots/me-cutout.png'
const SRC = 'shots/me-ref.jpg'
const OUT = 'public/images/portrait-real.jpg'

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

const PHOTO_H = 760
const BAND_H = 92
const CANVAS_H = PHOTO_H + BAND_H

function target(x, y) {
  if (x < 512 && y < 596) return C_B
  if (y > 520 && x > 288 + (y - 520) * 0.95) return C_R
  return C_Y
}

const out = Buffer.alloc(w * h * 3)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const pi = (y * w + x) * rch
    const ai = (y * w + x) * 4
    const R = rgb[pi]
    const G = rgb[pi + 1]
    const B = rgb[pi + 2]
    const a = alphaBuf[ai + 3] / 255
    const oi = (y * w + x) * 3

    const L = (0.299 * R + 0.587 * G + 0.114 * B) / 240
    const ratio = Math.max(0.52, Math.min(1.06, L))
    const t = target(x, y)
    const bgR = Math.min(255, t[0] * ratio)
    const bgG = Math.min(255, t[1] * ratio)
    const bgB = Math.min(255, t[2] * ratio)

    if (a >= 0.996) {
      out[oi] = R
      out[oi + 1] = G
      out[oi + 2] = B
      continue
    }
    if (a <= 0.02) {
      out[oi] = bgR
      out[oi + 1] = bgG
      out[oi + 2] = bgB
      continue
    }
    const uf = [0, 0, 0]
    const c0 = [R, G, B]
    for (let c = 0; c < 3; c++) {
      const f = (c0[c] - (1 - a) * 248) / a
      uf[c] = Math.max(0, Math.min(255, f))
    }
    out[oi] = a * uf[0] + (1 - a) * bgR
    out[oi + 1] = a * uf[1] + (1 - a) * bgG
    out[oi + 2] = a * uf[2] + (1 - a) * bgB
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
