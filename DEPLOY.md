# Deployment Guide for ashishtech.in

## FREE Deployment (Recommended)

### Option 1: Render + Vercel (Completely Free)

#### Step 1: Push Code to GitHub
```bash
# Create GitHub repo first, then:
cd backend
git init
git add .
git commit -m "Initial"
git remote add origin https://github.com/yourusername/cyberwatch.git
git push -u origin main
```

#### Step 2: Deploy Django (Backend) on Render
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service → Connect your repo
4. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn cyberwatch.wsgi`
5. Create `backend/requirements.txt`:
   ```
   Django>=4.2
   djangorestframework
   django-cors-headers
   gunicorn
   ```
6. FREE tier - no credit card needed for limited usage

#### Step 3: Deploy React (Frontend) on Vercel
1. Go to https://vercel.com
2. Import your GitHub repo → frontend folder
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. FREE tier

#### Step 4: Point Domain to Vercel
1. In Vercel → Settings → Domains
2. Add `ashishtech.in`
3. Update DNS at domain registrar:
   - A record: @ → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com

---

## Option 2: PythonAnywhere ($5/month)

Simpler but costs $5/month:
1. Upload files to PythonAnywhere
2. Set up virtual environment
3. Run Django with their WSGI

---

## Fastest Option: Railway ($5 credit free)

1. Go to https://railway.app
2. Connect GitHub
3. Deploy both backend and frontend
4. Free $5 credit for new users

---

## DNS Setup for ashishtech.in

At your domain registrar, add:
```
Type    Name      Value
A       @         76.76.21.21
CNAME   www       cname.vercel-dns.com
```

---

## Quick Fix for CORS

Update Django settings to allow your domain:
```python
CORS_ALLOWED_ORIGINS = [
    "https://ashishtech.in",
    "https://www.ashishtech.in",
]
```

---

## Files to Upload

```
/
├── backend/
│   ├── manage.py
│   ├── cyberwatch/
│   └── subscriptions.json
├── frontend/
│   └── (build output)
├── SPEC.md
└── DEPLOY.md
```