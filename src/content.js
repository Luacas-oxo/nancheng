// ============================================================
//  全站文案 / 数据配置 —— 想改内容，改这里就够了
// ============================================================

// 资源路径跟着部署基路径走（GitHub Pages 子目录部署也能取到图）
export const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\/+/, '')

export const profile = {
  brand: '南城',
  name: '陈凯',
  cnTitle: '嘿，我是',
  role: 'Ai小白实验室',
  email: 'nikeyide18@gmail.com',
  city: '深圳，中国',
  timezone: 'GMT+8',
  intro: '我做品牌视觉，也写前端的代码。喜欢把一块块形状、颜色和动效拼成会说话的东西。',
  available: '2026 年 Q4 档期开放中',
}

export const navItems = [
  { label: '首页', to: '/' },
  { label: '关于我', to: '/about' },
  { label: '生活动态', to: '/life' },
  { label: '作品', to: '/works' },
]

export const marqueeWords = [
  '品牌视觉',
  '包装设计',
  '动态图形',
  '网页体验',
  '插画',
  '深圳 · 中国',
  '档期开放中',
]

export const services = [
  {
    id: '01',
    title: '活动执行',
    en: 'EVENT PRODUCTION',
    color: 'blue',
    icon: 'bulb',
    desc: '从场地、物料到现场流程，一场活动从头盯到尾；忙的时候一天跑三个场地，细节不掉。',
    tags: ['策划', '场地', '现场执行'],
  },
  {
    id: '02',
    title: '迪拜房产',
    en: 'DUBAI REAL ESTATE',
    color: 'red',
    icon: 'pencil',
    desc: '2020 年跟朋友一起做迪拜房产推介：带看、讲盘、成交；疫情一来，先按下暂停。',
    tags: ['海外房产', '推介会', '带看'],
  },
  {
    id: '03',
    title: '国内电商',
    en: 'E-COMMERCE',
    color: 'yellow',
    icon: 'screen',
    desc: '从选品、上架到详情页，把一门生意搬上线；数据不好看就改，改到有人下单。',
    tags: ['选品', '详情页', '运营'],
  },
  {
    id: '04',
    title: '中外模特演员经纪',
    en: 'TALENT AGENCY',
    color: 'ink',
    icon: 'badge',
    desc: '中外模特、演员的对接与排期，试镜、通告、结算自己跟；既懂镜头，也懂合同。',
    tags: ['中外模特', '演员', '通告'],
  },
]

export const projects = [
  {
    id: 'site',
    title: '个人网站',
    en: 'PERSONAL SITE',
    category: '网页 + 品牌',
    filter: 'web',
    year: '2026',
    cover: asset('/images/work-site.webp'),
    color: 'blue',
    summary: '把自己这些年做过的事，压成一个能点的页面 —— 从名字、版式到每一张贴纸。',
    role: '视觉 / 前端 / 内容',
    tags: ['品牌', '网页', '动效'],
    detail: [
      '起点是一个名字：南城。域名可以朴素，但气质不能 —— 于是把「Ai 小白实验室」当衣领，把拼贴、粗黑描边、手绘箭头当袖口。',
      '页面只留五个：首页、关于我、生活动态、作品、联系。每个只回答一个问题：我是谁、我最近在干嘛、我做过什么、怎么找到我。',
      '技术栈是 React + Vite，样式全部手写。没有模板，也没有设计系统要维护 —— 改一行就是改一行。',
    ],
  },
]

export const projectFilters = [
  { key: 'all', label: '全部' },
  { key: 'branding', label: '品牌' },
  { key: 'packaging', label: '包装' },
  { key: 'web', label: '网页' },
  { key: 'campaign', label: '活动' },
  { key: 'print', label: '印刷' },
]

export const stats = [
  { value: 9, suffix: '+', label: '年做设计' },
  { value: 68, suffix: '', label: '个上线项目' },
  { value: 12, suffix: '', label: '个长期合作品牌' },
  { value: 4, suffix: '', label: '次设计奖项' },
]

/* 主线：职业上真正往前走的那几步 */
export const timelineMain = [
  {
    id: 'm1',
    date: '2021.08',
    tag: '经纪',
    title: '中外模特演员经纪',
    place: '深圳 · 模特 / 演员',
    desc: '对接中外模特和演员，试镜、通告、结算自己跟；既懂镜头，也懂合同。',
    color: 'pink',
    icon: 'star',
    active: true,
  },
  {
    id: 'm2',
    date: '2020.01',
    tag: '海外房产',
    title: '迪拜房产推介',
    place: '深圳 · 鹏瑞莱佛士酒店',
    desc: '跟朋友一起做迪拜房产：带看、讲盘、成交；疫情一来，先按下暂停。',
    color: 'green',
    icon: 'spark',
  },
  {
    id: 'm3',
    date: '2019',
    tag: '起点',
    title: '活动执行',
    place: '深圳 · 活动现场',
    desc: '从场地、物料到现场流程，一场活动从头盯到尾；忙的时候一天跑三个场地。',
    color: 'blue',
    icon: 'arrow',
  },
]

