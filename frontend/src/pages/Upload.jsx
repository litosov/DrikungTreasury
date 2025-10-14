import React from 'react'
import axios from 'axios'
import { apiUrl } from '../lib/api'

export default function Upload() {
    const [title, setTitle] = React.useState('')
    const [excerpt, setExcerpt] = React.useState('')
    const [englishPdf, setEnglishPdf] = React.useState(null)
    const [tibetanPdf, setTibetanPdf] = React.useState(null)
    const [category, setCategory] = React.useState('')
    const [tags, setTags] = React.useState('')

    const submit = async () => {
        if (!englishPdf) { alert('Select English PDF'); return }
        const fd = new FormData()
        // send both legacy and explicit keys for compatibility
        fd.append('pdf', englishPdf)
        fd.append('english_pdf', englishPdf)
        if (tibetanPdf) { fd.append('tibet_pdf', tibetanPdf); fd.append('tibetan_pdf', tibetanPdf) }
        fd.append('title', title)
        fd.append('excerpt', excerpt)
        fd.append('category', category)
        fd.append('tags', tags)
        try {
            await axios.post(apiUrl('/api/documents'), fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            alert('Uploaded')
            setTitle(''); setExcerpt(''); setEnglishPdf(null); setTibetanPdf(null); setCategory('')
        } catch (e) { alert('Upload failed') }
    }

    return (
        <div>
            <h2 className="text-2xl font-medium mb-4">Upload Document</h2>
            <div className="space-y-3 bg-white p-4 rounded shadow">
                <input className="w-full border p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="w-full border p-2" placeholder="Excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} />
                <div>
                    <label className="block mb-1">English (PDF)</label>
                    <input type="file" accept="application/pdf" onChange={e => setEnglishPdf(e.target.files[0])} />
                </div>
                <div>
                    <label className="block mb-1">Tibetan translation (PDF)</label>
                    <input type="file" accept="application/pdf" onChange={e => setTibetanPdf(e.target.files[0])} />
                </div>
                <div>
                    <label className="block mb-1">Genre</label>
                    <select className="border p-2" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">(select genre)</option>
                        <option value="prayers & praises">Prayers & Praises</option>
                        <option value="songs">Songs</option>
                        <option value="instructions">Instructions</option>
                        <option value="philosophy">Philosophy</option>
                        <option value="history & biography">History & Biography</option>
                        <option value="arts & sciences">Arts & Sciences</option>
                        <option value="rituals">Rituals</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Tags (comma-separated)</label>
                    <input className="w-full border p-2" placeholder="e.g. tibet,poetry,translation" value={tags} onChange={e => setTags(e.target.value)} />
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-3 py-1 border" onClick={() => {
                        if (typeof onNavigate === 'function') return onNavigate('documents')
                        try { window.dispatchEvent(new CustomEvent('buda:navigate', { detail: 'documents' })) } catch (e) { const ev = document.createEvent('CustomEvent'); ev.initCustomEvent('buda:navigate', true, true, 'documents'); window.dispatchEvent(ev) }
                    }}>Back</button>
                    <button className="bg-green-600 text-white px-3 py-2" onClick={submit}>Upload</button>
                </div>
            </div>
        </div>
    )
}
