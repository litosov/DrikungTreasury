import React from 'react'
import axios from 'axios'
import { API_BASE, fileUrl, apiUrl } from '../lib/api'
import PDFReader from '../components/PDFReader'

export default function Documents({ onSelect }) {
    const [docs, setDocs] = React.useState([])
    const [q, setQ] = React.useState('')
    const [category, setCategory] = React.useState('')

    const fetch = React.useCallback(() => {
        const params = {}
        if (q) params.q = q
        if (category) params.category = category
    axios.get(apiUrl('/api/documents'), { params }).then(r => setDocs(r.data)).catch(() => { })
    }, [q, category])

    React.useEffect(() => { fetch() }, [fetch])

    const [page, setPage] = React.useState(0)
    const perPage = 5

    const openDoc = (d) => {
        if (onSelect) return onSelect(d)
        try {
            window.dispatchEvent(new CustomEvent('buda:openDocument', { detail: d }))
        } catch (e) {
            const ev = document.createEvent('CustomEvent')
            ev.initCustomEvent('buda:openDocument', true, true, d)
            window.dispatchEvent(ev)
        }
    }

    const pages = Math.max(1, Math.ceil(docs.length / perPage))
    const visible = docs.slice(page * perPage, page * perPage + perPage)

    return (
        <div>
            <div className="bg-gray-800 text-white p-4 rounded mb-6 flex items-center justify-between">
                <div>
                    <div className="text-lg font-semibold">Drikung Treasury</div>
                    <div className="text-sm text-gray-300">Browse catalogue — select a genre</div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-orange-500 text-white px-3 py-1 rounded">Donate</button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => {
                        if (typeof onNavigate === 'function') return onNavigate('upload')
                        try { window.dispatchEvent(new CustomEvent('buda:navigate', { detail: 'upload' })) } catch (e) { const ev = document.createEvent('CustomEvent'); ev.initCustomEvent('buda:navigate', true, true, 'upload'); window.dispatchEvent(ev) }
                    }}>Upload</button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <aside className="col-span-12 md:col-span-3 bg-white p-4 rounded shadow">
                    <h4 className="font-semibold mb-3">Genre</h4>
                    <div className="mt-1">
                        <select className="w-full border p-2" value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="">All genres</option>
                            <option value="prayers & praises">Prayers & Praises</option>
                            <option value="songs">Songs</option>
                            <option value="instructions">Instructions</option>
                            <option value="philosophy">Philosophy</option>
                            <option value="history & biography">History & Biography</option>
                            <option value="arts & sciences">Arts & Sciences</option>
                            <option value="rituals">Rituals</option>
                        </select>
                        <button className="mt-3 w-full bg-blue-600 text-white px-3 py-2" onClick={() => { setPage(0); fetch() }}>Apply</button>
                    </div>
                </aside>

                <section className="col-span-12 md:col-span-9">
                    <div className="space-y-4">
                        {visible.map(d => (
                            <div key={d._id} className="p-4 bg-white rounded shadow flex flex-col md:flex-row md:justify-between items-start">
                                <div className="flex-1 md:pr-4">
                                    <h3 className="font-semibold text-lg cursor-pointer hover:text-blue-600" onClick={() => openDoc(d)}>{d.title}</h3>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{d.excerpt}</p>
                                    <div className="mt-2 text-xs text-gray-500">Genre: {d.category || '—'}</div>
                                </div>
                                <div className="mt-3 md:mt-0 md:ml-4 flex flex-row md:flex-col items-center md:items-end gap-2">
                                    <a className="text-blue-600 text-sm" href={fileUrl(d.filename)} target="_blank" rel="noreferrer">Download</a>
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => openDoc(d)}>Read Text</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-center items-center space-x-3">
                        {Array.from({ length: pages }).map((_, i) => (
                            <button key={i} className={`w-3 h-3 rounded-full ${i === page ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => setPage(i)} aria-label={`Page ${i + 1}`}></button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
