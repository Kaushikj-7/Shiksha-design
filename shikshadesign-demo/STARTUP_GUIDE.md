# 🚀 ShikshaDesign - System Startup & Running Guide

**Date:** January 22, 2026  
**Status:** Production Ready (38 modules, 0 errors)  
**Ready to Run:** ✅ YES

---

## Quick Start (30 seconds)

```bash
# Navigate to project directory
cd c:\Users\Nihar\Downloads\Shiksha-design-main\Shiksha-design-main\shikshadesign-demo

# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

---

## System Requirements

Before running, verify you have:

✅ **Node.js** (v16+)
```bash
node --version
# Should show v16.0.0 or higher
```

✅ **npm** (v7+)
```bash
npm --version
# Should show v7.0.0 or higher
```

✅ **Modern Web Browser**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Step-by-Step Startup Guide

### STEP 1: Verify Environment Setup

**Open PowerShell and run:**

```powershell
# Check Node.js installation
node --version

# Check npm installation  
npm --version

# Expected output:
# v18.x.x or higher
# 9.x.x or higher
```

**✅ If you see version numbers, proceed to Step 2**

**❌ If you get "command not found":**
- Install Node.js from https://nodejs.org/ (LTS version)
- Restart PowerShell after installation

---

### STEP 2: Navigate to Project Directory

```powershell
# Navigate to ShikshaDesign folder
cd 'c:\Users\Nihar\Downloads\Shiksha-design-main\Shiksha-design-main\shikshadesign-demo'

# Verify you're in the right folder
ls

# You should see:
# - package.json
# - src/ folder
# - node_modules/ folder
# - vite.config.js
```

---

### STEP 3: Install Dependencies (First Time Only)

**Only needed if you haven't run this before:**

```powershell
# Install all required packages
npm install

# Expected output:
# > npm install
# up to date, audited XX packages in XXs

# If you see "added XXX packages" that's also fine
# This may take 1-2 minutes on first run
```

---

### STEP 4: Start Development Server

```powershell
# Start the development server
npm run dev

# Expected output:
# > shikshadesign-demo@1.0.0 dev
# > vite
#
#   VITE v7.2.5  ready in XXX ms
#
#   ➜  Local:   http://localhost:5173/
#   ➜  Press h + enter to show help
```

**✅ If you see this, the server is running!**

---

### STEP 5: Open Application in Browser

**Option A: Click the link** (shown in terminal)
```
http://localhost:5173/
```

**Option B: Type in address bar**
```
http://localhost:5173
```

**Expected Result:** Landing page appears with:
- ShikshaDesign logo and title
- "Get Started" button
- Benefits section
- Modern gradient background

---

### STEP 6: Test the Application

**On Landing Page:**
1. Click **"Get Started"** button
2. You should navigate to **Basics** page

**On Basics Page:**
3. Enter Program Name (e.g., "FLN Initiative")
4. Enter Description (e.g., "Improving reading skills in grade 1-3")
5. Click **"Next"** button
6. Should proceed to **Problem & Outcome** page

**Navigate Using Header:**
7. Look at top navigation bar (sticky header)
8. See 5 step indicators
9. Click on different steps to navigate
10. On mobile, click hamburger menu (☰) to see steps

---

## Running Modes

### MODE 1: Development (Hot Reload)

```powershell
npm run dev
```

**What it does:**
- Starts local server at http://localhost:5173
- Auto-reloads when files change
- Shows errors in console
- Unminified code (easier debugging)

**Best for:** Development, testing, debugging

**Stop the server:** Press `Ctrl + C` in terminal

---

### MODE 2: Production Build

```powershell
npm run build
```

**What it does:**
- Creates optimized `dist/` folder
- Minifies code and styles
- Generates source maps
- Takes ~2 seconds

**Expected output:**
```
✓ 38 modules transformed
dist/index.html                   0.46 kB
dist/assets/index-BnI1zN98.css   34.04 kB
dist/assets/index-Cj7mY1T4.js   305.69 kB
✓ built in 2.06s
✓ 0 ERRORS | 0 WARNINGS
```

**Best for:** Deployment, performance testing

---

### MODE 3: Preview Production Build Locally

```powershell
# First build
npm run build

