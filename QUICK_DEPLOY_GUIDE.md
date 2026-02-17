# 🚀 Quick Deployment Guide - Azure Logic Apps Designer

## TL;DR - Deploy in 3 Steps

```bash
# 1. Build
cd Standalone
pnpm build

# 2. Test locally
cd apps/Standalone
pnpm preview
# Open http://localhost:4173 and verify nodes are styled

# 3. Deploy
# Upload apps/Standalone/dist folder to Azure Static Web Apps
```

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:
- [ ] `pnpm build` completes without errors
- [ ] `dist/assets/index-*.css` file exists (~191KB)
- [ ] `dist/index.html` contains `<link rel="stylesheet"` tag
- [ ] Local preview shows styled nodes with borders
- [ ] Edges connect between nodes
- [ ] No console errors

---

## 🔍 Quick Verification

### Check CSS is included:
```bash
# Windows
dir apps\Standalone\dist\assets\*.css

# Should show index-*.css file (~191KB)
```

### Check HTML has CSS link:
```bash
# Windows
type apps\Standalone\dist\index.html | findstr stylesheet

# Should output: <link rel="stylesheet" crossorigin href="/assets/index-*.css">
```

---

## 🐛 Quick Troubleshooting

### Problem: Nodes have no styling
**Solution:** CSS not loaded
```bash
# Verify CSS file exists
ls apps/Standalone/dist/assets/*.css

# If missing, rebuild:
pnpm build
```

### Problem: Nodes disappear when scrolling
**Solution:** Already fixed in code
- Verify `userInferredTabNavigation` is `true` in DesignerReactFlow.tsx

### Problem: Edges not connected
**Solution:** Already fixed in code
- Null checks added in edge.tsx

---

## 📦 What Gets Deployed

Deploy the entire `apps/Standalone/dist` folder containing:
- `index.html` (entry point)
- `assets/` folder (JS, CSS, images)
- `templates/` folder (workflow templates)
- `staticwebapp.config.json` (Azure config)

---

## 🎯 Success Indicators

After deployment, you should see:
- ✅ Nodes with visible borders and styling
- ✅ Edges connecting nodes properly
- ✅ Smooth scrolling without node disappearance
- ✅ No console errors
- ✅ CSS loads in Network tab (~191KB)

---

## 📞 Need Help?

Check these files for detailed information:
- `DEPLOYMENT_READY.md` - Complete deployment guide
- `FIXES_APPLIED.md` - All fixes with code examples
- `PRODUCTION_ISSUES_AND_FIXES.md` - Detailed problem analysis

---

## 🔄 Rebuild After Changes

If you make code changes:
```bash
# Rebuild everything
pnpm build

# Or rebuild just the app (faster)
cd apps/Standalone
pnpm build
```

---

**Last Updated:** 2024-02-17
**Status:** Production Ready ✅
