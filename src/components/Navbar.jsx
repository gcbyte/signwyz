import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"

function Navbar({ darkMode, setDarkMode, isAuthenticated, onLogout }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    setMobileOpen(false)
    onLogout()
    navigate("/")
  }

  const closeMobile = () => setMobileOpen(false)

  const navLinkClass = ({ isActive }) => (isActive ? "active" : "")

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMobile}>
      <img
       src="/signwyz-logo.png"
       alt="SignWyz"
       className="navbar-logo"
      />
      </Link>

      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
        <ul>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/dashboard" className={navLinkClass} onClick={closeMobile}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/documents" className={navLinkClass} onClick={closeMobile}>
                  Documents
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMobile}>
                  Profile
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/" end className={navLinkClass} onClick={closeMobile}>
                  Home
                </NavLink>
              </li>
              <li>
                <a href="#how-it-works" onClick={closeMobile}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" onClick={closeMobile}>
                  Features
                </a>
              </li>
              <li>
                <a href="#about" onClick={closeMobile}>
                  About
                </a>
              </li>
            </>
          )}
        </ul>

        <div className="nav-buttons nav-buttons--mobile">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
          </button>

          {isAuthenticated ? (
            <button className="sign-in-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/signin" className="sign-in-btn" onClick={closeMobile}>
                Sign In
              </Link>
              <Link to="/signup" className="get-started-btn" onClick={closeMobile}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="nav-buttons nav-buttons--desktop">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
        </button>

        {isAuthenticated ? (
          <button className="sign-in-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/signin" className="sign-in-btn">
              Sign In
            </Link>
            <Link to="/signup" className="get-started-btn">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar