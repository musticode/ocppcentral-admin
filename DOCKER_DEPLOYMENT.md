# Docker Deployment Guide

This guide covers deploying the OCPP Central Admin application using Docker, specifically optimized for Coolify deployment.

## Overview

The application uses a multi-stage Docker build:
1. **Builder stage**: Builds the React application using Node.js
2. **Production stage**: Serves the built files using nginx

## Files

- **`Dockerfile`** - Multi-stage production build
- **`nginx.conf`** - Nginx configuration for serving the SPA
- **`.dockerignore`** - Excludes unnecessary files from Docker build
- **`docker-compose.yml`** - Local testing configuration

## Quick Start

### Local Testing with Docker

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The application will be available at `http://localhost:8080`

### Manual Docker Build

```bash
# Build the image
docker build -t ocppcentral-admin:latest .

# Run the container
docker run -d \
  --name ocppcentral-admin \
  -p 8080:80 \
  ocppcentral-admin:latest

# View logs
docker logs -f ocppcentral-admin

# Stop and remove
docker stop ocppcentral-admin
docker rm ocppcentral-admin
```

## Coolify Deployment

Coolify is a self-hosted platform for deploying applications. Follow these steps to deploy on Coolify:

### Prerequisites

1. Coolify instance running and accessible
2. Git repository connected to Coolify
3. Domain name (optional but recommended)

### Deployment Steps

#### 1. Create New Resource in Coolify

1. Log in to your Coolify dashboard
2. Click **"+ New Resource"**
3. Select **"Docker Compose"** or **"Dockerfile"**
4. Connect your Git repository

#### 2. Configure Build Settings

**Build Configuration:**
- **Build Pack**: Dockerfile
- **Dockerfile Location**: `./Dockerfile`
- **Build Context**: `.`

#### 3. Set Environment Variables

In Coolify's environment variables section, add:

```env
VITE_API_BASE_URL=https://api.ocppcentral.com/api
VITE_APP_NAME=OCPP Central Admin
VITE_APP_ENV=production
VITE_ENABLE_DEMO_MODE=false
VITE_ENABLE_DEBUG=false
VITE_AUTH_TOKEN_EXPIRY=86400000
VITE_DEFAULT_LANGUAGE=en
VITE_ENABLE_ANALYTICS=true
```

**Important**: Environment variables must be set **before** building, as they are baked into the build during the `npm run build:prod` step.

#### 4. Configure Port Mapping

- **Container Port**: 80
- **Public Port**: 80 (or your preferred port)
- Coolify will handle SSL/TLS automatically if you configure a domain

#### 5. Configure Domain (Optional)

1. Go to **Domains** section
2. Add your domain: `admin.ocppcentral.com`
3. Coolify will automatically provision SSL certificate via Let's Encrypt

#### 6. Deploy

1. Click **"Deploy"**
2. Monitor the build logs
3. Once deployed, access your application at the configured domain

### Coolify Configuration File

Alternatively, you can use a `coolify.json` configuration:

```json
{
  "name": "ocppcentral-admin",
  "type": "dockerfile",
  "dockerfile": "Dockerfile",
  "port": 80,
  "healthcheck": {
    "path": "/health",
    "interval": 30,
    "timeout": 3,
    "retries": 3
  },
  "environment": {
    "VITE_API_BASE_URL": "https://api.ocppcentral.com/api",
    "VITE_APP_ENV": "production",
    "VITE_ENABLE_DEMO_MODE": "false",
    "VITE_ENABLE_DEBUG": "false"
  }
}
```

## Environment Variables

### Build-time Variables

All `VITE_*` variables are **build-time** variables. They are embedded into the JavaScript bundle during the build process.

**Important**: To change environment variables, you must:
1. Update the variables in Coolify
2. Trigger a new build/deployment

### Available Variables

