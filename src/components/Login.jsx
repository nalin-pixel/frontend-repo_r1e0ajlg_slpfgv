import { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        const res = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })
        if (!res.ok) throw new Error(await res.text())
      }
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onLogin(data)
    } catch (err) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
        <p className="text-center text-gray-500 mb-6">EduSense</p>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input className="w-full border rounded-lg px-3 py-2" value={name} onChange={e=>setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input type="email" className="w-full border rounded-lg px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Sign up & Login')}
          </button>
        </form>
        <button onClick={()=>setMode(mode==='login'?'signup':'login')} className="mt-4 text-sm text-blue-600 underline">
          {mode==='login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  )
}
