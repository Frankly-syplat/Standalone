# GitHub Actions Deployment Setup

## Issue: Missing Azure Deployment Token

If you see this error in GitHub Actions:
```
deployment_token was not provided.
The deployment_token is required for deploying content.
```

This means the Azure Static Web Apps deployment token is not configured in your GitHub repository secrets.

## Solution: Add Deployment Token to GitHub Secrets

### Step 1: Get Your Azure Deployment Token

1. **Login to Azure Portal**: https://portal.azure.com

2. **Navigate to your Static Web App**:
   - Click on the search bar at the top
   - Type "Static Web Apps"
   - Click on "Static Web Apps" service
   - Find and click on your app (name: `black-rock-0cca78e0f` or similar)

3. **Copy the Deployment Token**:
   - In the app overview page, look for "Manage deployment token" button at the top
   - Click it to reveal the token
   - Copy the entire token (it's a long string starting with something like `0000...`)
   - **Important**: Keep this token secure! Don't share it publicly.

### Step 2: Add Token to GitHub Repository Secrets

1. **Go to your GitHub repository**: 
   - https://github.com/ALNA-PM1/Standalone

2. **Navigate to Settings**:
   - Click the "Settings" tab (top right of the repository page)
   - You need to be a repository admin to access this

3. **Add the Secret**:
   - In the left sidebar, expand "Secrets and variables"
   - Click on "Actions"
   - Click the green "New repository secret" button
   - Fill in the form:
     - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_ROCK_0CCA78E0F`
     - **Secret**: Paste the deployment token you copied from Azure
   - Click "Add secret"

### Step 3: Verify the Secret is Added

After adding the secret, you should see it listed on the "Actions secrets" page. The value will be hidden (shown as `***`).

### Step 4: Trigger a New Deployment

You have two options:

**Option A: Re-run the Failed Workflow**
1. Go to the "Actions" tab in your repository
2. Click on the failed workflow run
3. Click "Re-run all jobs" button

**Option B: Push a New Commit**
```bash
cd Standalone
git commit --allow-empty -m "Trigger deployment after adding Azure token"
git push origin main
```

## Verification

After the workflow runs successfully, you should see:
- ✅ Green checkmark on the workflow run
- ✅ "Build and Deploy Job" completed successfully
- ✅ Your app deployed to Azure

Visit your Azure Static Web App URL to verify the deployment.

## Troubleshooting

### Secret Name Mismatch
Make sure the secret name EXACTLY matches what's in the workflow file:
```yaml
azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_ROCK_0CCA78E0F }}
```

### Token Expired or Invalid
If the deployment still fails after adding the token:
1. Go back to Azure Portal
2. Regenerate the deployment token
3. Update the GitHub secret with the new token

### No Access to Azure Portal
If you don't have access to Azure Portal:
- Contact your Azure administrator to get the deployment token
- Or ask them to add it to GitHub secrets for you
- Or use manual deployment (see MANUAL_DEPLOYMENT.md)

### Workflow Not Triggering
If the workflow doesn't run after pushing:
1. Check the "Actions" tab to see if workflows are enabled
2. Verify the workflow file is in `.github/workflows/` directory
3. Check that you're pushing to the `main` branch

## Security Best Practices

- ✅ Never commit the deployment token to your repository
- ✅ Never share the token in public channels
- ✅ Rotate the token periodically (regenerate in Azure Portal)
- ✅ Only give repository access to trusted collaborators
- ✅ Use GitHub's secret management (never hardcode tokens)

## Need Help?

If you continue to have issues:
1. Check the workflow logs in the "Actions" tab for detailed error messages
2. Verify your Azure Static Web App is active and not suspended
3. Ensure your Azure subscription is active
4. Contact your team's Azure administrator
