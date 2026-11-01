# RevTech — Repairability & Ownership Intelligence

RevTech is a consumer electronics repairability directory, spare-parts discovery platform, and AI-powered lifecycle decision suite built with React, Vite, Express, Tailwind CSS, and the Google GenAI SDK (Gemini 3.8 Flash).

---

## Running Locally on Your Machine (`http://localhost:3000`)

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

---

### Step 1: Clone or Download the Code
Download this project repository to your local computer and open your terminal inside the project directory:
```bash
cd revtech
```

---

### Step 2: Install Dependencies
```bash
npm install
```

---

### Step 3: Configure Environment Variables
Create a `.env` file in the root folder (or copy `.env.example`):
```bash
cp .env.example .env
```
Inside `.env`, provide your Gemini API key (optional for core features, as offline algorithmic fallback is built-in):
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```
> You can generate a free Gemini API key at [Google AI Studio](https://aistudio.google.com/).

---

### Step 4: Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## Production Build & Run

To build for production:
```bash
npm run build
npm start
```

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / API**: Express 4 with Vite middlewares and `@google/genai` SDK
- **Models**: `gemini-3.8-flash` for lifecycle repair vs. replace decisions, pre-purchase worthiness evaluations, and safe hardware diagnostics
- **Local Persistence**: `localStorage` for user auth sessions and personal smartphone garage
