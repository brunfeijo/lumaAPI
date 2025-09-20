# Cypress API Tests — TypeScript (restful-api.dev)

## Prereqs
- Node 18+
- npm

## Install
```bash
npm i
```

## Run
Interactive:
```bash
npm run cy:open
```

Headless:
```bash
npm test
# or
npm run cy:run
```

## Notes
- Uses a small Page Object (`ApiClient`) for readability.
- Each test runs independently and creates/cleans up its own data where needed.
- Base URL is `https://api.restful-api.dev`.
