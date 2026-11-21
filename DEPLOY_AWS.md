# AWS Deployment Guide — SupportFlow AI

This is a deployment guide; the app has not been deployed to your AWS account by this package.

## Suggested architecture
- React/Vite static build: Amazon S3 + CloudFront.
- NestJS API container: Amazon ECS with Fargate or AWS App Runner.
- Database: MongoDB Atlas or a private managed MongoDB deployment accessible only to the API.
- Secrets: AWS Secrets Manager for `JWT_SECRET`, `MONGODB_URI`, and `GEMINI_API_KEY`.
- Observability: CloudWatch logs and health endpoint `/api/health`.

## Environment variables

API:
- `NODE_ENV=production`
- `PORT` (provided by the hosting service)
- `MONGODB_URI`
- `JWT_SECRET` (random, private, 32+ characters)
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN` (exact HTTPS frontend origin)
- `GEMINI_API_KEY` (server-side secret)
- `GEMINI_MODEL` (model enabled for your Google AI Studio project)

Frontend build:
- `VITE_API_URL` (public HTTPS API base URL ending in `/api`)

## Release checklist
1. Build the API container and deploy it to ECS/App Runner.
2. Configure secrets in Secrets Manager; never bake credentials into images.
3. Configure MongoDB network access for the API only.
4. Set the production CORS origin.
5. Build the React client with the production `VITE_API_URL`.
6. Upload the static assets to S3 and serve via CloudFront.
7. Enable HTTPS and verify `/api/health`, auth, ticket routes and AI routes.
8. Monitor Gemini quotas and provider errors. Keep the AI key on the server.
9. Do not use real customer data in portfolio demos without an approved privacy and data-handling plan.
