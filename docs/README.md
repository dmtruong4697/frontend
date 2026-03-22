# Random Chat Frontend

This is a modern Next.js 15+ frontend application designed to interact with the Random Chat Go backend `rcbe`. It provides Google Authentication, a minimal Profile setup, matchmaking, and a real-time WebSocket 1-on-1 chat experience.

## ✨ Features
- **Modern UI:** Built using Tailwind CSS, `lucide-react`, and raw minimalist styling. flexbox/grid layout and absolute responsiveness.
- **State Management:** Fully integrated with `Zustand` (`useAuthStore`, `useMatchStore`, `useChatStore`)
- **Real-time WebSockets:** A custom React hook manages seamless realtime messaging connection to the Go backend.
- **Google Login Integration:** Secure authentication handled gracefully via `@react-oauth/google`.

## 📁 Project Structure

```bash
src/
├── app/                  # Next.js App Router (pages: login, home, chat)
├── components/           # Reusable UI components & layouts
├── hooks/                # Custom React hooks (e.g., useWebSocket)
├── services/             # Axios API client setup and interceptors
├── stores/               # Zustand global state (auth, match, chat)
└── types/                # Shared TypeScript interfaces
```

## ⚙️ Environment Configuration

You must create environment files (`.env.dev` and `.env.prod`) before running the app.
These files define how the frontend connects to the `rcbe` backend.

Example `.env.dev`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```
*Note: Ensure your Google Client ID is authorized for `http://localhost:8081` during local development.*

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup environment variables:**
   Ensure your `.env.dev` contains the correct paths matching your local running Go backend API port.
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **View the Application:**
   Open [http://localhost:8081](http://localhost:8081)

## 🐳 Docker Build & Deploy

This project is configured using Next.js standalone output to keep the container lightweight and fast.

1. **Build the image:**
   ```bash
   docker build -t random-chat-frontend .
   ```
2. **Run the container:**
   ```bash
   docker run -p 8081:8081 random-chat-frontend
   ```
*(You may pass runtime environment variables directly down to Next.js using docker run `-e NEXT_PUBLIC_API_URL=...` as needed depending on your infrastructure).*

## 📖 Flows

### Auth Flow
1. User arrives at `/login`.
2. Completes Google OAuth sign-in.
3. React application receives `id_token` and POSTs it to `rcbe` at `/api/auth/google`.
4. `rcbe` returns a JWT; the frontend saves it in memory/localStorage via `Zustand`.
5. User is redirected to `/home`.

### Chat Flow
1. Authenticated user clicks "Find Stranger" on `/home`.
2. Makes an API POST to `/api/match/start`.
3. Backend creates a match room and returns `room_id`.
4. Frontend updates state and navigates to `/chat`.
5. `useWebSocket` hook auto-connects to `ws://DOMAIN/ws?room=<room_id>`.
6. Client and standard begin real-time communication by exchanging `Message` proto structures.
