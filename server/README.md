# SupportFlow AI API

NestJS REST API for SupportFlow AI.

## Local setup

```powershell
copy .env.example .env
npm install
npm run start:dev
```

Set `MONGODB_URI`, a private `JWT_SECRET`, and `GEMINI_API_KEY` in `.env`. The API listens on port 4002 by default. Swagger is available at `/docs`.

## AI provider

The AI service uses Google's official `@google/genai` SDK. `GEMINI_API_KEY` and `GEMINI_MODEL` are read only by the server. The current default model configured by this starter is `gemini-3.8-flash`; use a model available to your Google AI Studio project if access differs.

## Commands

- `npm run start:dev` — watch mode
- `npm run build` — compile the NestJS app
- `npm test` — run Jest tests
