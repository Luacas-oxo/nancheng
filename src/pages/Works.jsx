import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRight, MailIcon, Spark, Star5, Sunburst } from '../components/Doodles'
import { profile, projectFilters, projects } from '../content'

export default function Works() {
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)

  const list = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.filter === filter)),
    [filter],
  )
  const active = projects.find((p) => p.id === openId)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenId(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = openId ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [openId])

  return (
    <>
      <header className="page-head page-head--works">
        <div className="page-head__deco" aria-hidden="true">
          <Sunburst size={150} color="#F5452F" />
          <Star5 size={32} color="#FFCE00" />
        </div>
        <div className="wrap page-head__inner">
          <div>
            <nav className="crumbs">
              <Link to="/">首页</Link>
              <span>/</span>
              <span>作品</span>
            </nav>
            <h1 className="display page-head__title">
              作品<span className="hl hl--yellow">档案</span>
            </h1>
            <p className="page-head__sub">
              从一句话开始的那些项目。
              <br />
              点开任意一个，可以看到它怎么长出来的。
            </p>
          </div>
          <div className="works__legend">
            {[
              { key: 'branding', label: '品牌' },
              { key: 'packaging', label: '包装' },
              { key: 'web', label: '网页' },
              { key: 'campaign', label: '活动' },
              { key: 'print', label: '印刷' },
            ]
              .filter((l) => projects.some((p) => p.filter === l.key))
              .map((l) => (
                <span key={l.key}>
                  <i className={`dot dot--${l.key}`} /> {l.label}
                </span>
              ))}
          </div>
        </div>
      </header>

      <div className="works__bar">
        <div className="wrap works__bar-inner">
          <div className="works__filters">
            {projectFilters
              .filter((f) => f.key === 'all' || projects.some((p) => p.filter === f.key))
              .map((f) => (
              <button
                key={f.key}
                className={`chip ${filter === f.key ? 'is-on' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <em>
                  {f.key === 'all'
                    ? projects.length
                    : projects.filter((p) => p.filter === f.key).length}
                </em>
              </button>
            ))}
          </div>
          <span className="works__hint">
            <Spark size={16} color="#F5452F" /> 点卡片看细节
          </span>
        </div>
      </div>

      <section className="works">
        <div className="wrap">
          <div className="works__grid" key={filter}>
            {list.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 70}
                y={44}
                className={`works__cell ${i % 3 === 0 ? 'is-lead' : ''}`}
              >
                <button
                  className={`big-card big-card--${p.color}`}
                  onClick={() => setOpenId(p.id)}
                >
                  <div className="big-card__media">
                    <img src={p.cover} alt={p.title} loading="lazy" />
                    <span className="big-card__index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="big-card__year">{p.year}</span>
                  </div>
                  <div className="big-card__text">
                    <div className="big-card__head">
                      <h3>{p.title}</h3>
                      <span className="big-card__cat">{p.category}</span>
                    </div>
                    <p className="big-card__summary">{p.summary}</p>
                    <div className="big-card__meta">
                      <span>
                        <em>角色</em>
                        {p.role}
                      </span>
                      <span>
                        <em>年份</em>
                        {p.year}
                      </span>
                    </div>
                    <div className="big-card__foot">
                      <ul>
                        {p.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <span className="big-card__open">
                        看细节 <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {active && createPortal(
        <div className="modal" onClick={() => setOpenId(null)}>
          <div className="modal__card" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setOpenId(null)} aria-label="关闭">
              ✕
            </button>
            <div className="modal__media">
              <img src={active.cover} alt={active.title} />
            </div>
            <div className="modal__body">
              <span className="pill pill--ink">{active.category}</span>
              <h3 className="display">
                {active.title}
                <em>{active.en}</em>
              </h3>
              <p className="modal__summary">{active.summary}</p>
              <dl className="modal__meta">
                <div>
                  <dt>年份</dt>
                  <dd>{active.year}</dd>
                </div>
                <div>
                  <dt>我的角色</dt>
                  <dd>{active.role}</dd>
                </div>
              </dl>
              {active.detail.map((d, i) => (
                <p key={i} className="modal__detail">
                  {d}
                </p>
              ))}
              <div className="modal__tags">
                {active.tags.map((t) => (
                  <span key={t} className="chip chip--paper">
                    {t}
                  </span>
                ))}
              </div>
              <a href={`mailto:${profile.email}?subject=${encodeURIComponent('想聊一个类似的项目：' + active.title)}`} className="btn btn--red">
                <MailIcon size={16} /> 聊一个类似的项目
              </a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
