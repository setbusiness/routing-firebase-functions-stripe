import { useNavigate } from 'react-router-dom'

function LoginButton() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.setItem('token', '1234567890')
        navigate('/home')
    }
    return (
      <button onClick={handleLogout}>
        Login
      </button>
    )
  }
  
  export default LoginButton
  