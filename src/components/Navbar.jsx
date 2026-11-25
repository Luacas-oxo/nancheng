import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { navItems, profile } from '../content'
import { MailIcon, Smiley, Spark } from './Doodles'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // rAF 节流：滚动事件可能一帧来多次，合并成一次状态更新
    let raf = 0
    const apply = () => {
      raf = 0
      setScrolled(window.scrollY > 40)
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

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner wrap">
        <NavLink to="/" className="nav__logo" aria-label="回到首页">
          <span className="nav__logo-face">
            <Smiley size={40} color="#FFCE00" />
          </span>
          <span className="nav__logo-text">
            <em>嘿，我是</em>
            <strong>
              {profile.brand}
              <i>!</i>
            </strong>
          </span>
        </NavLink>

        <nav className="nav__links" aria-label="主导航">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
              style={{ '--i': i }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink to="/contact" className="btn btn--sm btn--red nav__cta">
          <span>联系我</span>
          <MailIcon size={18} />
          <span className="nav__cta-spark">
            <Spark size={18} color="#FFCE00" />
          </span>
        </NavLink>

        <button
          className="nav__burger"
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="nav__drawer">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav__drawer-link ${isActive ? 'is-active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  )
}
