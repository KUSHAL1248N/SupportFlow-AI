# SupportFlow AI — AI-Assisted Customer Support Workspace

SupportFlow AI is an original full-stack customer-support workspace. Teams can track customer tickets, manage replies and status, and use Google's Gemini API to draft support responses, summarize conversations and classify ticket priority. AI output is always a draft for a human to review; it is never sent automatically.

## Technology
- **Frontend:** React 18, TypeScript, Vite, React Router, React Context API, React hooks, Axios
- **Backend:** Node.js 20+, NestJS 11, REST APIs, Passport JWT, class-validator
- **Database:** MongoDB 7, Mongoose
- **AI integration:** Google Gemini API through the official `@google/genai` SDK; the API key stays on the backend
- **Engineering:** Docker Compose, Jest, Vitest, GitHub Actions, Swagger/OpenAPI

## Features
- Register and sign in with bcrypt password hashing
- JWT-protected endpoints and per-user ticket access
- Create, filter, search and update support tickets
- Ticket status and priority workflows
- Conversation replies stored with ticket history
- Dashboard metrics for open, in-progress, waiting and resolved tickets
- AI-generated reply drafts with selectable tone (professional, friendly, concise)
- AI conversation summaries for faster handovers
- AI ticket classification (category, priority and sentiment) with server-side validation of returned values
- AI output is shown for review; the application never sends an AI draft automatically
- Request validation, centralized error responses, Helmet security headers
- Swagger API docs at `/docs`

## Quick start (Windows + Docker)

Requirements: Docker Desktop and a Gemini API key for AI features. The core ticket application works without a Gemini key; AI actions return a clear configuration error until one is added.

1. Copy `server/.env.example` to `server/.env`.
2. Open `server/.env` and replace `JWT_SECRET` with a long random secret. Add your Gemini key to `GEMINI_API_KEY` (AI actions remain disabled until this is configured).
3. From the project root, run:

```powershell
docker compose up --build
```

4. Open the app at **http://localhost:8082**.
5. API health: **http://localhost:4002/api/health**.
6. Swagger: **http://localhost:4002/docs**.

On Windows, `start-local.bat` checks for the local environment file and starts Docker Compose. `stop-local.bat` stops the services. Never commit `server/.env` or expose `GEMINI_API_KEY` in frontend variables.

## Local development without Docker

1. Start MongoDB locally or create a MongoDB Atlas database.
2. In `server`, run `npm install`, copy `.env.example` to `.env`, configure `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`, then run `npm run start:dev`.
3. In `client`, run `npm install`, copy `.env.example` to `.env`, then run `npm run dev`.
4. Open `http://localhost:5173`.

## Gemini API setup

1. Create an API key in Google AI Studio: https://aistudio.google.com/app/apikey
2. Put it only in `server/.env` as `GEMINI_API_KEY=...`.
3. The default model is `gemini-3.8-flash`; set `GEMINI_MODEL` to another model available to your Google AI Studio project if needed.
4. Restart the backend after changing the key.

The frontend calls your NestJS API. The NestJS server calls Gemini. The key is never sent to the browser. Gemini may have quotas, billing or region/account access limits; check your Google AI Studio account before relying on the feature in a live demo.

## Main API routes

All application routes use `/api`.

| Method | Route | Purpose | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account | No |
| POST | `/auth/login` | Sign in | No |
| GET | `/auth/me` | Current profile | Yes |
| GET | `/tickets` | List/search current user's tickets | Yes |
| POST | `/tickets` | Create ticket | Yes |
| GET | `/tickets/summary` | Ticket dashboard metrics | Yes |
| GET | `/tickets/:id` | Ticket details and conversation | Yes |
| PATCH | `/tickets/:id` | Update ticket status/priority | Yes |
| POST | `/tickets/:id/replies` | Add a reply to the conversation | Yes |
| POST | `/ai/tickets/:id/draft-reply` | Generate a reply draft | Yes + Gemini key |
| POST | `/ai/tickets/:id/summarize` | Summarize the conversation | Yes + Gemini key |
| POST | `/ai/tickets/:id/classify` | Classify category, priority and sentiment | Yes + Gemini key |

## AI safety and reliability

- Ticket content is untrusted input. It is quoted as context and the model is instructed not to follow instructions embedded in customer messages.
- AI-generated content is a draft only. A human must review and explicitly add a reply.
- The application validates AI classification values against fixed allowed enums before returning them.
- Gemini API errors are converted into safe API errors; secrets and provider response bodies are not returned to the browser.
- Set a server-side API key, keep usage limits in mind, and use synthetic/demo customer data. Do not submit sensitive personal or payment details to an external AI provider.

## Tests and build

```bash
cd server
npm install
npm run build
npm test
cd ../client
npm install
npm run build
npm test
```

The test suites include focused validation of ticket statistics, AI classification parsing, and frontend utility functions. Run the commands locally before presenting the project.

## Deployment

See `DEPLOY_AWS.md`. Suggested architecture: React static build on S3 + CloudFront, NestJS container on ECS/Fargate or App Runner, MongoDB Atlas or a private managed MongoDB deployment, and JWT/Gemini secrets in AWS Secrets Manager. Set `CORS_ORIGIN`, `VITE_API_URL`, `MONGODB_URI`, `JWT_SECRET` and `GEMINI_API_KEY` appropriately. Use HTTPS.

## License

Original SupportFlow AI project code is provided under the MIT License. Third-party dependencies retain their own licenses; see `THIRD_PARTY_NOTICES.md`.
