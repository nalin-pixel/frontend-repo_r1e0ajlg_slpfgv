import { useState } from 'react'

export default function Chatbot({ user, emotion }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const send = async () => {
    if (!input.trim()) return
    const my = { role: 'user', content: input }
    setMessages(prev => [...prev, my])
    setInput('')
    try {
      const res = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, message: my.content, emotion_hint: emotion })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding.' }])
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-white/80 backdrop-blur">
      <div className="p-3 border-b bg-gradient-to-r from-purple-100 to-blue-100 text-sm">Emotion-aware Assistant</div>
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[80%] px-3 py-2 rounded-lg ${m.role==='user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-800'}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="p-3 flex gap-2 border-t">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message..." className="flex-1 border rounded-lg px-3 py-2" />
        <button onClick={send} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Send</button>
      </div>
    </div>
  )
}
