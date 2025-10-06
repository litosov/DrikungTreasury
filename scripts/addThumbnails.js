// REMOVED: addThumbnails script — articles feature was removed from the project.
const API = process.env.API || 'http://localhost:4000'
const mapping = {
    'Введение в буддизм': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
    'Сутра Сердца (Праджняпарамита)': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60',
    'Медитация и внимательность': 'https://images.unsplash.com/photo-1509099836639-18ba52f4b0a9?auto=format&fit=crop&w=800&q=60'
}

async function api(path, opts) {
    const res = await fetch(`${API}${path}`, opts)
    if (!res.ok) throw new Error(await res.text())
    return res.json().catch(() => null)
}

; (async () => {
    try {
        const all = await api('/api/articles')
        for (const a of all) {
            if (mapping[a.title]) {
                await api(`/api/articles/${a._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ thumbnail: mapping[a.title] }) })
                console.log('Patched', a.title)
            }
        }
        console.log('Done')
    } catch (e) {
        console.error('Error', e)
        process.exit(1)
    }
})()
