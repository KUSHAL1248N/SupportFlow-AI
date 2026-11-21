# AI Development Notes — SupportFlow AI

This file is a practical review record for the developer to complete while using an AI coding assistant. Do not claim the review exercise is complete until you personally perform and record it.

## AI feature inside the product

SupportFlow AI integrates Google's Gemini API on the backend. The key is read from `GEMINI_API_KEY` on the NestJS server and is never exposed through a `VITE_` frontend variable.

The AI endpoints are:
- `POST /api/ai/tickets/:id/draft-reply`
- `POST /api/ai/tickets/:id/summarize`
- `POST /api/ai/tickets/:id/classify`

AI-generated responses are drafts; the user must review and explicitly add a reply. The classification response is checked against enumerated values before being persisted.

## Suggested AI-assisted development review exercise

Use Claude Code or another coding agent to propose one additional feature, for example:
- Add an SLA due date and overdue indicator to a ticket.
- Add a paginated audit log for status/priority changes.
- Add a ticket export endpoint with safe filtering.

For a credible review record:
1. Ask the agent to explain the current code path before editing.
2. Ask it to implement the feature and add tests.
3. Review the diff line by line.
4. Create or identify a realistic failing/edge-case test.
5. Correct the generated implementation yourself.
6. Run build and test commands.
7. Record the actual generated change, bug or weakness, your correction, and final test output below.

## Developer review record (fill with what you actually did)

- Feature reviewed:
- AI-generated proposal:
- Issue found:
- Correction made by me:
- Tests run and result:
- Commit containing the final change:
