# VSCode se GitHub Connect Kaise Karein

## Step 1: GitHub Extension Install Karein
1. VSCode open Karein
2. Left side Extensions (Ctrl+Shift+X)
3. "GitHub" search Karein
4. "GitHub Pull Requests" install Karein

## Step 2: GitHub me Sign In
1. VSCode me source control icon click (Ctrl+Shift+G)
2. "Sign in to GitHub" click Karein
3. Browser open hoga - allow karein
4. Done!

## Step 3: GitHub Repository Banayein
1. https://github.com/new
2. Repository name: cyberwatch
3. Public select karein
4. Create repository click Karein

## Step 4: Code Push Karein
VSCode terminal me ye commands run karein:

```bash
cd C:\Users\ashish.mahto\OneDrive - DAIKIN\Desktop\demoapplication

git init
git add .
git commit -m "India Cyber Threat Dashboard"
git remote add origin https://github.com/YOUR_USERNAME/cyberwatch.git
git push -u origin main
```

## Step 5: Frontend Build Karein
```bash
cd frontend
npm run build
```

---

## Agar koi error aaye to:

### Error: "git not found"
VSCode terminal me:
```bash
git
```
Agar error aaye to Git install karein from https://git-scm.com

### Error: "remote origin already exists"
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/cyberwatch.git
```

### Error: "nothing to commit"
```bash
git status
git add .
git commit -m "first commit"
```

---

## Complete Flow:
1. VSCode → GitHub sign in ✓
2. GitHub.com → new repo "cyberwatch" ✓  
3. Terminal → git commands ✓
4. Code pushes to GitHub ✓
5. Vercel → connect GitHub → deploy ✓