# Environment Configuration Guide

This project uses environment-specific configuration files to manage different deployment environments.

## Environment Files

The following environment files are available:

- **`.env.development`** - Development environment (local development)
- **`.env.staging`** - Staging environment (pre-production testing)
- **`.env.production`** - Production environment (live deployment)
- **`.env.example`** - Template file with all available variables

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the application.

### Available Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Application name | `OCPP Central Admin` |
| `VITE_APP_ENV` | Current environment | `development`, `staging`, `production` |
| `VITE_ENABLE_DEMO_MODE` | Enable demo mode with mock data | `true`, `false` |
| `VITE_ENABLE_DEBUG` | Enable debug logging | `true`, `false` |
| `VITE_AUTH_TOKEN_EXPIRY` | Auth token expiry time (ms) | `86400000` (24 hours) |
| `VITE_DEFAULT_LANGUAGE` | Default UI language | `en`, `tr` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `true`, `false` |

## NPM Scripts

### Development

```bash
# Start development server (uses .env.development)
npm run dev

# Start development server with staging config
npm run dev:staging
```

### Building

```bash
# Build for development
npm run build:dev

# Build for staging
npm run build:staging

# Build for production
npm run build:prod

# Default build (uses production config)
npm run build
```

### Preview

```bash
# Preview production build
npm run preview

# Preview staging build
npm run preview:staging

# Preview production build
npm run preview:prod
```

## Setup Instructions

### 1. Initial Setup

Copy the example environment file:

```bash
cp .env.example .env.development
```

### 2. Configure Variables

Edit `.env.development` and update the values according to your local setup:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_DEMO_MODE=true
```

### 3. Run Development Server

```bash
npm run dev
```

## Accessing Environment Variables in Code

Environment variables are accessed using `import.meta.env`:

```typescript
// Example: axios.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Example: checking environment
const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';
const isProduction = import.meta.env.VITE_APP_ENV === 'production';
```

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit** `.env.development`, `.env.staging`, or `.env.production` files to version control
2. Only commit `.env.example` as a template
3. **Never store** sensitive data (API keys, secrets, passwords) in environment files that are committed
4. Use environment variables from your CI/CD platform for sensitive production values
5. All `VITE_` prefixed variables are **publicly accessible** in the browser bundle

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build for Production
  run: npm run build:prod
  env:
    VITE_API_BASE_URL: ${{ secrets.PROD_API_URL }}
```

### Netlify/Vercel

Set environment variables in your deployment platform's dashboard:
- Development: Use `.env.development` values
- Staging: Use `.env.staging` values  
- Production: Use `.env.production` values

## Troubleshooting

### Variables Not Loading

1. Ensure variable names start with `VITE_`
2. Restart the dev server after changing environment files
3. Check that the correct mode is being used (`--mode development`)

### Build Issues

1. Verify TypeScript compilation: `npm run tsc`
2. Check that all required environment variables are set
3. Clear build cache: `rm -rf dist node_modules/.vite`

## Environment-Specific Features

### Development
- Demo mode enabled
- Debug logging enabled
- Local API endpoint
- Hot module replacement

### Staging
- Demo mode enabled (for testing)
- Debug logging enabled
- Staging API endpoint
- Analytics enabled

### Production
- Demo mode disabled
- Debug logging disabled
- Production API endpoint
- Analytics enabled
- Optimized builds
