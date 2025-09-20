# Cypress API Tests — restful-api.dev (TypeScript)

This project demonstrates API testing with [Cypress](https://www.cypress.io/) and TypeScript.  
It covers GET, POST, PUT, and DELETE requests against the public API at [https://restful-api.dev](https://restful-api.dev).

---

## 🚀 Installation

### Prerequisites
- Node.js **18+**
- npm

### Setup
```bash
# clone this repo
git clone https://github.com/brunfeijo/lumaAPI.git
cd lumaAPI

# install dependencies
npm install
```

---

## ▶️ Running Tests

Interactive mode (headed):
```bash
npx cypress open
```

Headless mode (CI-friendly):
```bash
npm test
# or
npx cypress run
```

---

## ✅ Test Cases

The suite validates different HTTP methods and ensures each test runs independently:

### 1. **GET /objects — list**
- Fetch all resources
- Validate the response is a non-empty array (size > 0)

### 2. **GET /objects/:id — by ID**
- Pick an existing mock resource ID from the list
- Fetch it by ID
- Validate response shape (`id` and `name` fields exist)

### 3. **POST /objects — create**
- Create a new resource with a unique payload
- Store its ID
- Fetch it back by ID to confirm it was created successfully

### 4. **PUT /objects/:id — update**
- Create a fresh resource (test independence)
- Update the resource (change `name` and `color`)
- Validate both the immediate PUT response and a follow-up GET show the updated values

### 5. **DELETE /objects/:id — delete**
- Create a fresh resource
- Delete it by ID
- Confirm deletion by checking that a subsequent GET returns **404** or a “not found” message

