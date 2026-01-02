# OCPP Central Admin Platform

A production-grade OCPP (Open Charge Point Protocol 1.6) Central System Management (CSMS) Admin Platform built with React, TypeScript, and modern web technologies.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - Global state management
- **JWT** - Authentication

## Project Structure

```
src/
  api/              # API client and endpoints
  features/         # Feature-based modules
    auth/           # Authentication
    charge-points/  # Charge point management
    dashboard/      # Dashboard and analytics
    transactions/   # Transaction management
  components/       # Reusable components
    ui/             # shadcn/ui components
    layout/         # Layout components
  hooks/            # Custom React hooks
  store/            # Zustand stores
  routes/           # Route definitions
  types/            # TypeScript types
  utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

3. Update `.env` with your API base URL:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### Authentication

- JWT-based authentication
- Protected routes
- Automatic token refresh handling
- Global 401 error handling

### Dashboard

- Location overview with statistics
- Real-time connector status visualization
- Session analytics charts
- Event feed
- Charge point listing

### Charge Point Management

- List all charge points
- View charge point details
- Connector status monitoring
- Remote commands (Start/Stop, Reset, Availability)

### OCPP Compliance

- Strict adherence to OCPP 1.6 specification
- Correct terminology (ChargePoint, Connector, Transaction)
- Proper command flow handling
- Status tracking

## API Integration

The platform expects a REST API with the following endpoints:

- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user
- `GET /charge-points` - List charge points
- `GET /charge-points/locations` - List locations
- `GET /charge-points/locations/:id` - Get location details
- `POST /charge-points/:id/remote-start` - Remote start transaction
- `POST /charge-points/:id/remote-stop` - Remote stop transaction
- `POST /charge-points/:id/reset` - Reset charge point
- `GET /transactions` - List transactions
- `GET /transactions/locations/:id/stats` - Location statistics

## Code Style

- Use TypeScript strict mode
- Follow feature-based architecture
- Keep components presentational
- Business logic in hooks/services
- Use React Query for server state
- Prefer Tailwind utility classes

## License

Private - Internal use only
