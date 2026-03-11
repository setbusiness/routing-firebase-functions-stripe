import { NavLink } from 'react-router-dom'
import LogoutButton from './LogoutButton'


function Header() {
  return (
    <header>
      <h1>Mon site React</h1>
      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>{' '}
        |{' '}
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          About
        </NavLink>{' '}
        |{' '}
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
          Contact
        </NavLink>
        |{' '}
        <NavLink to="/user/42" className={({ isActive }) => (isActive ? 'active' : '')}>
          User
        </NavLink>
        |{' '}
        <NavLink to="/code-slides" className={({ isActive }) => (isActive ? 'active' : '')}>
          Code Slides
        </NavLink>
        |{' '}
        <NavLink to="/payment-success" className={({ isActive }) => (isActive ? 'active' : '')}>
          Success
        </NavLink>
        |{' '}
        <NavLink to="/payment-cancel" className={({ isActive }) => (isActive ? 'active' : '')}>
          Cancel
        </NavLink>
      </nav>
      <LogoutButton />
    </header>
  )
}

export default Header
