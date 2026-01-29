# Child Workflow Support Fix

## Problem
The "calling another logic app" feature (child workflows) was not working in the standalone application. When uploading a JSON workflow that contains a child workflow action, the action would show only a loading icon and never complete loading.

## Root Cause
The issue was caused by missing service implementations required for dynamic property resolution:

1. **Child workflow actions** use `x-ms-dynamic-properties` to resolve the schema of the target workflow
2. This requires calling the `getLogicAppSwagger` operation to get the child workflow's input schema
3. The standalone app was missing proper implementations of:
   - `IConnectorService` - for handling dynamic property resolution
   - `IWorkflowService` - for workflow-related operations

## Solution
Implemented mock services that handle dynamic property resolution for child workflows:

### 1. MockConnectorService (`mockConnectorService.ts`)
- Implements `IConnectorService` interface
- Handles `getLogicAppSwagger` operation calls
- Returns realistic mock schemas for child workflow inputs
- Supports all dynamic property resolution methods

### 2. Enhanced WorkflowService
- Added missing methods like `getAppIdentity`, `isExplicitAuthRequiredForManagedIdentity`
- Provides proper service initialization

### 3. Service Initialization
- Added `InitConnectorService()` and `InitWorkflowService()` calls
- Ensures services are available when dynamic properties need resolution

## Files Modified
1. `apps/Standalone/src/designer/app/LocalDesigner/localDesigner.tsx`
   - Added service imports and initialization
   - Enhanced workflow service with missing methods

2. `apps/Standalone/src/designer/app/LocalDesigner/mockConnectorService.ts` (NEW)
   - Complete mock implementation of IConnectorService
   - Handles dynamic schema resolution for child workflows

## Testing

### Test Workflow JSON
Use the provided `test-child-workflow.json` file to test the fix:

```json
{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "triggers": {
      "manual": {
        "type": "Request",
        "kind": "Http",
        "inputs": { "schema": {} }
      }
    },
    "actions": {
      "Call_Child_Workflow": {
        "runAfter": {},
        "type": "Workflow",
        "inputs": {
          "body": { "message": "Hello from parent workflow" },
          "headers": { "Content-Type": "application/json" },
          "host": {
            "triggerName": "manual",
            "workflow": {
              "id": "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/myResourceGroup/providers/Microsoft.Logic/workflows/childWorkflow"
            }
          }
        }
      }
    }
  }
}
```

### How to Test
1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Upload or paste the test workflow JSON
4. Click "Load Workflow"
5. The child workflow action should now load properly instead of showing infinite loading

### Expected Behavior
- ✅ Child workflow action loads without infinite loading
- ✅ Action shows proper input fields (body, headers, host)
- ✅ Mock schema provides realistic input options
- ✅ Console shows debug logs for dynamic property resolution
- ✅ Workflow renders completely in the designer

## Technical Details

### Dynamic Property Resolution Flow
1. Designer encounters child workflow action with `x-ms-dynamic-properties`
2. Calls `ConnectorService.getDynamicSchema()` with `operationId: 'getLogicAppSwagger'`
3. MockConnectorService returns a realistic schema for child workflow inputs
4. Designer uses the schema to render input fields
5. Action completes loading and displays properly

### Mock Schema Structure
The mock service returns a schema that includes common Logic Apps input patterns:
- `message`: String field for simple messages
- `data`: Object field for complex data payloads
- `headers`: Object field for HTTP headers
- `parameters`: Object field for additional parameters
- `additionalProperties: true` to allow any other properties

## Benefits
1. **Child workflows work in standalone mode** - No more infinite loading
2. **Realistic input experience** - Users see proper input fields
3. **Debug visibility** - Console logs show what's happening
4. **Extensible** - Easy to add support for other dynamic operations
5. **Non-breaking** - Doesn't affect other functionality

## Future Enhancements
- Add support for resolving actual workflow schemas if available
- Implement workflow discovery for better UX
- Add more sophisticated mock schemas based on workflow types
- Support for nested workflow validation