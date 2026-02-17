# Azure Logic Apps Designer - Production Deployment Issues & Fixes

## Executive Summary

Your Azure deployment is experiencing **critical rendering issues** due to multiple problems:

1. **CSS not being loaded** (CRITICAL - causes all styling issues)
2. **Node visibility optimization** causing nodes to disappear during scrolling
3. **Viewport management** not adapting to container changes
4. **Build configuration** issues for production

---

## 🔴 CRITICAL ISSUE #1: Missing CSS in Production Build

### Problem
The built `index.html` does NOT include the CSS file link. The CSS file `designer-BnmkUPfc.css` (174.71 KB) is generated but never referenced in the HTML.

**Current build output:**
```html
<head>
  <script type="module" crossorigin src="/assets/index-Dn-OGgNe.js"></script>
  <!-- CSS LINK IS MISSING! -->
</head>
```

**Expected output:**
```html
<head>
  <link rel="stylesheet" crossorigin href="/assets/designer-BnmkUPfc.css">
  <script type="module" crossorigin src="/assets/index-Dn-OGgNe.js"></script>
</head>
```

### Root Cause
The CSS is not being imported in the main entry point. Vite only includes CSS in the HTML if it's imported in the JavaScript bundle.

### Fix Required
**File: `Standalone/apps/Standalone/src/main.tsx`**

Add CSS import at the top:
```typescript
import { StrictMode } from 'react';
import './polyfills';
import '@microsoft/logic-apps-designer/lib/ui/styles.less'; // ADD THIS LINE
import { initializeIcons } from '@fluentui/react';
import { createRoot } from 'react-dom/client';
```

---

## 🔴 CRITICAL ISSUE #2: Node Visibility During Scrolling

### Problem
**File: `Standalone/libs/designer/src/lib/ui/DesignerReactFlow.tsx` (Line 378)**

```typescript
onlyRenderVisibleElements={!userInferredTabNavigation}
```

This prop causes React Flow to only render nodes in the viewport. When scrolling:
- Nodes outside viewport are removed from DOM
- Edges lose their connection points
- Nodes "disappear" and "reappear" incorrectly

The tab navigation detection is unreliable (only counts 4 tab presses in 10 seconds).

### Fix Required
**Option 1: Disable for Production (Recommended)**
```typescript
onlyRenderVisibleElements={false}
```

**Option 2: Make it Configurable**
Add to designer options and let users choose based on workflow size.

---

## 🔴 CRITICAL ISSUE #3: Viewport Not Resetting on Layout Changes

### Problem
**File: `Standalone/libs/designer/src/lib/ui/DesignerReactFlow.tsx` (Lines 127-148)**

```typescript
const hasFitViewRun = useRef(false);

useEffect(() => {
  // ... viewport setup code
  hasFitViewRun.current = true; // NEVER RESETS!
}, [nodes, reactFlowInstance, isInitialized, containerDimensions]);
```

Once `hasFitViewRun` is set to `true`, the viewport never re-centers even when:
- Workflow changes
- Window resizes
- New nodes are added

### Fix Required
Reset the flag when workflow changes:
```typescript
// Add this effect
useEffect(() => {
  hasFitViewRun.current = false;
}, [nodes.length]); // Reset when node count changes
```

---

## 🟡 ISSUE #4: Build Configuration for Production

### Problem
**File: `Standalone/apps/Standalone/vite.config.ts`**

Current settings are development-focused:
```typescript
build: {
  minify: false,  // ❌ No minification
  // sourcemap: true,  // ❌ Commented out
}
```

### Fix Required
Update for production:
```typescript
build: {
  sourcemap: false,  // Disable source maps in production
  minify: 'esbuild',  // Enable minification
  rollupOptions: {
    plugins: [nodePolyfills()],
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-redux'],
        'fluent-ui': ['@fluentui/react', '@fluentui/react-components'],
        'designer': ['@microsoft/logic-apps-designer'],
      }
    }
  },
}
```

---

## 🟡 ISSUE #5: Edge Rendering with Missing Nodes

### Problem
**File: `Standalone/libs/designer/src/lib/ui/connections/edge.tsx`**

Edges calculate positions using `reactFlow.getNode()` which can return `undefined` if nodes aren't rendered:

```typescript
const raIndex: number = useMemo(() => {
  const sortedRunAfters = Object.keys(filteredRunAfters)
    .slice(0)
    .sort((id1, id2) => 
      (reactFlow.getNode(id2)?.position?.x ?? 0) - 
      (reactFlow.getNode(id1)?.position?.x ?? 0)
    );
  return sortedRunAfters?.findIndex((key) => key === source);
}, [filteredRunAfters, reactFlow, source]);
```

When `onlyRenderVisibleElements={true}`, nodes outside viewport return `undefined`.

