# 🚀 Logic Apps Designer Integration Guide

Complete guide to integrate the Azure Logic Apps Designer (JSON to Visual Designer) into your existing React project.

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [File Structure](#file-structure)
- [Step-by-Step Integration](#step-by-step-integration)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## 🎯 Overview

This integration provides:
- ✅ **JSON Upload/Paste**: Upload JSON workflow files or paste JSON directly
- ✅ **Visual Designer**: Full Azure Logic Apps visual workflow designer
- ✅ **Context Settings**: Read-only mode and unit test view options
- ✅ **Multi-language**: Support for 7 languages (English, Spanish, German, French, Portuguese, Arabic, Chinese)
- ✅ **State Management**: Redux-based workflow state management
- ✅ **Responsive UI**: FluentUI-based responsive interface

## 📋 Prerequisites

- React 18.2.0+
- Node.js 16+
- TypeScript support
- Build system with LESS support (Vite, Webpack, etc.)

## 📁 File Structure

### Required Files to Copy

```
your-project/
├── src/
│   ├── designer/                          # 📁 COPY THIS ENTIRE FOLDER
│   │   ├── app/
│   │   │   ├── DesignerShell/
│   │   │   │   └── designer.tsx           # Main wrapper component
│   │   │   ├── LocalDesigner/
│   │   │   │   ├── JsonUploader/
│   │   │   │   │   └── JsonUploader.tsx   # JSON upload component
│   │   │   │   ├── LogicAppSelector/
│   │   │   │   │   └── LogicAppSelector.tsx # Workflow selector
│   │   │   │   ├── customConnection/      # Connection services
│   │   │   │   ├── customEditor/          # Custom editors
│   │   │   │   ├── localDesigner.tsx      # Main designer component
│   │   │   │   ├── customEditorService.tsx
│   │   │   │   ├── httpClient.ts
│   │   │   │   ├── pseudoCommandBar.tsx
│   │   │   │   └── pseudoCommandBar.less
│   │   │   └── SettingsSections/
│   │   │       └── contextSettings.tsx    # Context settings
│   │   ├── components/
│   │   │   ├── settings_box.tsx           # Settings panel
│   │   │   ├── settings_box.module.less   # Settings styles
│   │   │   ├── LocalizationSettings.tsx   # Language selector
│   │   │   ├── themes.ts                  # Theme definitions
│   │   │   └── ErrorBoundary.tsx          # Error handling
│   │   └── state/
│   │       ├── store.ts                   # Redux store
│   │       ├── workflowLoadingSlice.ts    # Redux slice
│   │       ├── workflowLoadingSelectors.ts # Redux selectors
│   │       ├── connectionReferences.ts    # Connection helpers
│   │       ├── helper.ts                  # Utility helpers
│   │       └── historyHelpers.ts          # History helpers
│   └── polyfills.ts                       # 📄 CREATE THIS FILE
├── libs/                                  # 📁 COPY THESE WORKSPACE PACKAGES
│   ├── designer/                          # Core designer library
│   ├── designer-ui/                       # UI components
│   ├── logic-apps-shared/                 # Shared utilities
│   └── a2a-core/                         # Core functionality
└── Localize/                             # 📁 COPY FOR LANGUAGE SUPPORT
    ├── en/
    ├── es/
    ├── de/
    ├── fr/
    ├── pt-BR/
    ├── ar/
    └── zh-Hans/
```

## 🔧 Step-by-Step Integration

### Step 1: Install Dependencies

```bash
# Core React dependencies
npm install @reduxjs/toolkit@1.8.5 react-redux@8.0.2 react-intl@6.3.0

# FluentUI dependencies
npm install @fluentui/react@8.110.2 @fluentui/react-components@9.70.0 @fluentui/react-hooks@8.6.20 @fluentui/react-icons@2.0.224 @fluentui/theme@2.6.25 @fluentui/utilities@8.15.0

# Query and HTTP dependencies
npm install @tanstack/react-query@4.36.1 @tanstack/react-query-persist-client@4.36.1 @tanstack/query-sync-storage-persister@4.36.1 axios@^1.12.0

# Utility dependencies
npm install lodash.isequal@^4.5.0 core-js@3.24.1 regenerator-runtime@0.13.9

# Development dependencies
npm install --save-dev @types/lodash.isequal@^4.5.8
```

### Step 2: Copy Required Files

1. **Copy the designer folder**:
   ```bash
   cp -r LogicAppsUX/apps/Standalone/src/designer/ your-project/src/
   ```

2. **Copy the libs folder**:
   ```bash
   cp -r LogicAppsUX/libs/ your-project/
   ```

3. **Copy the Localize folder**:
   ```bash
   cp -r LogicAppsUX/Localize/ your-project/
   ```

### Step 3: Create Polyfills File

Create `src/polyfills.ts`:

```typescript
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

### Step 4: Update Your Build Configuration

#### For Vite (vite.config.ts):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@microsoft/designer-ui': './libs/designer-ui/src',
      '@microsoft/logic-apps-designer': './libs/designer/src',
      '@microsoft/logic-apps-shared': './libs/logic-apps-shared/src',
    },
  },
});
```

#### For Webpack:

```javascript
module.exports = {
  // ... other config
  resolve: {
    alias: {
      '@microsoft/designer-ui': path.resolve(__dirname, 'libs/designer-ui/src'),
      '@microsoft/logic-apps-designer': path.resolve(__dirname, 'libs/designer/src'),
      '@microsoft/logic-apps-shared': path.resolve(__dirname, 'libs/logic-apps-shared/src'),
    },
    fallback: {
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser'),
      util: require.resolve('util'),
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

### Step 5: Initialize FluentUI Icons

In your main entry file (e.g., `src/main.tsx` or `src/index.tsx`):

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeIcons } from '@fluentui/react';
import './polyfills'; // Import polyfills early
import App from './App';

// Initialize FluentUI icons
initializeIcons();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 💻 Usage Examples

### Example 1: Full Designer Component

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './designer/state/store';
import { DesignerWrapper } from './designer/app/DesignerShell/designer';
import { ReactQueryProvider } from '@microsoft/logic-apps-designer';

export const LogicAppsDesigner: React.FC = () => {
  return (
    <Provider store={store}>
      <ReactQueryProvider persistEnabled={false}>
        <div style={{ height: '100vh', width: '100vw' }}>
          <DesignerWrapper />
        </div>
      </ReactQueryProvider>
    </Provider>
  );
};

// Usage in your app
export default function App() {
  return (
    <div>
      <h1>My Application</h1>
      <LogicAppsDesigner />
    </div>
  );
}
```

### Example 2: Simplified Integration (Just Core Components)

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './designer/state/store';
import { JsonUploader } from './designer/app/LocalDesigner/JsonUploader/JsonUploader';
import { LocalDesigner } from './designer/app/LocalDesigner/localDesigner';
import { ReactQueryProvider } from '@microsoft/logic-apps-designer';

export const SimpleLogicAppsDesigner: React.FC = () => {
  return (
    <Provider store={store}>
      <ReactQueryProvider persistEnabled={false}>
        <div style={{ display: 'flex', height: '600px', border: '1px solid #ccc' }}>
          {/* JSON Upload Panel */}
          <div style={{ 
            width: '350px', 
            padding: '16px', 
            borderRight: '1px solid #e1e1e1',
            backgroundColor: '#fafafa'
          }}>
            <h3>Upload Workflow</h3>
            <JsonUploader />
          </div>
          
          {/* Designer Canvas */}
          <div style={{ flex: 1, position: 'relative' }}>
            <LocalDesigner />
          </div>
        </div>
      </ReactQueryProvider>
    </Provider>
  );
};
```

### Example 3: Custom Integration with Your Existing UI

```typescript
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './designer/state/store';
import { JsonUploader } from './designer/app/LocalDesigner/JsonUploader/JsonUploader';
import { LocalDesigner } from './designer/app/LocalDesigner/localDesigner';
import { LocalizationSettings } from './designer/components/LocalizationSettings';
import { ReactQueryProvider } from '@microsoft/logic-apps-designer';

export const CustomLogicAppsIntegration: React.FC = () => {
  const [showDesigner, setShowDesigner] = useState(false);

  return (
    <Provider store={store}>
      <ReactQueryProvider persistEnabled={false}>
        <div className="my-app-container">
          {/* Your existing header */}
          <header className="my-header">
            <h1>My Workflow Builder</h1>
            <LocalizationSettings />
          </header>

          {/* Conditional designer display */}
          {!showDesigner ? (
            <div className="upload-section">
              <h2>Upload Your Logic App Workflow</h2>
              <JsonUploader onWorkflowLoaded={() => setShowDesigner(true)} />
            </div>
          ) : (
            <div className="designer-section" style={{ height: '70vh' }}>
              <button onClick={() => setShowDesigner(false)}>
                ← Back to Upload
              </button>
              <LocalDesigner />
            </div>
          )}
        </div>
      </ReactQueryProvider>
    </Provider>
  );
};
```

### Example 4: Modal Integration

```typescript
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './designer/state/store';
import { DesignerWrapper } from './designer/app/DesignerShell/designer';
import { ReactQueryProvider } from '@microsoft/logic-apps-designer';

export const ModalLogicAppsDesigner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Logic Apps Designer
      </button>

      {isOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '16px', 
              borderBottom: '1px solid #ccc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2>Logic Apps Designer</h2>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div style={{ height: 'calc(100% - 60px)' }}>
              <Provider store={store}>
                <ReactQueryProvider persistEnabled={false}>
                  <DesignerWrapper />
                </ReactQueryProvider>
              </Provider>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
```

## 🎨 Customization Options

### Theme Customization

```typescript
import { createTheme } from '@fluentui/react';

const customTheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeSecondary: '#106ebe',
    // ... your custom colors
  },
});

