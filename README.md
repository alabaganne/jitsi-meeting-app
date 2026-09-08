# Jitsi Meeting App

A video meeting application built with React and the Jitsi SDK. Features a clean light theme UI, user authentication, and complete meeting management.

![Jitsi Meet](https://img.shields.io/badge/Jitsi-Meet-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Ant Design](https://img.shields.io/badge/Ant%20Design-5-0170fe)

## Features

- **Video Conferencing** - HD video calls powered by Jitsi Meet SDK
- **Screen Sharing** - Share your screen with meeting participants
- **Chat** - In-meeting text chat functionality
- **Recording** - Record meetings for later review
- **Virtual Backgrounds** - Customize your video background
- **User Authentication** - Secure login and registration system
- **Meeting Management** - Create, schedule, and manage meetings
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Ant Design for UI components
- Tailwind CSS for styling
- React Router for navigation
- @jitsi/react-sdk for video conferencing

### Backend
- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alabaganne/jitsi-meeting-app.git
   cd jitsi-meet
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

   Create `server/.env`:
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:3000

2. **Start the frontend client**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

## Project Structure

```
jitsi-meet/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── JoinMeetingModal.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/        # React context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── MeetingContext.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Meet.tsx
│   │   │   ├── MyMeetings.tsx
│   │   │   ├── NewMeeting.tsx
│   │   │   └── MyProfile.tsx
│   │   ├── services/       # API services
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── index.css
│   └── package.json
├── server/                 # Express backend
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── meetings.js     # Meeting routes
│   ├── app.js              # Express app setup
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/change-password` | Change password |

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings` | List all user meetings |
| POST | `/api/meetings` | Create a new meeting |
| GET | `/api/meetings/:id` | Get meeting details |
| PUT | `/api/meetings/:id` | Update meeting |
| DELETE | `/api/meetings/:id` | Delete meeting |
| GET | `/api/meetings/join/:roomName` | Join meeting by room code |

## Usage

### Creating a Meeting
1. Log in or register an account
2. Click "New Meeting" in the sidebar
3. Choose "Instant Meeting" to start immediately, or "Schedule Meeting" to plan ahead
4. Share the meeting link with participants

### Joining a Meeting
1. Click "Join Meeting" in the sidebar
2. Enter the meeting code (e.g., `jitsi-abc123`)
3. Enter your display name (if not logged in)
4. Click "Join Meeting"

### Meeting Controls
- **Camera** - Toggle video on/off
- **Microphone** - Toggle audio on/off
- **Screen Share** - Share your screen
- **Chat** - Open text chat
- **Participants** - View participant list
- **Settings** - Adjust audio/video settings
- **Leave** - Exit the meeting

## Customization

### Theming
The app uses a light theme by default. Theme colors can be customized in:
- `client/src/components/Layout.tsx` - Ant Design theme config
- `client/src/index.css` - CSS custom properties

### Jitsi Configuration
Video conferencing settings can be modified in `client/src/pages/Meet.tsx`:
- `configOverwrite` - Meeting behavior settings
- `interfaceConfigOverwrite` - UI customization
- `toolbarButtons` - Available meeting controls

## Building for Production

```bash
# Build the client
cd client
npm run build

# The built files will be in client/dist/
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Jitsi Meet](https://jitsi.org/) - Open source video conferencing
- [Ant Design](https://ant.design/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Attribution and scope

Jitsi provides the conferencing engine. This repository contains the surrounding application, including authentication and meeting management. It is not the upstream Jitsi Meet project. Recording and other conference features depend on the configured Jitsi deployment.
