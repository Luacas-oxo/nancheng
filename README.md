# 南城 · 个人网站（React + Vite）

复古拼贴 / 新野蛮主义风格的个人站：高饱和撞色、粗黑描边、硬投影、手绘贴纸，全屏视频首屏 + 五个页面。

## 运行

```bash
npm install      # 第一次
npm run dev      # 打开 http://localhost:5173
npm run build    # 打包到 dist/
npm run preview  # 预览打包结果
```

## 页面结构

| 路由 | 页面 | 内容 |
| --- | --- | --- |
| `/` | 首页 | 全屏 Hero（视频背景 + 导航）、滚动跑马灯、关于我摘要、四项服务、精选作品、客户评价、工作流程、CTA |
| `/about` | 关于我 | 人物图 + 个人介绍 + 数据统计 + 竖向时间线 + 能力条 |
| `/life` | 生活动态 | NOW 状态条、标签筛选、Bento 照片墙、随笔卡片 |
| `/works` | 作品 | 分类筛选、大卡片作品列表、点击弹出项目详情（弹窗） |
| `/contact` | 联系我 | 超大字邮箱（点一下直接唤起邮件客户端）、复制地址、联系方式卡片、mailto 生成器、FAQ |

底部全局含**友情链接**区块、订阅框、回到顶部。

## 改内容

- 文案、项目、时间线、友情链接等全部集中在 **`src/content.js`**，改这一个文件即可。
- 品牌名、邮箱、城市、档期状态在 `profile` 对象里。
- 分隔线、贴纸、箭头的 SVG 都在 `src/components/Doodles.jsx`。

## 换素材

```
public/
  videos/hero.mp4          # 首屏背景视频（当前为 9.5s 无缝循环）
  images/hero-poster.jpg   # 视频封面
  images/portrait.png      # 人物插画（透明底）
  images/work-*.jpg        # 作品封面
  images/life-*.jpg        # 生活动态照片
```

换成自己的图时保持同名即可，建议宽度 ≤ 1400px、体积 ≤ 300KB。`assets/` 里放的是生成首屏视频用的原始底图，不参与运行，可随时删除。`scripts/optimize-images.mjs` 可以批量压缩（需要 `sharp`）。

`scripts/shot.mjs` / `scripts/eval.mjs` 是基于 Chrome DevTools Protocol 的截图与测量脚本，调试布局时可用（先启动 `chrome --headless=new --remote-debugging-port=9222`）。

## 动效清单

- 首屏标题逐词入场（模糊 + 位移）
- 背景视频缓慢推拉（Ken Burns）+ 噪点颗粒
- 鼠标视差：首屏人物卡片随光标轻微位移
- 全站滚动进入动画（IntersectionObserver，逐块延迟）
- 顶部滚动进度条、导航滚动收缩、导航高亮胶囊
- 跑马灯（悬停暂停）、贴纸漂浮、太阳旋转、闪电闪烁
- 关于页数字滚动计数、能力条填充、时间线节点脉冲
- 作品/生活卡片悬停上浮 + 图片缓慢放大 + 圆角箭头旋转
- 作品详情弹窗（缩放弹入）、FAQ 手风琴、复制成功反馈

## 说明

页面按 PC 优先设计，内容区最大 1700px；1100px 以下导航收进下拉菜单。