| Variable | Description | Production Default |
|----------|-------------|-------------------|
| `VITE_API_BASE_URL` | Backend API endpoint | `https://api.ocppcentral.com/api` |
| `VITE_APP_NAME` | Application name | `OCPP Central Admin` |
| `VITE_APP_ENV` | Environment identifier | `production` |
| `VITE_ENABLE_DEMO_MODE` | Enable demo mode | `false` |
| `VITE_ENABLE_DEBUG` | Enable debug logging | `false` |
| `VITE_AUTH_TOKEN_EXPIRY` | Token expiry (ms) | `86400000` |
| `VITE_DEFAULT_LANGUAGE` | Default language | `en` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `true` |

## Nginx Configuration

The included `nginx.conf` provides:

### Features
- ✅ SPA routing support (all routes serve `index.html`)
- ✅ Gzip compression for better performance
- ✅ Security headers (XSS, frame options, etc.)
- ✅ Static asset caching (1 year for immutable assets)
- ✅ Health check endpoint at `/health`
- ✅ Hidden files protection

### Custom Configuration

To modify nginx settings, edit `nginx.conf` and rebuild:

```bash
docker build -t ocppcentral-admin:latest .
```

## Health Checks

The application includes a health check endpoint:

```bash
# Check application health
curl http://localhost:8080/health

# Expected response
healthy
```

Docker health checks run automatically every 30 seconds.

## Performance Optimization

### Image Size
- Multi-stage build reduces final image size
- Only production dependencies included
- nginx alpine base (~50MB total)

### Caching
- Static assets cached for 1 year
- HTML files not cached (always fresh)
- Gzip compression enabled

### Security
- Non-root nginx process
- Security headers enabled
- Hidden files blocked
- Minimal attack surface

## Troubleshooting

### Build Fails

**Issue**: Build fails during npm install
```bash
# Check Node version compatibility
docker build --no-cache -t ocppcentral-admin:latest .
```

**Issue**: Environment variables not working
- Ensure variables are set **before** build
- Rebuild after changing environment variables
- Check variable names start with `VITE_`

### Runtime Issues

**Issue**: 404 errors on routes
- Check nginx.conf has `try_files $uri $uri/ /index.html;`
- Verify build output exists in `/usr/share/nginx/html`

**Issue**: API calls failing
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings on backend
- Inspect browser console for errors

### Logs

```bash
# Docker logs
docker logs ocppcentral-admin

# Follow logs
docker logs -f ocppcentral-admin

# Coolify logs
# Available in Coolify dashboard under "Logs" tab
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Coolify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Trigger Coolify Deployment
        run: |
          curl -X POST ${{ secrets.COOLIFY_WEBHOOK_URL }}
```

### GitLab CI Example

```yaml
deploy:
  stage: deploy
  script:
    - curl -X POST $COOLIFY_WEBHOOK_URL
  only:
    - main
```

## Monitoring

### Resource Usage

```bash
# Check container stats
docker stats ocppcentral-admin

# Check disk usage
docker system df
```

### Application Metrics

Monitor these in Coolify dashboard:
- CPU usage
- Memory usage
- Network I/O
- Response times
- Error rates

## Scaling

### Horizontal Scaling

Deploy multiple instances behind a load balancer:

```bash
# Scale with docker-compose
docker-compose up -d --scale ocppcentral-admin=3
```

### Vertical Scaling

Adjust container resources in Coolify:
- CPU limits
- Memory limits
- Restart policies

## Backup and Recovery

### Backup

No persistent data in the container (stateless application).
Backup your:
- Git repository
- Environment variables configuration
- Custom nginx.conf (if modified)

### Recovery

Redeploy from Git repository with saved environment variables.

## Security Best Practices

1. **Use HTTPS**: Always enable SSL/TLS in Coolify
2. **Environment Variables**: Never commit secrets to Git
3. **Regular Updates**: Keep base images updated
4. **Monitoring**: Enable logging and monitoring
5. **Access Control**: Restrict Coolify dashboard access

## Support

For issues related to:
- **Application**: Check application logs
- **Docker**: Check Docker logs and build output
- **Coolify**: Check Coolify documentation
- **Nginx**: Check nginx error logs in container

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
