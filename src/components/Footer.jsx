import { friends, profile, socials } from '../content'
import { ArrowRight, MailIcon, Smiley, Spark, Star5 } from './Doodles'

export default function Footer() {

  return (
    <footer className="footer">
      <div className="footer__grain" />

      <div className="wrap footer__top">
        <div className="footer__brand">
          <div className="footer__logo">
            <span>嘿，我是</span>
            <strong>
              {profile.brand}
              <i>!</i>
            </strong>
          </div>
          <p className="footer__role">
            Ai小白实验室
            <br />
            目前住在{profile.city}
          </p>
          <div className="footer__sticker">
            <Smiley size={34} color="#FFCE00" />
            <span>开放合作中</span>
          </div>
        </div>

        <div className="footer__col">
          <h4>找到我</h4>
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target={s.url.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>保持联系</h4>
          <a className="footer__mail" href={`mailto:${profile.email}`}>
            <MailIcon size={16} />
            {profile.email}
          </a>
        </div>
      </div>

      <div className="wrap footer__friends">
        <div className="footer__friends-head">
          <h4>
            友情链接
            <Star5 size={16} color="#FFCE00" />
          </h4>
          <span>互相看着对方长大的那些站</span>
        </div>
        <ul className="footer__friends-list">
          {friends.map((f) => (
            <li key={f.name}>
              <a href={f.url} target="_blank" rel="noreferrer">
                <span className="friends__name">{f.name}</span>
                <span className="friends__note">{f.note}</span>
                <ArrowRight size={14} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap footer__bottom">
        <span>© 2026 {profile.brand} Studio · 保留所有权利</span>
        <span className="footer__made">
          用 <Spark size={13} color="#F5452F" /> 和大量咖啡手工搭建
        </span>
        <button
          className="footer__top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          回到顶部 ↑
        </button>
      </div>
    </footer>
  )
}
