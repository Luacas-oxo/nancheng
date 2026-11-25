import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { SectionHead } from '../components/Bits'
import {
  ArrowRight,
  Bolt,
  Smiley,
  Spark,
  Squiggle,
  Star5,
  Sunburst,
} from '../components/Doodles'
import { asset, profile, timelineMain, timelineSide } from '../content'

function PageHead() {
  return (
    <header className="page-head page-head--about">
      <div className="page-head__deco" aria-hidden="true">
        <Sunburst size={140} color="#FFCE00" />
        <Star5 size={34} color="#FFFBF0" />
        <Bolt size={26} color="#F5452F" />
      </div>
      <div className="wrap page-head__inner">
        <div>
          <nav className="crumbs">
            <Link to="/">首页</Link>
            <span>/</span>
            <span>关于我</span>
          </nav>
          <h1 className="display page-head__title">
            关于<span className="hl hl--yellow">我</span>
          </h1>
          <p className="page-head__sub">
            在深圳摸爬滚打的南城
          </p>
        </div>
      </div>
    </header>
  )
}

function Intro() {
  return (
    <section className="intro">
      <div className="wrap intro__inner">
        <Reveal className="intro__portrait-wrap" y={50}>
          <div className="intro__portrait">
            <img src={asset('/images/portrait-half.webp')} alt="南城 的照片" fetchPriority="high" decoding="async" />
            <div className="intro__frame-tag">南城 / 2026</div>
          </div>
          <div className="intro__note">
            <Smiley size={26} />
            <span>
              真人也长这样，
              <br />
              只是少了描边。
            </span>
          </div>
          <Spark size={34} color="#F5452F" className="intro__spark" />
        </Reveal>

        <div className="intro__copy">
          <Reveal>
            <h2 className="display intro__title">
              你好，我是
              <span className="hl hl--blue">南城</span>
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="intro__lead">
              干过活动，推过迪拜的房子，卖过货，也带过中外模特和演员 —— 现在跟 AI 混。
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="intro__text">
              汕头人。在深圳这些年，换过好几种活法：现场盯活动，跟朋友一起办过迪拜房产推介会，
              自己折腾国内电商，也对接过中外模特和演员。现在大半时间都给了 AI，边学边做，边做边改。
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="intro__text">
              我不太信「一步到位」。先做出来一个能跑的小东西，再决定要不要做大 ——
              想得再美，不如先让人看见。
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="intro__facts">
              <div>
                <h4>我做</h4>
                <p>活动执行 / 迪拜房产 / 国内电商 / 中外模特演员经纪</p>
              </div>
              <div>
                <h4>我用</h4>
                <p>AI 工具 / 剪映 / Figma</p>
              </div>
              <div>
                <h4>我在</h4>
                <p>{profile.city} · 接受远程合作</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="intro__actions">
              <Link to="/works" className="btn btn--ghost">
                看作品 <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const TL_COLS = [
  { key: 'main', label: '主线任务', items: timelineMain },
  { key: 'side', label: '支线任务', items: timelineSide },
]

function Timeline() {
  return (
    <section className="timeline-section">
      <div className="wrap">
        <SectionHead
          index="05"
          kicker="时间线"
          title={
            <>
              这几年，一步
              <span className="ul-squiggle">
                一格
                <Squiggle width={140} color="#1B47E8" />
              </span>
            </>
          }
          sub="不是一条直线，但每一步都算数。"
        />

        <div className="tl3">
          {TL_COLS.map((col) => (
            <div className="tl3__col" key={col.key}>
              <div className="tl3__head">
                <span>{col.label}</span>
                <i className="tl3__count">{col.items.length} 条</i>
              </div>
              {col.items.map((t, i) => (
                <Reveal
                  key={t.id}
                  delay={i * 50}
                  y={26}
                  className={`tl3__row ${t.active ? 'is-now' : ''}`}
                >
                  <div className="timeline__year">
                    <span>{t.date}</span>
                    <i className="timeline__tag">{t.tag}</i>
                  </div>
                  <div className="timeline__rail" aria-hidden="true">
                    <span className="timeline__dot" />
                  </div>
                  <div className="timeline__card">
                    <h3>{t.title}</h3>
                    <span className="timeline__place">{t.place}</span>
                    <p>{t.desc}</p>
                    {t.active && <span className="timeline__now">正在发生</span>}
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <PageHead />
      <Intro />
      <Timeline />
    </>
  )
}
