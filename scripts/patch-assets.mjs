// 把 content.js 里的绝对图片路径改成 asset() 包装，让部署子路径也能正确取图
import { readFile, writeFile } from 'node:fs/promises'

const f = 'src/content.js'
let s = await readFile(f, 'utf8')

if (!s.includes('export const asset')) {
  s = s.replace(
    '// ============================================================\n//  全站文案 / 数据配置 —— 想改内容，改这里就够了\n// ============================================================\n',
    '// ============================================================\n//  全站文案 / 数据配置 —— 想改内容，改这里就够了\n// ============================================================\n\n// 资源路径跟着部署基路径走（GitHub Pages 子目录部署也能取到图）\nexport const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\\/+/, \'\')\n',
  )
}

const before = (s.match(/\/images\//g) || []).length
s = s.replace(/'(\/images\/[A-Za-z0-9._-]+)'/g, "asset('$1')")
const after = (s.match(/asset\('\/images\//g) || []).length

await writeFile(f, s)
console.log(`asset() 包装 ${after} 处（原始 /images/ 出现 ${before} 次）`)
