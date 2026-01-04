# Pastebin Lite

Pastebin Lite is a lightweight paste-sharing web application built using **React.js** and **Next.js (App Router)** with **Redis** as the persistent storage layer.  
It allows users to create text pastes with optional **time-based expiration (TTL)** and **maximum view limits**, and share them via unique URLs.

This project demonstrates a clean separation between **UI rendering** and **API-based access control**, similar to real-world paste-sharing platforms.

---

## 🚀 Features

- Create and share text pastes instantly
- Optional **TTL (Time To Live)** for automatic expiration
- Optional **Max Views** constraint
- Shareable public URL for each paste
- API-based view counting
- Persistent storage using Redis
- Clean, minimal dark-themed UI
- Fully server-rendered using Next.js App Router

---

## 🛠 Tech Stack

- **Frontend:** React.js
- **Framework:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** Redis (Vercel Redis / Redis Cloud)
- **Runtime:** Node.js
- **Styling:** CSS (globals.css)

---

## 📁 Project Structure

src/
├─ app/
│ ├─ api/
│ │ └─ pastes/
│ │ ├─ route.js # Create paste (POST)
│ │ └─ [id]/route.js # Fetch paste (GET, counts views)
│ ├─ p/
│ │ └─ [id]/page.jsx # Paste UI page (no view count)
│ ├─ page.jsx # Home page (create paste)
│ ├─ globals.css # Global styles
│ └─ layout.js
├─ lib/
│ ├─ store.js # Redis storage logic
│ └─ time.js # Time utilities


## 🔑 API Endpoints

### ➤ Create Paste

**Request Body**
```json
{
  "content": "Hello World",
  "ttl_seconds": 60,
  "max_views": 3
}
```
**Response**
```json
{
  "id": "uuid",
  "url": "/p/uuid"
}
```
### ➤ Fetch Paste (Consumes Views)
GET /api/pastes/:id
--
Increments the view count
Enforces max_views
Enforces TTL
Returns 404 if the paste is expired or the view limit is exceeded

### Paste View (UI Route)
GET /p/:id
--
Behavior

Displays the paste content in a readable format
Does not increment the view count
Enforces TTL only
Intended for human-readable access and sharing

Expiration Rules

### TTL (Time To Live):
The paste automatically expires after the specified number of seconds.

Max Views:
The paste expires after being accessed via the API endpoint the specified number of times.
Once expired, the paste returns 404 Not Found for both API and UI routes.
Only API requests (/api/pastes/:id) consume views.
UI page views (/p/:id) do not affect the view count.


### For Local Development and Running:
npm install
npm run dev
