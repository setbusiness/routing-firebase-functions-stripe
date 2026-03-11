import { useNavigate } from 'react-router-dom'

function LogoutButton() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (!token) return null

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
  
export default LogoutButton
  