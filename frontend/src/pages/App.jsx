import React from 'react'
import Documents from './Documents'
import Upload from './Upload'
import DocumentDetail from './DocumentDetail'

export default function App() {
    const [view, setView] = React.useState('documents')
    const [selectedDoc, setSelectedDoc] = React.useState(null)

    function openDocument(doc) {
        setSelectedDoc(doc)
        setView('documents')
    }

    React.useEffect(() => {
        function handler(e) {
            const doc = e.detail
            console.log('App: received buda:openDocument', doc && doc._id)
            if (doc) openDocument(doc)
        }
        window.addEventListener('buda:openDocument', handler)
        function navHandler(e) {
            const v = e.detail
            if (v === 'upload') { setView('upload'); setSelectedDoc(null); return }
            if (v === 'documents') { setView('documents'); setSelectedDoc(null); return }
            // allow other handlers to set view if needed
        }
        window.addEventListener('buda:navigate', navHandler)
        return () => {
            window.removeEventListener('buda:openDocument', handler)
            window.removeEventListener('buda:navigate', navHandler)
        }
    }, [])

    function closeDocument() {
        setSelectedDoc(null)
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-6">
                {/* Title removed per user request */}
            </header>
            <main>
                {view === 'documents' && !selectedDoc && <Documents onSelect={openDocument} onNavigate={(v) => { setView(v); closeDocument() }} />}
                {selectedDoc && <DocumentDetail doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
                {view === 'upload' && <Upload />}
            </main>
        </div>
    )
}
