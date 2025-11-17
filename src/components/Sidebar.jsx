export default function Sidebar({ user, summary }) {
  const freq = summary?.frequency || {}
  const total = summary?.total || 0
  const pct = (k) => total ? Math.round((freq[k] || 0) * 100 / total) : 0
  return (
    <aside className="w-full md:w-72 shrink-0 border-r bg-white/80 backdrop-blur p-4 space-y-6">
      <div>
        <h3 className="text-xl font-semibold">{user?.name || 'User'}</h3>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Emotion Analysis</h4>
        <div className="space-y-1 text-sm">
          {['happy','sad','angry','confused','neutral'].map(e => (
            <div key={e} className="flex justify-between">
              <span className="capitalize">{e}</span>
              <span>{pct(e)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Growth so far</h4>
        <div className="h-2 bg-gray-200 rounded">
          <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded" style={{ width: `${Math.min(100, pct('happy') + pct('neutral'))}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-500">Derived from recent sessions</p>
      </div>
    </aside>
  )
}
