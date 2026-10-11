# Deployment Guide

This guide provides instructions for deploying writespace to various platforms.

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Git

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, update the `VITE_API_BASE_URL` to point to your production API endpoint.

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/writespace)

### Manual Deployment

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Netlify Deployment

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/writespace)

### Manual Deployment

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Netlify:
   ```bash
   netlify deploy
   ```

4. For production deployment:
   ```bash
   netlify deploy --prod
   ```

## Docker Deployment

### Building the Docker Image

1. Create a `Dockerfile` in the root directory:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --production

EXPOSE 3000
CMD ["npx", "serve", "dist"]
```

2. Build the Docker image:
   ```bash
   docker build -t writespace .
   ```

3. Run the container:
   ```bash
   docker run -p 3000:3000 writespace
   ```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://your-api-url/api
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## AWS Amplify Deployment

1. Connect your GitHub repository to AWS Amplify.

2. Configure the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`

3. Add environment variables in the Amplify console.

4. Deploy the application.

## Google Cloud Run Deployment

1. Build the Docker image:
   ```bash
   docker build -t writespace .
   ```

2. Tag the image:
   ```bash
   docker tag writespace gcr.io/YOUR_PROJECT_ID/writespace
   ```

3. Push the image to Google Container Registry:
   ```bash
   docker push gcr.io/YOUR_PROJECT_ID/writespace
   ```

4. Deploy to Cloud Run:
   ```bash
   gcloud run deploy writespace \
     --image gcr.io/YOUR_PROJECT_ID/writespace \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## Azure Static Web Apps Deployment

1. Install the Azure Static Web Apps CLI:
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy using the CLI:
   ```bash
   swa deploy ./dist
   ```

## Configuration Options

### Custom Domain

For all platforms, you can configure a custom domain in the respective platform's settings.

### HTTPS

All major platforms (Vercel, Netlify, AWS, Google Cloud, Azure) provide automatic HTTPS with Let's Encrypt.

### Caching

Configure caching headers for static assets in your deployment platform to improve performance.

## CI/CD Setup

### GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Environment Variables in CI/CD

Add these secrets to your GitHub repository:
- `VERCEL_TOKEN` - Your Vercel access token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## Troubleshooting

### Build Failures

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Clear the build cache:
   ```bash
   npm run clean
   ```

3. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

### Deployment Issues

1. Verify environment variables are correctly set in your deployment platform.

2. Check the build logs for any errors.

3. Ensure the build output directory (`dist`) is correctly specified in your deployment configuration.

### Performance Optimization

1. Enable compression for static assets.

2. Configure proper caching headers.

3. Use a CDN for static assets.

## Rollback Procedure

### Vercel

1. Go to the project dashboard.
2. Select the deployment you want to roll back to.
3. Click "Promote to Production".

### Netlify

1. Go to the project dashboard.
2. Click on "Deploys".
3. Find the deploy you want to roll back to.
4. Click "Publish deploy".

### Docker

1. List available images:
   ```bash
   docker images
   ```

2. Run the previous version:
   ```bash
   docker run -p 3000:3000 writespace:<previous-tag>
   ```

## Monitoring

### Vercel Analytics

Enable Vercel Analytics in your project settings to monitor performance and usage.

### Sentry Error Tracking

Add Sentry to your project for error tracking:

1. Install Sentry SDK:
   ```bash
   npm install @sentry/react @sentry/vite
   ```

2. Configure Sentry in your `main.jsx`:
```javascript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

3. Add your Sentry DSN to environment variables.

## Scaling

### Horizontal Scaling

For platforms that support it (AWS, Google Cloud, Azure), configure auto-scaling based on traffic.

### Database Scaling

When scaling the application, consider:
- Using a managed database service
- Implementing connection pooling
- Adding read replicas for read-heavy workloads

## Backup and Recovery

### Regular Backups

1. Set up automated backups for your database.
2. Backup your application data regularly.

### Disaster Recovery

1. Maintain a copy of your Docker images in a container registry.
2. Store your deployment configuration in version control.
3. Document your recovery procedures.