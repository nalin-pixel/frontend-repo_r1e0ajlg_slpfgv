import { useEffect, useRef, useState } from 'react'

export default function CameraEmotion({ onEmotion }) {
  const videoRef = useRef(null)
  const [emotion, setEmotion] = useState('neutral')

  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        console.error('Camera error', e)
      }
    }
    start()

    // naive mock emotion changes for demo; real model could be integrated later
    const emotions = ['happy','sad','angry','confused','neutral']
    const id = setInterval(() => {
      const next = emotions[Math.floor(Math.random()*emotions.length)]
      setEmotion(next)
      onEmotion?.(next)
    }, 8000)
    return () => clearInterval(id)
  }, [onEmotion])

  return (
    <div className="bg-black/80 rounded-xl overflow-hidden">
      <video ref={videoRef} className="w-full aspect-video object-cover" muted playsInline />
      <div className={`px-3 py-2 text-sm text-white ${emotion==='happy'?'bg-green-600':emotion==='sad'?'bg-blue-600':emotion==='angry'?'bg-red-600':emotion==='confused'?'bg-amber-600':'bg-gray-700'}`}>
        Detected emotion: <span className="font-semibold capitalize">{emotion}</span>
      </div>
    </div>
  )
}
