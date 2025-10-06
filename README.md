# Buda — Tibetan Translator Blog

This workspace contains a minimal full-stack example: an Express + MongoDB backend and a React + Vite + Tailwind frontend for uploading and viewing documents (PDFs) with Tibetan translations.

Quick start
1. Install MongoDB and start it locally (or use a hosted MongoDB). Default connection string: `mongodb://127.0.0.1:27017/buda`.
2. Backend
	 - Open a terminal in `backend` and run:
		 npm install
		 npm run dev
	 - Server will start on port 4000 by default. API endpoints:
	# Articles endpoints removed — this app now focuses on documents (PDFs) only.
		 - GET /api/documents
		 - POST /api/documents (multipart/form-data: fields `pdf` and optional `tibet_pdf`)

3. Frontend
	 - Open a terminal in `frontend` and run:
		 npm install
		 npm run dev
	 - Vite dev server runs on port 5173. The frontend expects the backend at `http://localhost:4000`.

Notes and next steps
- This is a minimal prototype. For production, consider adding authentication, input validation, and storing files in GridFS or cloud storage (S3).
- The `backend/uploads` directory stores uploaded PDF files; it's ignored by git.

Improvements and production considerations
- Authentication & admin UI: Add user accounts and restrict upload endpoints.
- File storage: Move PDFs to GridFS (MongoDB) or object storage (S3) for scalability and backups.
- Validation & security: Validate uploaded file types, limit sizes, and sanitize inputs.
- Deployment: Use process manager (PM2), Docker, and serve frontend statically behind a CDN.
- Internationalization: Add i18n support for UI and metadata for Tibetan language display.

If you'd like, I can:
- Add simple username/password auth for uploads
- Implement GridFS storage for PDFs
- Add a prettier UI and SEO-friendly article pages


