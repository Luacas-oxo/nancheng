import { useEffect, useRef, useState } from 'react'

/**
 * 滚动进入视口时触发的轻量动画 hook（IntersectionObserver，无依赖）
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 34,
  once = true,
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            setShown(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, '--reveal-y': `${y}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
