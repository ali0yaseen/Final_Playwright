# Homework 3 — Playwright + TypeScript (PracticeSoftwareTesting.com)

This project is a complete **Playwright + TypeScript** E2E automation framework for:

- https://practicesoftwaretesting.com

It implements:
- ✅ Page Object Model (POM)
- ✅ Hooks (`beforeEach`, `afterEach`, etc.)
- ✅ Grouping with `test.describe`
- ✅ `.env` for test data + configuration
- ✅ Parameterized tests (sorting cases)
- ✅ Running on **2 browsers** (Chromium + Firefox)
- ✅ Login **once** (setup project) and reuse session via `storageState.json`

---

## 1) Install

```bash
npm install
npx playwright install
```

## 2) Create `.env`

```bash
copy .env.example .env
```
(or create a `.env` manually and copy the values)

## 3) Run

```bash
npm test
```

Run headed:

```bash
npm run test:headed
```

Run a specific browser:

```bash
npm run test:chromium
npm run test:firefox
```

Open HTML report:

```bash
npm run report
```

---

## Project Structure

```
src/
  pages/                # Page Objects (POM)
  utils/                # env, random helpers, price parsing

tests/
  auth.setup.ts         # login once + save storageState.json
  register.spec.ts      # register user
  login.spec.ts         # login + logout
  cart.add.spec.ts      # add to cart
  cart.remove.spec.ts   # remove from cart
  sort.spec.ts          # sort A-Z + price high-low (parameterized)
  filter.category.spec.ts
  filter.brand.spec.ts
  filter.price-range.spec.ts
  search.spec.ts
```

---

## Notes

- The **setup project** (`auth.setup.ts`) logs in once and saves `storageState.json`.
- All other tests automatically reuse that session (so we don't re-login in every test).
- `register.spec.ts` and `login.spec.ts` force a clean state to validate those flows.

---

## GitHub

1. Create a repo on GitHub.
2. Push this project:

```bash
git init
git add .
git commit -m "Homework 3: Playwright E2E (POM + env + multi-browser)"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```
