import './App.css'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './page/Home'
import About from './page/About'
import Contact from './page/Contact'
import User from './page/User'
import NotFound from './page/NotFound'
import Login from './page/Login'
import CodeSlides from './page/CodeSlides'
import PaymentSuccess from './page/PaymentSuccess'
import PaymentCancel from './page/PaymentCancel'

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/code-slides" element={<CodeSlides />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