# Then preview
npm run preview
```

**What it does:**
- Shows what production build will look like
- Runs on http://localhost:4173
- Faster than dev mode, closer to production

**Best for:** Final testing before deployment

---

## Complete Terminal Commands Reference

| Command | Purpose | Time | Stop with |
|---------|---------|------|-----------|
| `npm install` | Install dependencies | 1-2 min | Auto (completes) |
| `npm run dev` | Start dev server | Instant | `Ctrl+C` |
| `npm run build` | Create production build | ~2 sec | Auto (completes) |
| `npm run preview` | Preview production locally | Instant | `Ctrl+C` |
| `npm run lint` | Check code quality | ~5 sec | Auto (completes) |

---

## Using the Application - User Workflow

Once the server is running and browser is open:

### 5-Step Program Design Journey

**Step 1: Basics** (Program Information)
```
✓ Program Name: Enter your program's name
✓ Program Description: Describe what it does
✓ Next: Click to proceed (errors will appear if incomplete)
```

**Step 2: Problem & Outcome** (The Why & What)
```
✓ Problem Statement: What problem are we solving?
✓ Desired Outcome: What change do we want?
✓ Success Indicator: How will we measure success?
```

**Step 3: Stakeholders** (Who & How They Change)
```
✓ Add Stakeholder (green card format)
✓ Current Practice: What do they do now?
✓ Target Practice: What should they do?
✓ Add more stakeholders as needed
✓ Remove stakeholder if needed
```

**Step 4: Activities** (What We Do)
```
✓ Add Activity: What intervention/activity?
✓ Add multiple activities
✓ Remove if needed
```

**Step 5: Framework** (Complete View)
```
✓ View complete Logical Framework
✓ Statistics cards show overview
✓ Table displays all information
✓ Download as text file
✓ Print for sharing with stakeholders
✓ Start new program option
```

---

## Navigation Features

### Top Navigation Bar (Sticky Header)
- **Logo & Program Name:** Click to stay on current page
- **Step Indicators:** 5 tabs showing your progress
- **Current Step:** Highlighted in blue
- **Mobile Menu:** Hamburger icon (☰) on small screens
- **Quick Links:** Jump to any step immediately

### Page-Level Navigation
- **Back Button:** Return to previous step
- **Next Button:** Advance to next step (only if no errors)
- **Error Messages:** Red boxes showing what to fix

### Data Persistence
- All data saves automatically to browser
- Refresh the page: data still there
- Navigate between steps: data preserved
- Close browser: data persists (until cleared)

---

## Common Issues & Fixes

### Issue 1: "npm: command not found"

**Cause:** Node.js not installed  
**Fix:**
```powershell
# Install Node.js from https://nodejs.org/
# Download LTS version
# Run installer
# Restart PowerShell
# Try again: npm --version
```

---

### Issue 2: Port 5173 Already in Use

**Error:** "EADDRINUSE: address already in use :::5173"

**Cause:** Another process using the port

**Fix - Option A: Find and stop process**
```powershell
# Find what's using port 5173
netstat -ano | findstr :5173

# Find the PID (Process ID) from output
# Then stop it
taskkill /PID [PID_NUMBER] /F
```

**Fix - Option B: Use different port**
```powershell
# Edit vite.config.js, change port:
export default {
  server: {
    port: 5174  // Changed from 5173
  }
}

# Then run
npm run dev
# Now open http://localhost:5174
```

---

### Issue 3: "Module not found" Error

**Cause:** Dependencies not installed

**Fix:**
```powershell
# Clear and reinstall
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

---

### Issue 4: Build Fails with Errors

**Cause:** Corrupted files or cache

**Fix:**
```powershell
# Clear cache and rebuild
rm -r dist
npm run build

# If still fails, full reset:
rm -r node_modules dist
rm package-lock.json
npm install
npm run build
```

---

### Issue 5: Blank Page in Browser

**Cause:** JavaScript error or network issue

**Fix:**
1. Open Developer Tools: Press `F12`
2. Go to **Console** tab
3. Look for red error messages
4. Take screenshot and report

**Quick fixes:**
```powershell
# Hard refresh browser
# Ctrl + Shift + R (Windows)
# Cmd + Shift + R (Mac)

# Or clear cache and restart
npm run dev
# Then refresh browser
```

---

### Issue 6: Styles Not Showing Correctly

**Cause:** CSS not loading (Tailwind issue)

**Fix:**
```powershell
# Rebuild CSS
npm run build

# Then start dev server
npm run dev

# Do hard refresh in browser (Ctrl+Shift+R)
```

---

## Accessing Local Files

### View/Edit Source Code
```powershell
# Open in VS Code
code .

# Or open in your editor:
# File → Open Folder → navigate to folder
```

### Key Files to Know

```
shikshadesign-demo/
├── src/
│   ├── App.jsx              (Main app structure)
│   ├── pages/               (5 step pages)
│   │   ├── Landing.jsx
│   │   ├── Basics.jsx
│   │   ├── ProblemOutcome.jsx
│   │   ├── Stakeholders.jsx
│   │   ├── Activities.jsx
│   │   └── Framework.jsx
│   ├── components/          (Reusable components)
│   │   ├── Navigation.jsx   (Top header)
│   │   ├── ValidationDisplay.jsx
│   │   └── ProgressBar.jsx
│   ├── core/                (Business logic)
│   │   ├── rules-engine.js  (Validation)
│   │   ├── lfa-data-model.js (Data structure)
│   │   └── ai-companion-prompts.js (AI guidance)
│   └── utils/
│       └── storage.js       (Save/load data)
├── dist/                    (Production build)
├── package.json             (Dependencies)
├── vite.config.js           (Build config)
└── tailwind.config.js       (Style config)
```

