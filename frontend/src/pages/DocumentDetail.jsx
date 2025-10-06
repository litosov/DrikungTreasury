import React from 'react'
import PDFReader from '../components/PDFReader'

export default function DocumentDetail({ doc, onClose }) {
    const [which, setWhich] = React.useState('english') // 'english' or 'tibetan'

    if (!doc) return null

    const englishUrl = `http://localhost:4000/uploads/${doc.filename}`
    const tibetanUrl = doc.tibetTranslationFilename ? `http://localhost:4000/uploads/${doc.tibetTranslationFilename}` : null

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">{doc.title}</h2>
                    <p className="text-sm text-gray-600">{doc.excerpt}</p>
                </div>
                <div className="space-x-2">
                    <button className="px-3 py-1 border" onClick={onClose}>Back</button>
                </div>
            </div>

            <div className="mb-3">
                <span className={`px-3 py-1 mr-2 cursor-pointer ${which === 'english' ? 'bg-blue-600 text-white rounded' : 'border rounded'}`} onClick={() => setWhich('english')}>English</span>
                <span className={`px-3 py-1 mr-2 cursor-pointer ${which === 'tibetan' ? 'bg-blue-600 text-white rounded' : 'border rounded'}`} onClick={() => setWhich('tibetan')}>Tibetan</span>
            </div>

            <div>
                {which === 'english' && <PDFReader url={englishUrl} />}
                {which === 'tibetan' && tibetanUrl && <PDFReader url={tibetanUrl} />}
                {which === 'tibetan' && !tibetanUrl && <div className="p-4 bg-yellow-100 rounded">No Tibetan translation uploaded for this document.</div>}
            </div>
        </div>
    )
}
