import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile, marqueeWords } from '../content'
import { ArrowRight, Smiley, Spark, Star5, Sunburst } from './Doodles'
import Reveal from './Reveal'

/* ───────── 滚动进度条 ───────── */
export function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    let raf = 0
    // 直接量宽 + 写样式，不经过 React state，避免滚动时每帧重渲染
    const update = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? (window.scrollY / h) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${p}%`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="progress" aria-hidden="true">
      <div className="progress__bar" ref={barRef} />
    </div>
  )
}

/* ───────── 回到顶部 ───────── */
export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      setShow(window.scrollY > 600)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <button
      className={`backtop ${show ? 'is-on' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
    >
      <span>↑</span>
    </button>
  )
}

/* ───────── 滚动跑马灯 ───────── */
export function Marquee({ items = marqueeWords, theme = 'blue', speed = 34 }) {
  const row = (
    <>
      {items.map((w, i) => (
        <span className="marquee__item" key={`${w}-${i}`}>
          {w}
          <Spark size={20} color={theme === 'blue' ? '#FFCE00' : '#F5452F'} />
        </span>
      ))}
    </>
  )
  return (
    <div className={`marquee marquee--${theme}`}>
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {row}
        {row}
      </div>
    </div>
  )
}

/* ───────── 区块标题 ───────── */
export function SectionHead({ index, kicker, title, sub, action, align = 'left' }) {
  return (
    <div className={`section-head section-head--${align}`}>
      <div className="section-head__main">
        <Reveal className="section-head__kicker">
          {index && <span className="section-head__num">{index}</span>}
          <span>{kicker}</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="section-head__title display">{title}</h2>
        </Reveal>
        {sub && (
          <Reveal delay={140}>
            <p className="section-head__sub">{sub}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={180} className="section-head__action">
          {action}
        </Reveal>
      )}
    </div>
  )
}
