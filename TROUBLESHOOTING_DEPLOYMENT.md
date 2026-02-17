# Troubleshooting Azure Deployment

## Current Issue: "deployment_token was not provided"

This error means GitHub Actions cannot access the Azure deployment token. Here are the steps to fix it:

## Step-by-Step Solution

### 1. Verify the Secret Name is EXACTLY Correct

The secret name must be **EXACTLY**:
```
AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_ROCK_0CCA78E0F
```

**Important**: 
- No spaces
- All uppercase
- Underscores (not hyphens)
- Exact spelling

### 2. Check if the Secret Exists in GitHub

1. Go to: https://github.com/ALNA-PM1/Standalone/settings/secrets/actions
2. Look for a secret named: `AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_ROCK_0CCA78E0F`
3. If it doesn't exist or has a different name, you need to add/update it

### 3. Get the Correct Azure Deployment Token

**Option A: From Azure Portal**
1. Go to https://portal.azure.com
2. Search for "Static Web Apps"
3. Click on your app (should be named something like "black-rock-0cca78e0f")
4. Click "Manage deployment token" at the top
5. Copy the entire token (it's a very long string)

**Option B: From Azure CLI**
```bash
az staticwebapp secrets list --name <your-app-name> --resource-group <your-resource-group>
```

### 4. Add/Update the Secret in GitHub

1. Go to: https://github.com/ALNA-PM1/Standalone/settings/secrets/actions
2. If the secret exists:
   - Click on it
   - Click "Update secret"
   - Paste the new token
   - Click "Update secret"
3. If the secret doesn't exist:
   - Click "New repository secret"
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_ROCK_0CCA78E0F`
   - Secret: Paste the token from Azure
   - Click "Add secret"

### 5. Verify You Have the Right Permissions

You need to be:
- A repository admin/owner, OR
- Have "Secrets" write permission

If you don't have these permissions:
- Ask the repository owner to add the secret
- Or ask them to give you admin access

### 6. Re-run the Workflow

After adding/updating the secret:

**Option A: Re-run from GitHub UI**
1. Go to: https://github.com/ALNA-PM1/Standalone/actions
2. Click on the failed workflow run
3. Click "Re-run all jobs"

**Option B: Push a new commit**
```bash
git commit --allow-empty -m "Trigger deployment after fixing secret"
git push origin main
```

## Common Issues and Solutions

### Issue 1: Secret Name Mismatch

**Symptom**: "deployment_token was not provided" even after adding secret

**Solution**: 
- Double-check the secret name matches EXACTLY
- Check for typos, extra spaces, or wrong case
- The workflow expects: `AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_ROCK_0CCA78E0F`

### Issue 2: Token is Invalid or Expired

**Symptom**: Deployment fails with authentication error

**Solution**:
1. Regenerate the token in Azure Portal
2. Update the GitHub secret with the new token
3. Re-run the workflow

### Issue 3: Wrong Azure App

**Symptom**: Token doesn't work even though it's valid

**Solution**:
- Verify you're using the token from the correct Azure Static Web App
- Check the app name matches "black-rock-0cca78e0f" (or similar)
- Ensure the app is in the correct Azure subscription

### Issue 4: Repository Permissions

**Symptom**: Can't access Settings > Secrets

**Solution**:
- You need admin access to the repository
- Contact the repository owner: ALNA-PM1
- Ask them to add the secret or give you admin access

### Issue 5: Workflow Not Triggering

**Symptom**: No workflow runs after pushing

**Solution**:
1. Check if Actions are enabled: https://github.com/ALNA-PM1/Standalone/settings/actions
2. Verify you're pushing to the `main` branch
3. Check the workflow file exists in `.github/workflows/`

## Diagnostic Steps

The workflow now includes a diagnostic step that will:
1. Check if the secret is available
2. Show an error message if it's missing
3. Display the secret length (without revealing the actual value)

Look for the "Check Secret Availability" step in the workflow logs.

## Alternative: Manual Deployment

If you can't get GitHub Actions working, you can deploy manually:

### Using Azure CLI
```bash
# Build the app
cd Standalone
pnpm build

# Deploy
az staticwebapp deploy \
  --name black-rock-0cca78e0f \
  --resource-group <your-resource-group> \
  --source apps/Standalone/dist
```

### Using Azure Portal
1. Build locally: `pnpm build`
2. Go to Azure Portal
3. Navigate to your Static Web App
4. Use the portal's deployment tools to upload `apps/Standalone/dist`

## Need More Help?

1. **Check the workflow logs**: 
   - Go to https://github.com/ALNA-PM1/Standalone/actions
   - Click on the failed run
   - Look for the "Check Secret Availability" step

2. **Verify Azure access**:
   - Ensure you can log into Azure Portal
   - Verify the Static Web App exists
   - Check you have permissions to view deployment tokens

3. **Contact your team**:
   - Ask your Azure administrator for the deployment token
   - Request repository admin access if needed
   - Share this troubleshooting guide with them

## Success Indicators

You'll know it's working when:
- ✅ The "Check Secret Availability" step passes
- ✅ The "Deploy to Azure Static Web Apps" step completes
- ✅ You see "Deployment successful" in the logs
- ✅ Your app is accessible at the Azure URL

## Quick Checklist

Before re-running the workflow, verify:
- [ ] Secret exists in GitHub with the exact name
- [ ] Token is copied correctly from Azure (no extra spaces)
- [ ] You have repository admin/secrets permissions
- [ ] The Azure Static Web App exists and is active
- [ ] You're pushing to the `main` branch
- [ ] GitHub Actions are enabled for the repository
