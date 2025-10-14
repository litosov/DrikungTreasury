import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
// Import worker locally (Vite will bundle) to avoid CORS from CDN.
// For pdfjs-dist v5+, use the ESM worker (.mjs)
// eslint-disable-next-line import/no-unresolved
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFReader({ url }) {
    const [numPages, setNumPages] = React.useState(0)
    const [scale, setScale] = React.useState(1.0)
    const [error, setError] = React.useState(null)
    const [headOk, setHeadOk] = React.useState(true)
    const [headStatus, setHeadStatus] = React.useState(null)

    function onDocumentLoadSuccess({ numPages: n }) { setNumPages(n) }

    React.useEffect(() => {
        let cancelled = false
        setError(null)
        setHeadOk(true)
        setHeadStatus(null)
        if (!url) return
        console.debug('[PDF][HEAD] checking', url)
        fetch(url, { method: 'HEAD' })
            .then(r => { if (!cancelled) { setHeadOk(r.ok); setHeadStatus(r.status) } })
            .catch(e => { if (!cancelled) { console.error('[PDF][HEAD][ERROR]', e); setHeadOk(false); setHeadStatus(null); setError(e?.message || String(e)) } })
        return () => { cancelled = true }
    }, [url])

    return (
        <div className="bg-white p-4 rounded shadow w-full">
            <div className="flex items-center gap-2 mb-2">
                <div className="ml-auto flex items-center gap-2">
                    <button className="px-2 py-1 border" onClick={() => setScale(s => Math.max(0.5, s - 0.25))}>-</button>
                    <span>{Math.round(scale * 100)}%</span>
                    <button className="px-2 py-1 border" onClick={() => setScale(s => Math.min(3, s + 0.25))}>+</button>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
                {!headOk && (
                    <div className="p-3 bg-yellow-100 text-yellow-800 rounded w-full max-w-[800px]">
                        Cannot access PDF (status {headStatus ?? 'n/a'}). The file may be missing on the server. Try re-uploading.
                        <div className="mt-2">
                            <a className="text-blue-700 underline" href={url} target="_blank" rel="noreferrer">Open original in new tab</a>
                        </div>
                    </div>
                )}
                <Document file={url} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(e) => { console.error('[PDF][LOAD][ERROR]', e); setError(e?.message || String(e)) }}>
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded w-full max-w-[800px]">PDF load error: {error}
                            <div className="mt-2">
                                <a className="text-blue-700 underline" href={url} target="_blank" rel="noreferrer">Open original in new tab</a>
                            </div>
                        </div>
                    )}
                    {Array.from({ length: numPages }).map((_, idx) => (
                        <div key={idx} className="w-full flex justify-center">
                            <div className="max-w-[800px] w-full">
                                <Page pageNumber={idx + 1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} className="w-full" />
                            </div>
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    )
}
