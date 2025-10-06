import React from 'react'

export default function Landing() {
    return (
        <div className="bg-gray-50">
            <header className="relative">
                <div className="h-72 bg-[url('/hero.jpg')] bg-center bg-cover flex items-center justify-center" style={{ backgroundColor: '#6b7280' }}>
                    <div className="text-center text-white">
                        <p className="text-sm uppercase tracking-wider">we are</p>
                        <h1 className="text-5xl font-bold tracking-tight">MINIMAL</h1>
                        <p className="mt-2 text-sm">DESIGN | DEVELOPMENT | SUCCESS</p>
                    </div>
                </div>
                <nav className="bg-white border-t">
                    <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
                        <div className="flex items-center space-x-6">
                            <a className="text-sm text-gray-600" href="#">Home</a>
                            <a className="text-sm text-gray-600" href="#">Services</a>
                            <a className="text-sm text-gray-600" href="#">Portfolio</a>
                            <a className="text-sm text-gray-600" href="#">About</a>
                        </div>
                        <div>
                            <span className="px-3 py-1 border">T</span>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="max-w-4xl mx-auto p-6">
                <section className="text-center py-12">
                    <h2 className="text-2xl font-serif">We design digital products.</h2>
                    <p className="mt-4 text-gray-600">Your brand, your product, your big idea...it is worth pursuing. We believe in creating opportunities for elite brands, intrepid startups, and passionate innovators to change the world.</p>
                </section>

                <section className="grid grid-cols-4 gap-6 text-center py-8">
                    <div className="p-6 bg-white rounded shadow">
                        <div className="text-2xl mb-3">💡</div>
                        <div className="font-semibold">Idea</div>
                    </div>
                    <div className="p-6 bg-white rounded shadow">
                        <div className="text-2xl mb-3">✏️</div>
                        <div className="font-semibold">Design</div>
                    </div>
                    <div className="p-6 bg-white rounded shadow">
                        <div className="text-2xl mb-3">⚙️</div>
                        <div className="font-semibold">Development</div>
                    </div>
                    <div className="p-6 bg-white rounded shadow">
                        <div className="text-2xl mb-3">🏆</div>
                        <div className="font-semibold">Success</div>
                    </div>
                </section>

                <section className="bg-gray-900 text-white rounded p-8 my-8">
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                        <div className="max-w-xl">
                            <h3 className="text-xl font-semibold">We design delightful digital experiences</h3>
                            <p className="mt-3 text-gray-300">We help organisations radically improve their websites and create exciting new digital products.</p>
                        </div>
                        <div className="mt-4 md:mt-0 grid grid-cols-3 gap-4">
                            <div className="p-3 border rounded text-center">Logo 1</div>
                            <div className="p-3 border rounded text-center">Logo 2</div>
                            <div className="p-3 border rounded text-center">Logo 3</div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-4">Recent work</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded shadow">Project 1</div>
                        <div className="bg-white p-4 rounded shadow">Project 2</div>
                        <div className="bg-white p-4 rounded shadow">Project 3</div>
                    </div>
                </section>
            </main>
        </div>
    )
}
