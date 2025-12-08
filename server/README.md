# Jitsi Meet API Server

Backend API server for the Jitsi Meet video conferencing application. Provides authentication and meeting management endpoints.

## Tech Stack

- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing
- MySQL (optional - uses in-memory storage by default)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MySQL (optional)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

3. **Initialize the database (optional)**

   If using MySQL, run the initialization script:
   ```bash
   mysql -u root -p < init-db.sql
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will run on http://localhost:3000

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | MySQL database name | `jitsi_meet` |

## API Endpoints

### Health Check

```
GET /
```
Returns server status and version.

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### Change Password
```
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Meetings

#### List Meetings
```
GET /api/meetings
Authorization: Bearer <token>
```

#### Create Meeting
```
POST /api/meetings
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Team Standup",
  "description": "Daily team sync",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "duration": 30,
  "inviteeEmails": ["user1@example.com", "user2@example.com"]
}
```

#### Get Meeting
```
GET /api/meetings/:id
Authorization: Bearer <token>
```

#### Update Meeting
```
PUT /api/meetings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Meeting Name",
  "description": "Updated description"
}
```

#### Delete Meeting
```
DELETE /api/meetings/:id
Authorization: Bearer <token>
```

#### Join Meeting (Public)
```
GET /api/meetings/join/:roomName
```

## Database Schema

The application can use MySQL for persistent storage. Run `init-db.sql` to create the required tables:

```sql
-- Users table
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meetings table
CREATE TABLE meeting (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  room_name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  organizer_id INT NOT NULL,
  scheduled_at TIMESTAMP,
  duration INT DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES user(id)
);

-- Meeting invitees table
CREATE TABLE invitee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  meeting_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
  FOREIGN KEY (meeting_id) REFERENCES meeting(id) ON DELETE CASCADE
);
```

## Project Structure

```
server/
├── routes/
│   ├── auth.js        # Authentication routes
│   └── meetings.js    # Meeting management routes
├── app.js             # Express app setup
├── connection.js      # Database connection (optional)
├── init-db.sql        # Database initialization script
├── package.json
├── .env.example       # Example environment variables
└── README.md
```

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Security

- Passwords are hashed using bcryptjs (10 rounds)
- JWT tokens expire after 7 days
- All meeting endpoints require authentication (except join by room name)
- CORS is enabled for cross-origin requests

## Development

```bash
# Run with auto-reload
npm run dev

# Run tests (not implemented yet)
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong, unique `JWT_SECRET`
3. Configure MySQL for persistent storage
4. Use a process manager like PM2
5. Set up HTTPS with a reverse proxy (nginx)

```bash
# Example with PM2
npm install -g pm2
pm2 start app.js --name jitsi-api
```
