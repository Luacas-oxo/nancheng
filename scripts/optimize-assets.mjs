// 资源瘦身：把站点里真正用到的图片转成 webp，海报压缩
// 用法：node scripts/optimize-assets.mjs
import sharp from 'sharp'
import { stat, readdir } from 'node:fs/promises'
import path from 'node:path'

const DIR = 'public/images'

// 只处理页面里实际引用的图；portrait 保持原尺寸不裁（用户明确要求不裁）
const targets = [
  { file: 'portrait-half.jpg', out: 'portrait-half.webp', width: 1330 },
  { file: 'work-site.jpg', out: 'work-site.webp', width: 1200 },
  { file: 'me-dog.jpg', out: 'me-dog.webp', width: 720 },
  { file: 'life-hk.jpg', out: 'life-hk.webp', width: 1080 },
  { file: 'life-dubai-1.jpg', out: 'life-dubai-1.webp', width: 1200 },
  { file: 'life-dubai-2.jpg', out: 'life-dubai-2.webp', width: 1200 },
  { file: 'life-dubai-3.jpg', out: 'life-dubai-3.webp', width: 1200 },
  { file: 'life-run.jpg', out: 'life-run.webp', width: 1200 },
  { file: 'life-gallery.jpg', out: 'life-gallery.webp', width: 1200 },
  { file: 'life-cat.jpg', out: 'life-cat.webp', width: 1200 },
  { file: 'life-coffee.jpg', out: 'life-coffee.webp', width: 1200 },
  { file: 'hero-poster.jpg', out: 'hero-poster.webp', width: 1600 },
]

const kb = (n) => `${Math.round(n / 1024)} KB`

let before = 0
let after = 0

for (const t of targets) {
  const src = path.join(DIR, t.file)
  const dst = path.join(DIR, t.out)
  const inSize = (await stat(src)).size
  await sharp(src)
    .resize({ width: t.width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(dst)
  const outSize = (await stat(dst)).size
  before += inSize
  after += outSize
  console.log(`${t.file} ${kb(inSize)} → ${t.out} ${kb(outSize)}`)
}

// 首屏海报：同时压一版 jpg 给老浏览器兜底
const posterIn = (await stat(path.join(DIR, 'hero-poster.jpg'))).size
await sharp(path.join(DIR, 'hero-poster.jpg'))
  .resize({ width: 1600, withoutEnlargement: true })
  .jpeg({ quality: 74, mozjpeg: true })
  .toFile(path.join(DIR, 'hero-poster-min.jpg'))
const posterOut = (await stat(path.join(DIR, 'hero-poster-min.jpg'))).size

console.log(`total ${kb(before)} → ${kb(after)} (webp)`)
console.log(`poster ${kb(posterIn)} → ${kb(posterOut)}`)
