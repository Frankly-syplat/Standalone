# Logic App JSON Viewer

A production-ready web application for visualizing Logic Apps Standard workflow JSON files in the Azure Logic Apps Portal designer canvas (read-only mode).

## Features

- **JSON Upload**: Upload `.json` files or paste JSON content directly
- **Read-Only Designer**: View workflows in the exact Azure Logic Apps Portal designer canvas
- **Validation**: Clear error messages for invalid JSON or non-Logic Apps workflows
- **Local-Only**: No Azure login required, works entirely offline
- **HTTP-Only**: Runs on HTTP without certificate prompts

## Quick Start

### Development
```bash
# Install dependencies
pnpm install

# Start development server (HTTP on port 4200)
pnpm dev
```

### Production Build
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

The built files will be in the `dist/` directory.

## Usage

1. **Open the application**: Navigate to `http://localhost:4200`
2. **Upload workflow**: 
   - Click "Choose File" and select a `.json` file, OR
   - Paste JSON content directly into the textarea
3. **Load workflow**: Click "Load Workflow" button
4. **View designer**: The workflow will appear in the read-only designer canvas

## Sample Workflow

A sample workflow file is provided: `sample-workflow.json`

This contains a basic Logic Apps Standard workflow with:
- HTTP Request trigger
- Initialize Variable action
- Condition (If/Else)
- HTTP action
- Compose action
- HTTP Response action

## Workflow JSON Format

The application expects Logic Apps Standard workflow JSON in this format:

```json
{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "triggers": {
      // ... trigger definitions
    },
    "actions": {
      // ... action definitions
    },
    "outputs": {}
  },
  "parameters": {},
  "kind": "Stateful"
}
```

## Validation

The application validates:
- Valid JSON syntax
- Presence of `definition` property
- Correct Logic Apps workflow schema URL
- Will show clear error messages for invalid workflows

## Read-Only Features

In read-only mode:
- ✅ View workflow structure and connections
- ✅ Inspect action configurations
- ✅ View workflow parameters
- ✅ Code view (JSON export)
- ✅ Zoom and pan the canvas
- ❌ Add/delete/modify actions
- ❌ Drag and drop
- ❌ Save/discard buttons hidden
- ❌ Undo/redo disabled

## Architecture

Built on top of the existing LogicAppsUX Standalone application:
- **Base**: `apps/Standalone` (reuses `@microsoft/logic-apps-designer`)
- **State Management**: Redux Toolkit with new `loadWorkflowFromJson` async thunk
- **UI**: Fluent UI components with custom JSON uploader
- **Validation**: Client-side JSON parsing and Logic Apps schema validation
- **Build**: Vite with React, no mkcert (HTTP-only)

## Browser Support

Supports modern browsers with ES2020+ support. The application uses:
- React 18
- TypeScript
- Fluent UI
- Microsoft Logic Apps Designer library

## Troubleshooting

**"Invalid workflow" error**: Ensure your JSON has the correct Logic Apps schema URL in `definition.$schema`

**"Invalid JSON format" error**: Check JSON syntax using a JSON validator

**Designer not loading**: Ensure the workflow has at least one trigger or action defined

**File upload not working**: Only `.json` files are accepted, or use the paste textarea instead