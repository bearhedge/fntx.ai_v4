# Deployment Guide for FNTX.ai with Deepseek Integration

This guide provides step-by-step instructions for deploying the FNTX.ai application with Deepseek AI integration to Vercel.

## Prerequisites

- A Vercel account
- A Deepseek API key (obtain from [Deepseek Platform](https://platform.deepseek.com/api_keys))
- Node.js and npm installed locally

## Deployment Steps

### 1. Prepare Your Environment Variables

Create a `.env.production` file in the server directory with the following content:

```
PORT=3000
DEEPSEEK_API_KEY=your-actual-deepseek-api-key
NODE_ENV=production
USE_MOCK=false
```

Replace `your-actual-deepseek-api-key` with your real Deepseek API key.

### 2. Install Vercel CLI

If you haven't already installed the Vercel CLI, run:

```bash
npm install -g vercel
```

### 3. Configure Vercel for Deployment

Create a `vercel.json` file in the project root with the following configuration:

```json
{
  "version": 2,
  "builds": [
    { "src": "server/index.js", "use": "@vercel/node" },
    { "src": "*.html", "use": "@vercel/static" },
    { "src": "css/**", "use": "@vercel/static" },
    { "src": "js/**", "use": "@vercel/static" },
    { "src": "images/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.js" },
    { "src": "/(.*)", "dest": "/$1" }
  ],
  "env": {
    "DEEPSEEK_API_KEY": "@deepseek-api-key",
    "NODE_ENV": "production",
    "USE_MOCK": "false"
  }
}
```

### 4. Set Up Vercel Secrets

Use the Vercel CLI to set up your API key as a secret:

```bash
vercel secrets add deepseek-api-key your-actual-deepseek-api-key
```

### 5. Deploy to Vercel

Run the following command from the project root:

```bash
vercel --prod
```

Follow the prompts to link your project to your Vercel account and complete the deployment.

### 6. Verify Deployment

After deployment completes, Vercel will provide a URL for your application. Open this URL in a browser to verify that the application is working correctly.

## Troubleshooting

### API Connection Issues

If the application deploys but cannot connect to the Deepseek API:

1. Check that your API key is correctly set in Vercel environment variables
2. Verify that the API key has the necessary permissions
3. Check the Vercel logs for any error messages

### Static Content Not Loading

If the application loads but CSS or JavaScript files are missing:

1. Ensure all file paths in HTML files are relative and correct
2. Check that all files are included in the `builds` section of `vercel.json`

### Server-Side Errors

If you encounter server-side errors:

1. Check the Vercel logs for error messages
2. Verify that all required environment variables are set
3. Ensure the server code is compatible with Vercel's serverless environment

## Monitoring and Maintenance

After deployment, regularly monitor your application:

1. Check Vercel analytics for usage patterns
2. Monitor Deepseek API usage to avoid exceeding limits
3. Update the Deepseek API key if necessary

## Updating the Deployment

To update your application after making changes:

1. Make and test your changes locally
2. Commit the changes to your repository
3. Run `vercel --prod` again to deploy the updates

## Switching Between Mock and Real API

For testing purposes, you can switch between the mock API and the real Deepseek API by changing the `USE_MOCK` environment variable in Vercel.
