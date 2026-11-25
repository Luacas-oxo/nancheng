// 一次性改名：灵精的火火 → 南城
import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const rules = [
  ['灵精的火火', '南城'],
  ['火火和小白', '南城和小白'],
  ['摸爬滚打的火火', '摸爬滚打的南城'],
]

const targets = [
  'index.html',
  'README.md',
  'src/content.js',
  'src/App.jsx',
  'src/main.jsx',
  'src/components/Navbar.jsx',
  'src/components/Footer.jsx',
  'src/components/Bits.jsx',
  'src/pages/Home.jsx',
  'src/pages/About.jsx',
  'src/pages/Life.jsx',
  'src/pages/Works.jsx',
  'src/pages/Contact.jsx',
  'src/styles/global.css',
  'src/styles/pages.css',
]

for (const f of targets) {
  let s
  try {
    s = await readFile(f, 'utf8')
  } catch {
    continue
  }
  let changed = 0
  for (const [from, to] of rules) {
    if (s.includes(from)) {
      changed += s.split(from).length - 1
      s = s.split(from).join(to)
    }
  }
  if (changed) {
    await writeFile(f, s)
    console.log(`${f}: ${changed} 处`)
  }
}
