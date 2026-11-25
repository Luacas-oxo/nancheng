import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { SectionHead } from '../components/Bits'
import { ArrowRight, Bolt, Eye, Squiggle, Star5, Sunburst } from '../components/Doodles'
import { lifePosts, lifeTags, nowDoing } from '../content'

export default function Life() {
  const [tag, setTag] = useState('全部')
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active])
  const list = useMemo(
    () => (tag === '全部' ? lifePosts : lifePosts.filter((p) => p.tag === tag)),
    [tag],
  )

  return (
    <>
      <header className="page-head page-head--life">
        <div className="page-head__deco" aria-hidden="true">
          <Sunburst size={120} color="#FFFBF0" />
          <Star5 size={30} color="#FFCE00" />
        </div>
        <div className="wrap page-head__inner">
          <div>
            <nav className="crumbs">
              <Link to="/">首页</Link>
              <span>/</span>
              <span>生活动态</span>
            </nav>
            <h1 className="display page-head__title">
              生活<span className="hl hl--red">动态</span>
            </h1>
            <p className="page-head__sub">
              工作之外的那些时间，才让作品有点人味。
              <br />
              随手记的一些片段，按时间倒序。
            </p>
          </div>
          <div className="life__head-note">
            <Eye size={22} stroke="#FFFBF0" />
            <span>
              共 {lifePosts.length} 条
              <br />
              不定时更新
            </span>
          </div>
        </div>
      </header>

      <section className="now">
        <div className="wrap now__inner">
          <div className="now__label">
            <span className="now__dot" />
            NOW
            <em>此刻</em>
          </div>
          <div className="now__grid">
            {nowDoing.map((n, i) => (
              <Reveal key={n.k} delay={i * 80} className="now__cell">
                <span className="now__k">{n.k}</span>
                <span className="now__v">{n.v}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="life">
        <div className="wrap">
          <div className="life__bar">
            <div className="life__filters">
              {lifeTags.map((t) => (
                <button
                  key={t}
                  className={`chip ${tag === t ? 'is-on' : ''}`}
                  onClick={() => {
                    setTag(t)
                    setActive(null)
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="life__count">
              {list.length} 条记录 <Squiggle width={90} color="#0F0F0F" />
            </span>
          </div>

          <div className="life__grid" key={tag}>
            {list.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 70}
                y={40}
                className={`life__cell life__cell--${p.size}`}
              >
                <article
                  className={`life-card ${p.gallery ? 'life-card--clickable' : ''}`}
                  onClick={() => p.gallery && setActive(p)}
                >
                  <div className={`life-card__media ${p.fit === 'contain' ? 'life-card__media--fit' : ''}`}>
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <span className="life-card__tag">{p.tag}</span>
                    <span className="life-card__date">{p.date}</span>
                  </div>
                  <div className="life-card__body">
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <div className="life-card__foot">
                      <span className="life-card__place">
                        <Bolt size={14} color="#F5452F" />
                        {p.place}
                      </span>
                      <span className="life-card__more">
                        {p.gallery ? `${p.gallery.length + 1} 张图` : ''}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {active &&
        createPortal(
          <div className="life-modal" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
            <div className="life-modal__card" onClick={(e) => e.stopPropagation()}>
              <div className="life-modal__head">
                <span className="pill pill--yellow">{active.tag}</span>
                <span className="life-modal__date">{active.date}</span>
                <button className="life-modal__close" onClick={() => setActive(null)} aria-label="关闭">
                  ×
                </button>
              </div>
              <h3 className="life-modal__title">{active.title}</h3>
              <p className="life-modal__text">{active.text}</p>
              <span className="life-modal__place">
                <Bolt size={14} color="#F5452F" />
                {active.place}
              </span>
              <div className="life-modal__imgs">
                {[active.image, ...(active.gallery || [])].map((src, i) => (
                  <img key={src} src={src} alt={`${active.title} ${i + 1}`} />
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
