import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve('public/images')
const files = fs.readdirSync(dir)

const plan = {
  'portrait.png': { w: 900, fmt: 'png' },
  'work-coffee.jpg': { w: 1400, fmt: 'jpg' },
  'work-podcast.jpg': { w: 1400, fmt: 'jpg' },
  'work-pizza.jpg': { w: 1400, fmt: 'jpg' },
  'work-run.jpg': { w: 1400, fmt: 'jpg' },
  'work-book.jpg': { w: 1400, fmt: 'jpg' },
  'work-lab.jpg': { w: 1400, fmt: 'jpg' },
  'life-run.jpg': { w: 1200, fmt: 'jpg' },
  'life-coffee.jpg': { w: 1200, fmt: 'jpg' },
  'life-desk.jpg': { w: 1200, fmt: 'jpg' },
  'life-gallery.jpg': { w: 1200, fmt: 'jpg' },
  'life-cat.jpg': { w: 1200, fmt: 'jpg' },
  'life-street.jpg': { w: 1200, fmt: 'jpg' },
}

for (const f of files) {
  const p = plan[f]
  if (!p) continue
  const src = path.join(dir, f)
  const buf = await sharp(src)
    .resize({ width: p.w, withoutEnlargement: true })
    [p.fmt === 'png' ? 'png' : 'jpeg'](p.fmt === 'png' ? { compressionLevel: 9 } : { quality: 84, progressive: true, mozjpeg: true })
    .toBuffer()
  fs.writeFileSync(src, buf)
  const kb = (buf.length / 1024).toFixed(0)
  console.log(f.padEnd(20), kb + 'KB')
}
