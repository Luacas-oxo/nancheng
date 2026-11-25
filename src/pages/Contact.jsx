import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRight, Spark, Star5, CheckIcon, CopyIcon, Smiley, Bolt } from '../components/Doodles'
import { profile, socials } from '../content'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = profile.email
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <header className="page-head page-head--contact">
        <div className="page-head__deco" aria-hidden="true">
          <Star5 size={36} color="#FFCE00" />
          <Spark size={26} color="#F5452F" />
        </div>
        <div className="wrap page-head__inner">
          <div>
            <nav className="crumbs">
              <Link to="/">首页</Link>
              <span>/</span>
              <span>联系我</span>
            </nav>
            <h1 className="display page-head__title">
              聊<span className="hl hl--yellow">两句</span>
            </h1>
            <p className="page-head__sub">像朋友一样聊天~~</p>
          </div>
          <div className="page-head__aside page-head__aside--dark">
            <span className="pill pill--red">
              <i className="live-dot" /> 档期开放中
            </span>
            <p>
              工作日 24 小时内回信
              <br />
              {profile.city}
            </p>
          </div>
        </div>
      </header>

      <section className="mail-hero">
        <div className="wrap">
          <Reveal className="mail-card">
            <div className="mail-card__head">
              <span className="pill pill--ink">直接写信</span>
            </div>

            <a className="mail-card__address" href={`mailto:${profile.email}`}>
              <span className="mail-card__at">✉</span>
              {profile.email}
              <i className="mail-card__underline" />
            </a>

            <div className="mail-card__actions">
              <button className={`btn btn--ghost ${copied ? 'is-copied' : ''}`} onClick={copy}>
                {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                {copied ? '已复制' : '复制地址'}
              </button>
            </div>

            <div className="mail-card__stickers" aria-hidden="true">
              <span className="mail-sticker mail-sticker--1">
                <Smiley size={26} /> 我会看的
              </span>
              <span className="mail-sticker mail-sticker--2">
                <Bolt size={18} color="#FFCE00" /> 别客气
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="contact-grid">
        <div className="wrap">
          <div className="contact-grid__inner">
            {[
              { k: '邮箱', v: profile.email, href: `mailto:${profile.email}`, note: '最快的通道' },
              { k: '所在城市', v: profile.city, note: `${profile.timezone} · 可远程` },
            ].map((c, i) => (
              <Reveal key={c.k} delay={i * 90} className="contact-card">
                <span className="contact-card__k">{c.k}</span>
                {c.href ? (
                  <a href={c.href} className="contact-card__v">
                    {c.v}
                  </a>
                ) : (
                  <span className="contact-card__v">{c.v}</span>
                )}
                <span className="contact-card__note">{c.note}</span>
              </Reveal>
            ))}
          </div>

          <div className="contact-socials">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="chip chip--paper">
                {s.label} <ArrowRight size={12} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