/* 支线：工作之外那些也算数的事 */
export const timelineSide = [
  {
    id: 's1',
    date: '2026.11',
    tag: 'vibe coding',
    title: '开始 vibe coding',
    place: '深圳 · 家里',
    desc: '跟着 AI 一路写代码，上线了我的个人网站 —— 从名字、版式到每一张贴纸。',
    color: 'yellow',
    icon: 'spark',
  },
  {
    id: 's2',
    date: '2025.06',
    tag: '玩',
    title: '去香港玩',
    place: '香港',
    desc: '和英皇集团杨受成的女儿杨诺思女士合照。',
    color: 'pink',
    icon: 'star',
  },
  {
    id: 's3',
    date: '2024.12',
    tag: '日常',
    title: '南城和小白',
    place: '家里',
    desc: '今天的第一件事不是回消息，而是喝杯咖啡和小白玩。',
    color: 'green',
    icon: 'smiley',
  },
  {
    id: 's4',
    date: '2024.08',
    tag: '电商',
    title: '做国内电商',
    place: '深圳 · 线上',
    desc: '从选品、上架到详情页，把一门生意搬上线；数据不好看就改。',
    color: 'blue',
    icon: 'arrow',
  },
]

export const skills = [
  { label: '品牌策略', level: 92 },
  { label: '视觉设计', level: 96 },
  { label: '包装落地', level: 88 },
  { label: 'React / 前端', level: 82 },
  { label: '动效设计', level: 85 },
  { label: '插画', level: 78 },
]

export const quotes = [
  {
    text: '「他把我脑子里那团模糊的东西，画成了能印在盒子上的样子。」',
    name: '林小姐',
    company: '山海咖啡 主理人',
    avatar: asset('/images/life-coffee.webp'),
  },
]

export const process = [
  { n: '1', title: '聊一聊', desc: '先听懂你要什么，以及你不要什么。' },
  { n: '2', title: '发想', desc: '三个方向，不带滤镜地摆在你面前。' },
  { n: '3', title: '定调', desc: '选一个方向，把细节抠到能落地。' },
  { n: '4', title: '打磨', desc: '印刷、切图、动效曲线，一遍遍试。' },
  { n: '5', title: '交付', desc: '给你能直接用的文件，和一份使用说明。' },
]

export const lifePosts = [
  {
    id: 'l1',
    date: '2026.11.18',
    tag: '运动',
    title: '早上 6 点的深圳湾',
    text: '跑到第 5 公里的时候太阳刚好从对岸升起来。风很大，耳机里放的是 90 年代的老歌。',
    image: asset('/images/life-run.webp'),
    size: 'wide',
    place: '深圳湾公园',
  },
  {
    id: 'l2',
    date: '2024.12',
    tag: '日常',
    title: '南城和小白',
    text: '今天的第一件事不是回消息，而是喝杯咖啡和小白玩。',
    image: asset('/images/me-dog.webp'),
    size: 'tall',
    place: '家里',
  },
  {
    id: 'l4',
    date: '2026.10.28',
    tag: '看展',
    title: '在一幅画前站了 20 分钟',
    text: '抽象画的好处是，你可以把自己的情绪放进去，然后它还给你一个不一样的答案。',
    image: asset('/images/life-gallery.webp'),
    size: 'normal',
    place: '海上世界文化艺术中心',
  },
  {
    id: 'l5',
    date: '2026.10.20',
    tag: '日常',
    title: '我的合伙人',
    text: '它每天的工作内容就是躺在键盘上，并且认为这就是设计评审。',
    image: asset('/images/life-cat.webp'),
    size: 'normal',
    place: '工作室',
  },
  {
    id: 'l6',
    date: '2025.06',
    tag: '玩',
    title: '去香港玩',
    text: '和英皇集团杨受成的女儿杨诺思女士合照。',
    image: asset('/images/life-hk.webp'),
    size: 'tall',
    fit: 'contain',
    place: '香港',
  },
  {
    id: 'l7',
    date: '2020.01',
    tag: '商务',
    title: '迪拜EMAAR房产推介会',
    text: '2020年朋友一起做海外房产疫情就来了......',
    image: asset('/images/life-dubai-1.webp'),
    size: 'tall',
    place: '深圳鹏瑞莱佛士酒店',
    gallery: [asset('/images/life-dubai-2.webp'), asset('/images/life-dubai-3.webp')],
  },
]

export const lifeTags = ['全部', '日常', '运动', '创作', '看展', '玩', '商务']

export const nowDoing = [
  { k: '在做', v: 'Ai自媒体' },
  { k: '在学', v: 'Aigc' },
  { k: '在读', v: '《你当像鸟飞往你的山》' },
  { k: '在听', v: 'Careless Whisper' },
]

export const friends = [
  { name: '站酷 ZCOOL', url: 'https://www.zcool.com.cn', note: '国内设计社区' },
  { name: 'Dribbble', url: 'https://dribbble.com', note: '全球灵感库' },
  { name: 'Unsplash', url: 'https://unsplash.com', note: '免费摄影图' },
  { name: '少数派', url: 'https://sspai.com', note: '效率与生活' },
  { name: 'Are.na', url: 'https://www.are.na', note: '收集与研究' },
  { name: 'GitHub', url: 'https://github.com', note: '代码现场' },
]

export const socials = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: '小红书', url: 'https://www.xiaohongshu.com' },
  { label: '抖音', url: 'https://www.douyin.com' },
]

export const contactFaq = [
  {
    q: '一般什么时候回邮件？',
    a: '工作日 24 小时内。周末在跑步，可能慢一点。',
  },
  {
    q: '接什么样的项目？',
    a: '品牌全案、包装、网站与动效。纯执行类的散活一般不接。',
  },
  {
    q: '预算怎么谈？',
    a: '先聊清楚范围，再给一个固定报价。不做按小时计费。',
  },
]