### Fix Required
Add null checks and fallback positioning:
```typescript
const raIndex: number = useMemo(() => {
  const sortedRunAfters = Object.keys(filteredRunAfters)
    .slice(0)
    .sort((id1, id2) => {
      const node1 = reactFlow.getNode(id2);
      const node2 = reactFlow.getNode(id1);
      if (!node1 || !node2) return 0; // ADD THIS CHECK
      return (node2.position?.x ?? 0) - (node1.position?.x ?? 0);
    });
  return sortedRunAfters?.findIndex((key) => key === source);
}, [filteredRunAfters, reactFlow, source]);
```

---

## 🟡 ISSUE #6: Container Resize Not Triggering Viewport Update

### Problem
**File: `Standalone/libs/designer/src/lib/ui/DesignerReactFlow.tsx` (Line 165)**

```typescript
useResizeObserver(canvasRef, (el) => setContainerDimensions(el.contentRect));
```

Container dimensions update, but `translateExtent` doesn't recalculate properly because it depends on stale `flowSize`.

### Fix Required
Force viewport recalculation on resize:
```typescript
useResizeObserver(canvasRef, (el) => {
  setContainerDimensions(el.contentRect);
  if (reactFlowInstance && el.contentRect.width > 0) {
    // Trigger viewport adjustment
    requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.1, duration: 200 });
    });
  }
});
```

---

## 🟡 ISSUE #7: Missing React Flow CSS in Library Build

### Problem
**File: `Standalone/libs/designer/tsup.config.ts`**

```typescript
external: ['react', '@xyflow/react/dist/style.css'],
```

The React Flow CSS is marked as external, which means it won't be bundled. This is correct for library builds, but the consuming app must import it.

### Current Import Chain
```
libs/designer/src/index.ts 
  → imports './lib/ui/styles.less'
    → imports '@xyflow/react/dist/style.css'
```

This works in development but may fail in production if the CSS isn't properly resolved.

### Fix Required
Ensure the main app explicitly imports React Flow styles:

**File: `Standalone/apps/Standalone/src/main.tsx`**
```typescript
import '@xyflow/react/dist/style.css'; // ADD THIS
import '@microsoft/logic-apps-designer/lib/ui/styles.less';
```

---

## 📋 Implementation Priority

### IMMEDIATE (Deploy Blockers)
1. ✅ Add CSS import to `main.tsx`
2. ✅ Disable `onlyRenderVisibleElements` or fix detection
3. ✅ Add viewport reset on workflow changes

### HIGH PRIORITY (Stability)
4. ✅ Update build configuration for production
5. ✅ Add null checks in edge rendering
6. ✅ Fix container resize handling

### MEDIUM PRIORITY (Optimization)
7. ⚠️ Implement proper code splitting
8. ⚠️ Add error boundaries for graph rendering
9. ⚠️ Optimize bundle size (currently 13.1 MB uncompressed)

---

## Testing Checklist

After applying fixes, test:

- [ ] All nodes visible on initial load
- [ ] Edges properly connected to nodes
- [ ] Scrolling doesn't cause nodes to disappear
- [ ] Zoom in/out maintains node visibility
- [ ] Window resize adapts viewport correctly
- [ ] Large workflows (100+ nodes) render correctly
- [ ] CSS styles applied (check node borders, colors, fonts)
- [ ] Run After indicators display correctly
- [ ] Edge buttons (add action) are clickable
- [ ] No console errors related to missing nodes

---

## Quick Fix Script

Run these commands to apply critical fixes:

```bash
# 1. Update main.tsx to import CSS
# 2. Update DesignerReactFlow.tsx to disable onlyRenderVisibleElements
# 3. Rebuild
pnpm build

# 4. Test locally
pnpm preview

# 5. Deploy to Azure
```

---

## Additional Recommendations

### 1. Enable Source Maps for Debugging
During initial deployment, keep source maps enabled to debug issues:
```typescript
build: {
  sourcemap: true,  // Enable for initial deployment
}
```

### 2. Add Performance Monitoring
Track rendering performance for large workflows:
```typescript
// Add to DesignerReactFlow.tsx
useEffect(() => {
  console.log(`Rendered ${nodes.length} nodes, ${edges.length} edges`);
}, [nodes.length, edges.length]);
```

### 3. Implement Progressive Loading
For workflows with 500+ nodes, consider:
- Lazy loading node details
- Virtual scrolling for node lists
- Progressive edge rendering

### 4. Add Error Boundaries
Wrap the designer in error boundaries to prevent complete failures:
```typescript
<ErrorBoundary fallback={<DesignerError />}>
  <DesignerReactFlow />
</ErrorBoundary>
```

---

## Root Cause Summary

The primary issue is **missing CSS in production**, which causes:
- No node styling (invisible borders, wrong sizes)
- Edge positioning failures (can't calculate node dimensions)
- Layout collapse (no proper spacing)

Secondary issues compound this:
- Viewport optimization removes nodes from DOM
- Stale viewport calculations
- Missing null checks for node references

All issues are fixable with the changes outlined above.
