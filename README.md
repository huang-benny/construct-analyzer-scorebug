# CDK Construct Analyzer Web App

Simple web app to analyze and score npm packages using @cdklabs/cdk-construct-analyzer.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Link your local cdk-construct-analyzer package:
```bash
cd /path/to/cdk-construct-analyzer
yarn link

cd /path/to/this-project
yarn link @cdklabs/cdk-construct-analyzer
```

3. Run the dev server:
```bash
yarn dev
```

4. Open in browser:
```
http://localhost:3000?package=aws-cdk
```

## Usage

Add `?package=<npm-package-name>` to the URL to analyze any package:
- `http://localhost:3000?package=aws-cdk`
- `http://localhost:3000?package=@aws-cdk/core`
