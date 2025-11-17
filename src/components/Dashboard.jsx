import { useEffect, useMemo, useState } from 'react'
import Sidebar from './Sidebar'
import CameraEmotion from './CameraEmotion'
import Chatbot from './Chatbot'

export default function Dashboard({ user }) {
  const [emotion, setEmotion] = useState('neutral')
  const [summary, setSummary] = useState(null)
  const [materials, setMaterials] = useState([])
  const [videos, setVideos] = useState([])
  const [selectedMat, setSelectedMat] = useState(null)
  const [adapt, setAdapt] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const refresh = async () => {
    const [sumRes, matRes, vidRes] = await Promise.all([
      fetch(`${baseUrl}/emotions/summary/${user.user_id}`),
      fetch(`${baseUrl}/materials/${user.user_id}`),
      fetch(`${baseUrl}/videos/${user.user_id}`)
    ])
    setSummary(await sumRes.json())
    setMaterials(await matRes.json())
    setVideos(await vidRes.json())
  }

  useEffect(() => { refresh() }, [])

  useEffect(() => {
    // log emotion change
    const log = async () => {
      try {
        await fetch(`${baseUrl}/emotions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.user_id, emotion }) })
        const res = await fetch(`${baseUrl}/adapt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.user_id, material_id: selectedMat?.id, latest_emotion: emotion }) })
        setAdapt(await res.json())
        refresh()
      } catch (e) {}
    }
    log()
  }, [emotion, selectedMat])

  const addMaterial = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = form.get('title')
    const subject = form.get('subject')
    const content = form.get('content')
    await fetch(`${baseUrl}/materials`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.user_id, title, subject, content }) })
    e.currentTarget.reset()
    refresh()
  }

  const addVideo = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = form.get('vtitle')
    const subject = form.get('vsubject')
    const url = form.get('url')
    await fetch(`${baseUrl}/videos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.user_id, title, subject, url }) })
    e.currentTarget.reset()
    refresh()
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-blue-50">
      <Sidebar user={user} summary={summary} />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <CameraEmotion onEmotion={setEmotion} />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-xl p-4 bg-white/80 backdrop-blur">
                <h3 className="font-semibold mb-3">Upload Study Material</h3>
                <form onSubmit={addMaterial} className="space-y-3">
                  <input name="title" placeholder="Title" className="w-full border rounded-lg px-3 py-2" required />
                  <input name="subject" placeholder="Subject" className="w-full border rounded-lg px-3 py-2" />
                  <textarea name="content" placeholder="Paste content..." rows={4} className="w-full border rounded-lg px-3 py-2" required />
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save</button>
                </form>
              </div>
              <div className="border rounded-xl p-4 bg-white/80 backdrop-blur">
                <h3 className="font-semibold mb-3">Add Subject Video</h3>
                <form onSubmit={addVideo} className="space-y-3">
                  <input name="vtitle" placeholder="Title" className="w-full border rounded-lg px-3 py-2" required />
                  <input name="vsubject" placeholder="Subject" className="w-full border rounded-lg px-3 py-2" />
                  <input name="url" placeholder="Video URL (YouTube)" className="w-full border rounded-lg px-3 py-2" required />
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save</button>
                </form>
              </div>
            </div>
            <div className="border rounded-xl p-4 bg-white/80 backdrop-blur">
              <h3 className="font-semibold mb-3">Your Materials</h3>
              <div className="flex flex-wrap gap-2">
                {materials.map(m => (
                  <button key={m.id} onClick={()=>setSelectedMat(m)} className={`px-3 py-1.5 rounded-lg border ${selectedMat?.id===m.id?'bg-blue-600 text-white':'bg-white hover:bg-gray-50'}`}>
                    {m.title}
                  </button>
                ))}
              </div>
              {selectedMat && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50">
                  {adapt?.suggested_intro && <p className="text-sm text-gray-600 mb-2">{adapt.suggested_intro}<span className="font-semibold">{adapt.policy?.strategy}</span></p>}
                  <pre className="whitespace-pre-wrap text-sm">{selectedMat.content}</pre>
                </div>
              )}
            </div>
            <div className="border rounded-xl p-4 bg-white/80 backdrop-blur">
              <h3 className="font-semibold mb-3">Subject Videos</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map(v => (
                  <a key={v.id} href={v.url} target="_blank" className="block border rounded-lg p-3 hover:bg-gray-50">
                    <div className="font-semibold">{v.title}</div>
                    <div className="text-xs text-gray-500">{v.subject}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-1 h-full">
            <div className="h-[550px]">
              <Chatbot user={user} emotion={emotion} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
