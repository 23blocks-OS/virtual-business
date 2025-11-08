# Virtual Office Frontend

3D virtual office built with React, Three.js, and React Three Fiber.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/xr** - WebXR support for VR/AR
- **Zustand** - State management
- **Socket.io Client** - Real-time communication

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- 3D virtual office environment
- AI agent avatars with unique colors and positions
- Click-to-interact functionality
- Floating chat boards
- Real-time communication via WebSocket
- WebXR support for Apple Vision Pro
- Responsive design

## Project Structure

```
src/
├── components/
│   ├── VirtualOffice.tsx    # Main 3D canvas
│   ├── Room.tsx              # 3D room geometry
│   ├── AgentAvatar.tsx       # Individual agent 3D avatar
│   ├── ChatBoard.tsx         # 2D chat interface
│   └── ChatBoard.css         # Chat styles
├── store/
│   └── useStore.ts           # Zustand state management
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Root component
├── App.css                   # Global styles
└── main.tsx                  # Entry point
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## Vision Pro Optimization

The application uses WebXR for immersive experiences:
- VR mode button automatically appears
- Hand tracking support
- Spatial controls
- Optimized rendering

## Controls

- **Mouse**: Drag to rotate, scroll to zoom
- **Click**: Interact with agents
- **VR Button**: Enter immersive mode on compatible devices

## Development

The frontend connects to the backend via:
- REST API for static data
- WebSocket for real-time agent communication

Make sure the backend is running on port 3000 (or update `.env`).
