import { useEffect, useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { BackToTop, ScrollProgress } from './components/Bits'
import Home from './pages/Home'
import About from './pages/About'
import Life from './pages/Life'
import Works from './pages/Works'
import Contact from './pages/Contact'

// 部署在子路径（如 GitHub Pages 的 /仓库名/）时，路由要跟着基路径走
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function ScrollRestorer() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function PageShell() {
  const { pathname } = useLocation()
  return (
    <div className="page" key={pathname}>
      <Outlet />
    </div>
  )
}

function Layout() {
  return (
    <>
      <ScrollRestorer />
      <ScrollProgress />
      <Navbar />
      <main>
        <PageShell />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default function App() {
  const [booted, setBooted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <BrowserRouter basename={BASENAME}>
      <div className={`app ${booted ? 'is-booted' : ''}`}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/life" element={<Life />} />
            <Route path="/works" element={<Works />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
