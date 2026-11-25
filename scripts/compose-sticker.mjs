import sharp from 'sharp'
import fs from 'node:fs'

const CUT = 'shots/me2-cutout.png'
const OUT = 'public/images/portrait-sticker.png'

const W = 900
const H = 1150
const INK = '#0F0F0F'
const BLUE = '#1B47E8'
const BLUE2 = '#2C58F0'
const YELLOW = '#FFCE00'
const RED = '#F5452F'
const CREAM = '#FFFBF0'

// ---------- 1. 头部（原像素，不缩放）：裁到颈根，清掉两侧斜方肌 ----------
const HEAD_X = 234
const HEAD_Y = 52
const HEAD_W = 428
const HEAD_H = 758
const headTop = 56
const headLeft = Math.round((W - HEAD_W) / 2)

const rawHead = await sharp(CUT)
  .ensureAlpha()
  .extract({ left: HEAD_X, top: HEAD_Y, width: HEAD_W, height: HEAD_H })
  .raw()
  .toBuffer({ resolveWithObject: true })

const hw = rawHead.info.width
const hh = rawHead.info.height
const hb = Buffer.from(rawHead.data)

const NECK_L = 282 - headLeft
const NECK_R = 482 - headLeft
const CUT_FROM_Y = 634

for (let y = CUT_FROM_Y; y < hh; y++) {
  for (let x = 0; x < hw; x++) {
    if (x < NECK_L || x >= NECK_R) hb[(y * hw + x) * 4 + 3] = 0
  }
}
const head = await sharp(hb, { raw: { width: hw, height: hh, channels: 4 } }).png().toBuffer()

// ---------- 2. 背景 ----------
const bgSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${YELLOW}"/>
  <rect x="0" y="0" width="300" height="772" fill="${BLUE}"/>
  <path d="M ${W} 640 L ${W} ${H} L 540 ${H} Z" fill="${RED}"/>
  <circle cx="756" cy="192" r="44" fill="${CREAM}" stroke="${INK}" stroke-width="5"/>
  <path d="M 726 192 h 60 M 756 162 v 60" stroke="${INK}" stroke-width="5"/>
  <rect x="34" y="40" width="116" height="68" fill="${RED}" stroke="${INK}" stroke-width="5"/>
</svg>`
const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer()

// ---------- 3. 牛仔夹克：U 领 ----------
const jacket = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <path d="M 236,676 L 282,676 L 282,702 Q 382,900 482,702 L 482,676 L 664,676
           L 764,922 L 776,1150 L 124,1150 L 136,922 Z"
        fill="${BLUE}" stroke="${INK}" stroke-width="6"/>
  <path d="M 136,922 Q 222,980 262,1150 L 124,1150 Z" fill="${BLUE2}" stroke="${INK}" stroke-width="5"/>
  <path d="M 764,922 Q 678,980 638,1150 L 776,1150 Z" fill="${BLUE2}" stroke="${INK}" stroke-width="5"/>
  <rect x="176" y="952" width="146" height="94" fill="${BLUE2}" stroke="${INK}" stroke-width="5"/>
  <rect x="578" y="952" width="146" height="94" fill="${BLUE2}" stroke="${INK}" stroke-width="5"/>
  <line x1="176" y1="986" x2="322" y2="986" stroke="${INK}" stroke-width="3"/>
  <line x1="578" y1="986" x2="724" y2="986" stroke="${INK}" stroke-width="3"/>
  <line x1="450" y1="885" x2="450" y2="1150" stroke="${INK}" stroke-width="5"/>
  <line x1="450" y1="920" x2="428" y2="1150" stroke="${INK}" stroke-width="3"/>
  <circle cx="450" cy="938" r="9" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>
  <line x1="262" y1="908" x2="360" y2="908" stroke="${CREAM}" stroke-width="3" stroke-dasharray="10 8"/>
  <line x1="540" y1="908" x2="638" y2="908" stroke="${CREAM}" stroke-width="3" stroke-dasharray="10 8"/>
</svg>`

// ---------- 4. 胸前贴纸（呼应网站） ----------
const sticker = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="590" cy="880" r="34" fill="${YELLOW}" stroke="${INK}" stroke-width="5"/>
  <path d="M 590 856 L 596 874 L 614 874 L 600 886 L 605 904 L 590 892 L 575 904 L 580 886 L 566 874 L 584 874 Z"
        fill="${INK}"/>
</svg>`

const jacketPng = await sharp(Buffer.from(jacket)).png().toBuffer()
const stickerPng = await sharp(Buffer.from(sticker)).png().toBuffer()

// ---------- 5. 组装人物 ----------
const person = await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
})
  .composite([
    { input: head, left: headLeft, top: headTop },
    { input: jacketPng, left: 0, top: 0 },
    { input: stickerPng, left: 0, top: 0 }
  ])
  .png()
  .toBuffer()

const { data: pr, info: pinfo } = await sharp(person).raw().toBuffer({ resolveWithObject: true })
const w = pinfo.width
const h = pinfo.height

// ---------- 6. 外轮廓膨胀 ----------
const a0 = new Uint8Array(w * h)
for (let i = 0; i < w * h; i++) a0[i] = pr[i * 4 + 3]

const R = 7
const tmp = new Uint8Array(w * h)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    let m = 0
    const s = Math.max(0, x - R)
    const e = Math.min(w - 1, x + R)
    for (let k = s; k <= e; k++) {
      const v = a0[y * w + k]
      if (v > m) m = v
    }
    tmp[y * w + x] = m
  }
}
const dil = new Uint8Array(w * h)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    let m = 0
    const s = Math.max(0, y - R)
    const e = Math.min(h - 1, y + R)
    for (let k = s; k <= e; k++) {
      const v = tmp[k * w + x]
      if (v > m) m = v
    }
    dil[y * w + x] = m
  }
}

const strokeBuf = Buffer.alloc(w * h * 4)
for (let i = 0; i < w * h; i++) {
  strokeBuf[i * 4] = 15
  strokeBuf[i * 4 + 1] = 15
  strokeBuf[i * 4 + 2] = 15
  strokeBuf[i * 4 + 3] = Math.min(255, dil[i] * 1.2)
}
const strokePng = await sharp(strokeBuf, { raw: { width: w, height: h, channels: 4 } })
  .blur(0.4)
  .png()
  .toBuffer()

// ---------- 7. 硬投影 ----------
const shadowBuf = Buffer.alloc(w * h * 4)
for (let i = 0; i < w * h; i++) {
  shadowBuf[i * 4] = 15
  shadowBuf[i * 4 + 1] = 15
  shadowBuf[i * 4 + 2] = 15
  shadowBuf[i * 4 + 3] = Math.min(255, dil[i] * 0.5)
}
const shadowPng = await sharp(shadowBuf, { raw: { width: w, height: h, channels: 4 } })
  .blur(12)
  .png()
  .toBuffer()

// ---------- 8. 合成 ----------
const final = await sharp(bg)
  .composite([
    { input: shadowPng, left: 16, top: 20, blend: 'over' },
    { input: strokePng, left: 0, top: 0, blend: 'over' },
    { input: person, left: 0, top: 0, blend: 'over' }
  ])
  .png()
  .toBuffer()

await sharp(final).png({ compressionLevel: 9 }).toFile(OUT)
const meta = await sharp(OUT).metadata()
console.log('written', OUT, meta.width, meta.height, ((await fs.promises.stat(OUT)).size / 1024).toFixed(0) + 'KB')
