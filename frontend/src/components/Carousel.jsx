import React from 'react'

export default function Carousel({ items = [], interval = 4000, onSelect }) {
    const [idx, setIdx] = React.useState(0)
    React.useEffect(() => {
        if (items.length === 0) return
        const t = setInterval(() => setIdx(i => (i + 1) % items.length), interval)
        return () => clearInterval(t)
    }, [items, interval])

    if (items.length === 0) return null

    const prev = () => setIdx(i => (i - 1 + items.length) % items.length)
    const next = () => setIdx(i => (i + 1) % items.length)

    return (
        <div className="w-full mb-6">
            <div className="relative bg-white rounded shadow overflow-hidden h-40">
                {items.map((it, i) => (
                    <div key={it._id} className={`p-6 transition-opacity duration-500 ${i === idx ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'}`} onClick={() => onSelect && onSelect(it)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
                        {it.thumbnail && (
                            <img src={it.thumbnail} alt="thumb" className="w-full h-24 object-cover mb-2" />
                        )}
                        <h3 className="text-xl font-semibold">{it.title}</h3>
                        <p className="text-sm text-gray-600">{it.excerpt}</p>
                    </div>
                ))}

                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2">◀</button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2">▶</button>
            </div>
            <div className="flex justify-center mt-2 space-x-2">
                {items.map((_, i) => (
                    <button key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => setIdx(i)} />
                ))}
            </div>
        </div>
    )
}
