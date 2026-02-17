# Manual Deployment Guide

If you don't have access to Azure deployment tokens, you can deploy manually using Azure CLI or the Azure Portal.

## Option 1: Deploy via Azure Portal

1. Build the application locally:
   ```bash
   cd Standalone
   pnpm build
   ```

2. Go to Azure Portal: https://portal.azure.com
3. Navigate to your Static Web App
4. Click on "Browse" to see the deployment options
5. Use the Azure Portal's built-in deployment tools to upload the `apps/Standalone/dist` folder

## Option 2: Deploy via Azure CLI

1. Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

2. Login to Azure:
   ```bash
   az login
   ```

3. Build the application:
   ```bash
   cd Standalone
   pnpm build
   ```

4. Deploy using Azure CLI:
   ```bash
   az staticwebapp deploy \
     --name <your-static-web-app-name> \
     --resource-group <your-resource-group> \
     --source apps/Standalone/dist
   ```

## Option 3: Deploy via VS Code Extension

1. Install the "Azure Static Web Apps" extension in VS Code
2. Build the application locally
3. Right-click on the `apps/Standalone/dist` folder
4. Select "Deploy to Static Web App"
5. Follow the prompts to select your Azure subscription and app

## Verify Deployment

After deployment, verify:
- CSS loads correctly (check Network tab in browser DevTools)
- Nodes are styled properly
- Edges connect between nodes
- Scrolling doesn't cause nodes to disappear
- No console errors

## Troubleshooting

If you encounter issues:
1. Check the Azure Portal logs for deployment errors
2. Verify the `staticwebapp.config.json` is included in the dist folder
3. Ensure all files in the dist folder are uploaded
4. Clear browser cache and test again
