import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { SectionHead } from '../components/Bits'
import {
  ArrowDown,
  ArrowRight,
  Bolt,
  Eye,
  MailIcon,
  Smiley,
  Spark,
  Squiggle,
  Star5,
  Sunburst,
} from '../components/Doodles'
import { asset, profile, projects, services } from '../content'

const TITLE_WORDS = [
  { text: '我把', cls: '', d: 0 },
  { text: '想法', cls: '', d: 90 },
  { text: '通过', cls: 'word--small', d: 180 },
  { text: 'Ai', cls: 'word--hl', d: 270 },
]

function useClock() {
  const [now, setNow] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow(
        d.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function Hero() {
  const clock = useClock()
  const [mounted, setMounted] = useState(false)
  const visualRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20)
    return () => clearTimeout(t)
  }, [])

  // 首屏先出海报和文字，视频等页面 load 完、浏览器空闲再加载，避免和关键资源抢带宽
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // 系统开了"减少动态效果"就只留静态海报
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return
    let cancelled = false
    let idleId = 0
    let timerId = 0
    const start = () => {
      if (cancelled) return
      v.src = asset('/videos/hero.mp4')
      v.load()
      const play = v.play()
      if (play && play.catch) play.catch(() => {})
    }
    const schedule = () => {
      if (cancelled) return
      if (window.requestIdleCallback) {
        idleId = window.requestIdleCallback(start, { timeout: 2000 })
      } else {
        timerId = setTimeout(start, 1000)
      }
    }
    if (document.readyState === 'complete') {
      schedule()
    } else {
      window.addEventListener('load', schedule, { once: true })
    }
    return () => {
      cancelled = true
      window.removeEventListener('load', schedule)
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId)
      if (timerId) clearTimeout(timerId)
    }
  }, [])

  // 鼠标轻微视差：只在鼠标移动后跑动画帧，收敛即停，静止时不占 CPU
  useEffect(() => {
    const el = visualRef.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return
    let raf = 0
    let rect = null
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const loop = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      if (Math.abs(tx - cx) > 0.15 || Math.abs(ty - cy) > 0.15) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = 0
      }
    }
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect()
      tx = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 18
      ty = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 18
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onResize = () => {
      rect = null
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // 离开首屏或切到后台就暂停视频，回来再播：省电、省流量
  useEffect(() => {
    const v = videoRef.current
    const hero = v?.closest('.hero')
    if (!v || !hero) return
    const resume = () => {
      if (document.hidden || !v.currentSrc) return
      const play = v.play()
      if (play && play.catch) play.catch(() => {})
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) resume()
        else v.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(hero)
    const onVisibility = () => {
      if (document.hidden) v.pause()
      else resume()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <section className={`hero ${mounted ? 'is-in' : ''}`}>
      <div className="hero__media">
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={asset('/images/hero-poster-min.jpg')}
        />
        <div className="hero__scrim" />
        <div className="hero__grain" />
        <div className="hero__grid" />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <div className="hero__eyebrow">
            <span className="hero__badge">
              <Spark size={18} color="#FFCE00" />
              Ai小白实验室
            </span>
            <span className="hero__status">
              <i /> {profile.available}
            </span>
          </div>

          <h1 className="hero__title display">
            <span className="hero__line">
              <span className="word">{TITLE_WORDS[0].text}</span>
              <span className="word" style={{ '--d': '90ms' }}>
                {TITLE_WORDS[1].text}
              </span>
            </span>
            <span className="hero__line">
              <span className="word word--small" style={{ '--d': '180ms' }}>
                {TITLE_WORDS[2].text}
              </span>
              <span className="word word--hl" style={{ '--d': '270ms' }}>
                {TITLE_WORDS[3].text}
              </span>
            </span>
            <span className="hero__line">
              <span className="word" style={{ '--d': '360ms' }}>
                实现
                <i className="bang">！</i>
              </span>
              <span className="hero__burst" aria-hidden="true">
                <Sunburst size={92} color="#FFCE00" />
              </span>
            </span>
          </h1>

          <p className="hero__sub">
            扎进Ai的浪潮，看看他把我拍到哪儿算哪儿~
          </p>

          <div className="hero__actions">
            <Link to="/works" className="btn btn--lg btn--yellow">
              看我的作品 <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn--lg btn--ghost">
              关于我
            </Link>
          </div>
        </div>

        <div className="hero__visual" ref={visualRef}>
          <div className="hero__portrait">
            <img src={asset('/images/portrait-half.webp')} alt="南城 的照片" loading="lazy" decoding="async" />
            <div className="hero__portrait-tape" />
          </div>

          <div className="hero__bubble">
            <span>灵感 + 咖啡</span>
            <span>= 魔法</span>
          </div>

          <div className="hero__sticker hero__sticker--1">
            <Star5 size={30} color="#FFCE00" />
            <span>做点好玩的</span>
          </div>
          <div className="hero__sticker hero__sticker--2">
            <Bolt size={22} color="#F5452F" />
            <span>还在画</span>
          </div>
          <div className="hero__sticker hero__sticker--3">
            <Smiley size={30} color="#FFCE00" />
          </div>
        </div>
      </div>

      <div className="wrap hero__foot">
        <div className="hero__scrollcue">
          <span className="hero__mouse">
            <i />
          </span>
          <span>往下看看</span>
          <ArrowDown size={14} stroke="#FFFBF0" />
        </div>
        <div className="hero__locate">
          <span>{profile.city}</span>
          <span className="hero__dot" />
          <span className="hero__clock">{clock}</span>
        </div>
      </div>
    </section>
  )
}

function AboutTeaser() {
  return (
    <section className="teaser">
      <div className="teaser__doodle" aria-hidden="true">
        <Star5 size={40} color="#F5452F" />
      </div>
      <div className="wrap teaser__inner">
        <Reveal className="teaser__photo-wrap" y={50}>
          <div className="teaser__photo">
            <img src={asset('/images/me-dog.webp')} alt="南城和他家的白狗" loading="lazy" decoding="async" />
          </div>
          <div className="teaser__bubble">
            <Smiley size={28} color="#FFFBF0" />
            <span>很高兴见到你！</span>
          </div>
          <div className="teaser__tape" />
        </Reveal>

        <div className="teaser__copy">
          <Reveal className="teaser__kicker">
            <span className="pill pill--ink">关于我</span>
            <span className="teaser__kicker-line" />
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display teaser__title">
              一个把想法
              <br />
              变成<span className="hl hl--blue">看得见</span>东西的人
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="teaser__text">
              我是广东汕头人，是潮汕人，infj~~
              <br />
              在深圳做过活动执行、迪拜房产、电商、模特经纪，想法很多，
              <br />
              希望和大家交朋友~~现在扎进Ai的浪潮，看看他把我拍到哪儿算哪儿~~
            </p>
          </Reveal>

          <Reveal delay={200}>
            <Link to="/about" className="btn btn--ink">
              更完整的我 <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="services">
      <div className="wrap">
        <SectionHead
          index="01"
          kicker="我能做什么"
          title={
            <>
              四件我做得比较
              <span className="ul-squiggle">
                顺手
                <Squiggle width={150} color="#F5452F" />
              </span>
              的事
            </>
          }
          sub="从策略到落地，尽量让一个项目只在一个人手里，不丢东西。"
          action={
            <Link to="/works" className="link-arrow">
              看看这些怎么被用 <ArrowRight size={16} />
            </Link>
          }
        />

        <div className="services__grid">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 90} y={44} className="services__cell">
              <article className={`service service--${s.color}`}>
                <div className="service__top">
                  <span className="service__id">{s.id}</span>
                  <span className="service__icon">
                    {s.color === 'blue' && <Eye size={30} stroke="#FFFBF0" />}
                    {s.color === 'red' && <Bolt size={26} color="#FFFBF0" />}
                    {s.color === 'yellow' && <Spark size={28} color="#0F0F0F" />}
                    {s.color === 'ink' && <Star5 size={26} color="#FFCE00" />}
                  </span>
                </div>
                <h3>{s.title}</h3>
                <span className="service__en">{s.en}</span>
                <p>{s.desc}</p>
                <ul className="service__tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkShowcase() {
  const featured = projects.slice(0, 4)
  const countCn = ['', '一', '两', '三', '四'][featured.length] || String(featured.length)
  return (
    <section className="showcase">
      <div className="wrap">
        <SectionHead
          index="02"
          kicker="精选作品"
          title={
            <>
              最近做的<span className="hl hl--red">{countCn}件</span>东西
            </>
          }
          action={
            <Link to="/works" className="link-arrow">
              全部作品 <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="showcase__grid">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80} y={40}>
              <Link to="/works" className={`work-card work-card--${p.color}`}>
                <div className="work-card__media">
                  <img src={p.cover} alt={p.title} loading="lazy" />
                  <span className="work-card__year">{p.year}</span>
                  <span className="work-card__go">
                    <ArrowRight size={18} />
                  </span>
                </div>
                <div className="work-card__meta">
                  <h3>{p.title}</h3>
                  <span>{p.category}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <Services />
      <WorkShowcase />
    </>
  )
}
