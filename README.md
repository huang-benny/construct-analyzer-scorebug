# CDK Construct Scorer

A Next.js application for analyzing and scoring CDK constructs.

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Run the development server:
```bash
yarn dev
```

3. Open [http://localhost:3000?package=aws-cdk](http://localhost:3000?package=aws-cdk) in your browser.

## Usage

Add a package name as a query parameter:
```
http://localhost:3000?package=your-package-name
```

## Deployment

This app is configured for AWS Amplify deployment with the included `amplify.yml` configuration.

### Deploy to Amplify:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to AWS Amplify Console
3. Connect your repository
4. Amplify will automatically detect the Next.js app and use the `amplify.yml` configuration
5. Deploy!

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `app/page.tsx` - Main page component
- `app/api/analyze/[packageName]/route.ts` - API endpoint for package analysis
- `app/styles.css` - Global styles
- `amplify.yml` - Amplify build configuration

## API

### GET /api/analyze/[packageName]

Returns analysis data for the specified package.

**Response:**
```json
{
  "packageName": "string",
  "version": "string",
  "totalScore": number,
  "pillarScores": {
    "SECURITY": number,
    "RELIABILITY": number,
    "PERFORMANCE": number,
    "MAINTAINABILITY": number
  },
  "signalScores": { ... },
  "signalWeights": { ... }
}
```
