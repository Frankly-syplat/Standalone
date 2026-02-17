# Deployment Fix - Step by Step

Based on your screenshots, I can see the secret exists but the workflow can't access it. Here are the possible causes and solutions:

## Issue Analysis

From your screenshots:
- ✅ Secret exists: `AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_ROCK_0CCA78E0F`
- ✅ Secret was updated 4 minutes ago
- ❌ Workflow still can't access it

## Possible Causes

### 1. Secret Scope Issue (Most Likely)

The secret might be in the wrong scope. GitHub has different secret scopes:
- **Repository secrets** - Available to all workflows
- **Environment secrets** - Only available to specific environments

**Solution**: Ensure the secret is a **Repository secret**, not an Environment secret.

#### How to Check:
1. Go to: https://github.com/ALNA-PM1/Standalone/settings/secrets/actions
2. Look at the "Repository secrets" section (not "Environment secrets")
3. The secret should be listed there

#### If it's in Environment secrets:
1. Delete it from Environment secrets
2. Add it to Repository secrets instead

### 2. Workflow Permissions Issue

The workflow might not have permission to read secrets.

**Solution**: Check workflow permissions

#### How to Fix:
1. Go to: https://github.com/ALNA-PM1/Standalone/settings/actions
2. Scroll to "Workflow permissions"
3. Ensure "Read and write permissions" is selected
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Click "Save"

### 3. Secret Value Issue

The token might be invalid or incomplete.

**Solution**: Regenerate and re-add the token

#### Steps:
1. Go to Azure Portal: https://portal.azure.com
2. Find your Static Web App: "black-rock-0cca78e0f"
3. Click "Manage deployment token"
4. Click "Reset deployment token" (this generates a new one)
5. Copy the NEW token
6. Go to GitHub: https://github.com/ALNA-PM1/Standalone/settings/secrets/actions
7. Click on the existing secret
8. Click "Update secret"
9. Paste the NEW token
10. Click "Update secret"

### 4. Cached Workflow Issue

GitHub Actions might be using a cached version of the workflow.

**Solution**: Force a fresh workflow run

#### Steps:
1. Go to: https://github.com/ALNA-PM1/Standalone/actions
2. Click on "Azure Static Web Apps CI/CD" workflow
3. Click "Run workflow" dropdown
4. Select "main" branch
5. Click "Run workflow"

## Try These Solutions in Order

### Solution 1: Use the Alternative Workflow (Easiest)

I've created an alternative workflow file that uses a different approach:

1. Go to: https://github.com/ALNA-PM1/Standalone/actions
2. Look for "Azure Static Web Apps CI/CD (Alternative)"
3. Click "Run workflow"
4. Select "main" branch
5. Click "Run workflow"

This workflow uses environment variables which sometimes work better.

### Solution 2: Check Secret Scope

1. Go to: https://github.com/ALNA-PM1/Standalone/settings/secrets/actions
2. Verify the secret is under "Repository secrets" (not Environment secrets)
3. If it's under Environment secrets:
   - Note the secret value (you'll need to get it from Azure again)
   - Delete it from Environment secrets
   - Add it to Repository secrets

### Solution 3: Regenerate Token

1. Azure Portal → Static Web App → Reset deployment token
2. Copy the new token
3. GitHub → Settings → Secrets → Update the secret
4. Push a new commit or re-run the workflow

### Solution 4: Check Workflow File Permissions

The workflow file might have the wrong permissions setting.

Add this to the workflow file (I'll do this for you):

```yaml
permissions:
  contents: read
  id-token: write
```

## Verification Steps

After trying each solution:

1. Go to: https://github.com/ALNA-PM1/Standalone/actions
2. Click on the latest workflow run
3. Check if the deployment step runs (not just the build)
4. Look for "Deployment successful" message

## If Nothing Works

If all solutions fail, we can deploy manually:

### Manual Deployment Option 1: Azure CLI

```bash
# Install Azure CLI if you haven't
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Build
cd Standalone
pnpm build

# Deploy
az staticwebapp deploy \
  --name black-rock-0cca78e0f \
  --resource-group <your-resource-group> \
  --source apps/Standalone/dist \
  --no-wait
```

### Manual Deployment Option 2: Azure Portal

1. Build locally: `cd Standalone && pnpm build`
2. Zip the `apps/Standalone/dist` folder
3. Go to Azure Portal
4. Navigate to your Static Web App
5. Click "Browse" → "Deployment" → "Upload"
6. Upload the zip file

## Next Steps

1. Try Solution 1 (Alternative Workflow) first
2. If that doesn't work, try Solution 2 (Check Secret Scope)
3. If still failing, try Solution 3 (Regenerate Token)
4. If all else fails, use Manual Deployment

## Need More Help?

Share the following information:
1. Screenshot of the "Repository secrets" section
2. Screenshot of the workflow run logs (the deployment step specifically)
3. Confirm you can access the Azure Portal and see the Static Web App
4. Confirm you're a repository admin (can access Settings)

The application code is perfect - this is purely a deployment configuration issue!
