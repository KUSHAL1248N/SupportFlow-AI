# Publish SupportFlow AI to your GitHub account

1. Extract this ZIP and open the `SupportFlow-AI` folder in Command Prompt.
2. Create an empty GitHub repository named `SupportFlow-AI`. Do not add a README or licence on GitHub; these are already included locally.
3. Run the commands below, replacing `YOUR_USERNAME` with your GitHub username.

```bash
git init
git add .
git status
git commit -m "Initial commit: SupportFlow AI customer support workspace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SupportFlow-AI.git
git push -u origin main
```

Review `git status` before committing. Never add `.env` files, Gemini API keys, database credentials, JWT secrets or real customer data. `.gitignore` excludes environment files. If Git asks for identity, configure `git config --global user.name` and `git config --global user.email` first.

Keep the included MIT `LICENSE`. Review `THIRD_PARTY_NOTICES.md` for dependency notices.
