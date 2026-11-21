# Security Notes

- Passwords are hashed using bcrypt; hashes are excluded from normal user queries.
- JWT signing secrets must be unique, random and private in production.
- The Gemini API key must exist only in the backend environment. Do not prefix it with `VITE_` or commit it.
- Ticket routes are scoped to the authenticated user's own ticket records.
- DTO validation rejects unexpected fields and enforces string length bounds.
- Helmet adds standard HTTP security headers.
- Ticket/customer text is untrusted prompt content; AI prompts instruct the model not to follow embedded instructions.
- AI output must be reviewed by a human and is not sent automatically.
- The app is a portfolio/demo project. Use synthetic ticket data; do not submit real personal, payment or authentication data to an external model provider.
- Before production use, add rate limits to authentication and AI endpoints, audit logs, stronger abuse controls, and a privacy/retention policy.
