// REMOVED: article reset script — articles feature was removed from the project.
const API = process.env.API || 'http://localhost:4000'

async function api(path, opts) {
    const res = await fetch(`${API}${path}`, opts)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${await res.text()}`)
    return res.json().catch(() => null)
}

async function deleteAll() {
    const all = await api('/api/articles')
    for (const a of all) {
        try {
            await api(`/api/articles/${a._id}`, { method: 'DELETE' })
            console.log('Deleted', a._id)
        } catch (e) {
            console.error('Delete failed', a._id, e.message)
        }
    }
}

const articles = [
    {
        title: 'Введение в буддизм',
        excerpt: 'Краткое введение в основные понятия буддизма.',
        content: 'Буддизм — это путь, основанный на учениях Будды Шакьямуни. Основные идеи включают Четыре Благородные Истины и Восьмеричный Путь. Практические элементы включают медитацию, мораль и мудрость.'
    },
    {
        title: 'Сутра Сердца (Праджняпарамита)',
        excerpt: 'Краткое объяснение сутры о пустоте.',
        content: 'Сутра Сердца — одна из центральных махаянских сутр, кратко излагающая концепцию пустоты (шуньята). Она подчёркивает, что все феномены лишены самостоятельной сущности и возникают зависимо.'
    },
    {
        title: 'Медитация и внимательность',
        excerpt: 'Практики медитации внимательности и их влияние.',
        content: 'Внимательность (сати) — ключ к переходу от реактивности к ясному восприятию. Простые практики включают наблюдение за дыханием и внимательную ходьбу.'
    }
]

async function seed() {
    for (const a of articles) {
        const r = await api('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(a) })
        console.log('Inserted', r.title)
    }
}

(async () => {
    try {
        console.log('Deleting all articles...')
        await deleteAll()
        console.log('Seeding articles...')
        await seed()
        const all = await api('/api/articles')
        console.log('\nFinal articles:')
        all.forEach(a => console.log('-', a.title))
    } catch (e) {
        console.error('Error:', e)
        process.exit(1)
    }
})()
