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

    function onDocumentLoadSuccess({ numPages: n }) { setNumPages(n) }

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
                <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
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
