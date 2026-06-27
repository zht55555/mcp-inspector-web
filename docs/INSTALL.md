# Install Guide

## Requirements

1. Node.js 20+.
2. npm for the Next.js app.
3. npm for the bridge service.

## Frontend Setup

```bash
cd mcp-inspector-web
npm install
npm run dev
```

The frontend runs on http://localhost:3000.

## Bridge Setup

```bash
cd mcp-inspector-web/bridge
npm install
npm run dev
```

The bridge runs on http://localhost:3001.

## Optional Environment

The frontend uses NEXT_PUBLIC_BRIDGE_URL to target the bridge base URL.
If not set, it defaults to http://localhost:3001.
