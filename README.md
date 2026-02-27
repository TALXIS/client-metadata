# @talxis/metadata

> This repo is Work in Progress.

This package is used to provide unified access and strongly typed metadata across hosts in Power Platform and TALXIS Portal.

## Installation

```bash
npm install @talxis/metadata
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Build in watch mode
npm run build:watch
```

## Publishing

This package is automatically published to NPM when a new release is created on GitHub.

### Setup Instructions

1. **Create an NPM token:**
   - Go to [npmjs.com](https://www.npmjs.com/) and log in
   - Navigate to Access Tokens in your account settings
   - Generate a new "Automation" token

2. **Add NPM token to GitHub:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Create a new repository secret named `NPM_TOKEN`
   - Paste your NPM token as the value

3. **Create a release:**
   - Go to the Releases page on GitHub
   - Click "Create a new release"
   - Create a new tag with the format `vX.Y.Z` (e.g., `v1.0.0`)
   - Publish the release

The GitHub Action will automatically:
- Extract the version from the release tag
- Update `package.json` with the new version
- Build the package
- Publish to NPM
- Commit the version change back to the repository