---

## Deployment Instructions

### When Ready to Go Live:

**Step 1: Create Production Build**
```powershell
npm run build
```

**Step 2: Upload `dist/` Folder**

Choose one:

**Option A: Netlify (Easiest)**
```
1. Go to netlify.com
2. Sign up / log in
3. Drag & drop `dist/` folder
4. Done! (live in seconds)
```

**Option B: Vercel**
```
1. Go to vercel.com
2. Import from GitHub or upload folder
3. Deploy (automatic, live in 1 minute)
```

**Option C: GitHub Pages**
```powershell
# Install gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Option D: Custom Server (AWS, etc.)**
```
1. Build: npm run build
2. Copy `dist/` to server's public folder
3. Configure web server to serve index.html
4. Done!
```

---

## Performance Monitoring

### Check Build Quality

```powershell
# Analyze bundle size
npm run build

# Output shows:
# - dist/assets/index-XXXXX.css   34.04 kB (gzip: 7.05 kB)
# - dist/assets/index-XXXXX.js   305.69 kB (gzip: 92.39 kB)
# - Build time: 2.06s
```

**All good if:**
- ✅ Build completes in <5 seconds
- ✅ No errors or warnings
- ✅ JS bundle <500 KB
- ✅ CSS bundle <50 KB

---

## Browser Developer Tools

### Access Console (F12)

**View Errors:**
1. Press `F12` (Windows) or `Cmd+Option+I` (Mac)
2. Go to **Console** tab
3. Red messages = errors
4. Yellow = warnings
5. Blue = info messages

**Performance:**
1. Go to **Performance** tab
2. Click record
3. Use application
4. Stop recording
5. View performance metrics

**Network:**
1. Go to **Network** tab
2. Refresh page
3. See all HTTP requests
4. Check for 404 (not found) errors

---

## Keyboard Shortcuts

| Shortcut | Effect |
|----------|--------|
| `Ctrl+C` | Stop dev server |
| `F12` | Open Developer Tools |
| `Ctrl+Shift+R` | Hard refresh (clear cache) |
| `Ctrl+Shift+K` | Clear console |
| `Ctrl+/` | Toggle comment (in code editor) |

---

## Getting Help

### When Something Goes Wrong

1. **Check the console** (F12 → Console)
   - Copy error message
   - Google it or search in docs

2. **Check terminal output**
   - Read error messages carefully
   - Often tells you exactly what's wrong

3. **Try these fixes first:**
   ```powershell
   npm install              # Reinstall deps
   npm run build            # Try fresh build
   npm run dev              # Restart server
   ```

4. **Check file permissions**
   ```powershell
   # Ensure you can write to folder
   # Not in a read-only location
   ```

---

## Next Steps After Running

### Test the System

1. ✅ Start dev server (`npm run dev`)
2. ✅ Navigate all 5 pages
3. ✅ Enter sample data
4. ✅ Test validation (try leaving fields empty)
5. ✅ Test navigation (back/next buttons)
6. ✅ Test mobile view (press F12, click device toolbar)
7. ✅ Export framework (PDF option)
8. ✅ Test data persistence (refresh page)

### Customize (Optional)

1. **Change colors:** Edit `tailwind.config.js`
2. **Add your logo:** Replace in `public/` folder
3. **Modify validation rules:** Edit `src/core/rules-engine.js`
4. **Update text/labels:** Edit individual page files

### Deploy When Ready

1. Run `npm run build`
2. Upload `dist/` folder to hosting (Netlify, Vercel, etc.)
3. Share URL with users
4. Collect feedback

---

## Success Checklist

Before sharing with users, verify:

- ✅ Dev server starts without errors
- ✅ All 5 pages load correctly
- ✅ Can navigate between pages
- ✅ Validation shows correct error messages
- ✅ Data persists on refresh
- ✅ Mobile menu works on small screens
- ✅ Can export framework
- ✅ Production build completes (38 modules, 0 errors)
- ✅ No console errors (F12 → Console)
- ✅ Looks good on mobile (F12 → Device toggle)

---

## Quick Reference Card

```
🚀 START DEV SERVER
   cd c:\Users\Nihar\Downloads\...\shikshadesign-demo
   npm run dev
   Open: http://localhost:5173

📦 BUILD FOR PRODUCTION
   npm run build
   Creates: dist/ folder

👀 PREVIEW PRODUCTION
   npm run preview
   Open: http://localhost:4173

🧹 CLEAN & REINSTALL
   rm -r node_modules dist
   rm package-lock.json
   npm install

🆘 COMMON ISSUES
   Port in use? → Use different port in vite.config.js
   Module error? → npm install again
   Blank page? → F12 check console for errors
   Styles broken? → npm run build && npm run dev
```

---

## Support Resources

- **Vite Docs:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **VS Code:** https://code.visualstudio.com/

---

**You're all set! ShikshaDesign is ready to run.** 🎉

Start with: `npm run dev` and open http://localhost:5173

