import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('edusense_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const handleLogin = (u) => {
    setUser(u)
    localStorage.setItem('edusense_user', JSON.stringify(u))
  }

  if (!user) {
    return (
      <div>
        <Hero />
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  return <Dashboard user={user} />
}

export default App