// Apply theme
import { ThemeProvider } from '@fluentui/react';

<ThemeProvider theme={customTheme}>
  <LogicAppsDesigner />
</ThemeProvider>
```

### Language Configuration

```typescript
import { IntlProvider } from 'react-intl';
import { loadLocaleData } from './designer/state/helper';

const MyApp = () => {
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState({});

  useEffect(() => {
    loadLocaleData(locale).then(setMessages);
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <LogicAppsDesigner />
    </IntlProvider>
  );
};
```

## 🔧 API Reference

### Core Components

#### `<DesignerWrapper />`
Main wrapper component that includes both upload panel and designer canvas.

**Props:** None

#### `<JsonUploader />`
Component for uploading/pasting JSON workflow definitions.

**Props:**
- `onWorkflowLoaded?: () => void` - Callback when workflow is successfully loaded

#### `<LocalDesigner />`
The main visual designer canvas component.

**Props:** None

#### `<LocalizationSettings />`
Language selector dropdown component.

**Props:** None

### Redux Store

#### Actions
```typescript
import { 
  loadWorkflowFromJson, 
  setReadOnly, 
  setUnitTest, 
  setLanguage 
} from './designer/state/workflowLoadingSlice';

// Load workflow from JSON string
dispatch(loadWorkflowFromJson(jsonString));

// Set read-only mode
dispatch(setReadOnly(true));

// Set unit test mode
dispatch(setUnitTest(true));

// Change language
dispatch(setLanguage('es')); // Spanish
```

#### Selectors
```typescript
import { 
  useIsReadOnly, 
  useIsUnitTestView, 
  useLanguage 
} from './designer/state/workflowLoadingSelectors';

const isReadOnly = useIsReadOnly();
const isUnitTest = useIsUnitTestView();
const currentLanguage = useLanguage();
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" errors
**Problem:** Build system can't resolve workspace dependencies.

**Solution:** Update your build configuration with proper aliases:
```typescript
resolve: {
  alias: {
    '@microsoft/designer-ui': './libs/designer-ui/src',
    '@microsoft/logic-apps-designer': './libs/designer/src',
    '@microsoft/logic-apps-shared': './libs/logic-apps-shared/src',
  },
}
```

#### 2. LESS compilation errors
**Problem:** Build system doesn't support LESS files.

**Solution:** Install and configure LESS loader:
```bash
npm install --save-dev less less-loader
```

#### 3. Buffer/Process not defined
**Problem:** Node.js polyfills missing in browser environment.

**Solution:** Add polyfills to your build configuration:
```typescript
// For Vite
import { nodePolyfills } from 'vite-plugin-node-polyfills';

plugins: [
  nodePolyfills({
    include: ['buffer', 'process', 'util'],
    globals: { Buffer: true, global: true, process: true },
  }),
]
```

#### 4. FluentUI icons not displaying
**Problem:** Icons not initialized.

**Solution:** Call `initializeIcons()` in your main entry file:
```typescript
import { initializeIcons } from '@fluentui/react';
initializeIcons();
```

#### 5. Redux store conflicts
**Problem:** Multiple Redux stores or provider conflicts.

**Solution:** Ensure only one Provider wraps the designer components:
```typescript
// ❌ Wrong - nested providers
<Provider store={myStore}>
  <Provider store={designerStore}>
    <DesignerWrapper />
  </Provider>
</Provider>

// ✅ Correct - single provider
<Provider store={designerStore}>
  <DesignerWrapper />
</Provider>
```

### Performance Optimization

#### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const LogicAppsDesigner = lazy(() => import('./LogicAppsDesigner'));

function App() {
  return (
    <Suspense fallback={<div>Loading designer...</div>}>
      <LogicAppsDesigner />
    </Suspense>
  );
}
```

#### Bundle Size Optimization
- Use tree shaking for FluentUI components
- Consider lazy loading the designer
- Minimize included locales if not needed

## 📊 Bundle Impact

Expected bundle size increase:
- **Gzipped**: ~800KB - 1.2MB
- **Uncompressed**: ~2.5MB - 3.5MB

Main contributors:
- FluentUI components (~40%)
- Designer logic (~35%)
- Monaco Editor (~15%)
- Other dependencies (~10%)

## 🔒 Security Considerations

- JSON input is validated before processing
- No external API calls by default
- All data processing happens client-side
- Consider implementing CSP headers for production

## 📝 License

This integration uses components from the Azure Logic Apps UX repository. Please ensure compliance with the original license terms.

## 🤝 Support

For issues specific to this integration:
1. Check the troubleshooting section above
2. Verify all dependencies are correctly installed
3. Ensure build configuration matches your setup
4. Check browser console for specific error messages

---

**Happy integrating! 🚀**