# Deployment Instructions

The `git` command is currently not recognized in your editor's terminal. This usually means Git is not added to your system PATH or not installed.

**To deploy this project, please follow these steps in your separate "Git Bash" or "Command Prompt" window:**

## Step 1: Initialize Git (If not done)
Run these commands in the `shikshadesign-demo` folder:

```bash
git init
git add .
git commit -m "Prepare for Netlify deployment"
```

## Step 2: Create a Repository on GitHub
1. Go to [GitHub.com/new](https://github.com/new).
2. Name it `shiksha-design-demo`.
3. Click **Create repository**.
4. Copy the URL (e.g., `https://github.com/YOUR_USERNAME/shiksha-design-demo.git`).

## Step 3: Connect and Push
Replace `YOUR_REPO_URL` with the link you just copied:

```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

## Step 4: Deploy on Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import from an existing project"**.
3. Select **GitHub**.
4. Choose your `shiksha-design-demo` repository.
5. **Build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **Deploy**.

## Troubleshooting
If you see `fatal: remote origin already exists`, use:
`git remote set-url origin YOUR_REPO_URL`
