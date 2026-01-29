import type { 
  IConnectorService, 
  ListDynamicValue, 
  TreeDynamicValue, 
  TreeDynamicExtension,
  ManagedIdentityRequestProperties 
} from '@microsoft/logic-apps-shared';
import type { OpenAPIV2 } from '@microsoft/logic-apps-shared';

/**
 * Mock connector service for standalone app that handles dynamic properties
 * for child workflow operations and other connectors
 */
export class MockConnectorService implements IConnectorService {
  async getLegacyDynamicContent(
    connectionId: string,
    connectorId: string,
    parameters: Record<string, any>,
    _managedIdentityProperties?: ManagedIdentityRequestProperties
  ): Promise<any> {
    console.log('MockConnectorService.getLegacyDynamicContent called:', { connectionId, connectorId, parameters });
    
    // Return empty content for now - this is used for legacy dynamic content
    return {};
  }

  async getListDynamicValues(
    connectionId: string | undefined,
    connectorId: string,
    operationId: string,
    parameters: Record<string, any>,
    dynamicState: any,
    _isManagedIdentityConnection?: boolean,
    _operationPath?: string
  ): Promise<ListDynamicValue[]> {
    console.log('🔍 MockConnectorService.getListDynamicValues called:', { 
      connectionId, 
      connectorId, 
      operationId, 
      parameters, 
      dynamicState 
    });

    // Handle specific operations
    if (operationId === 'getLogicAppSwagger') {
      // This is called for child workflow dynamic properties
      // Return empty list since we can't resolve actual workflows in standalone mode
      console.log('✅ Returning empty list for getLogicAppSwagger');
      return [];
    }

    // Return empty list for other dynamic values
    console.log('⚠️ Returning empty list for operation:', operationId);
    return [];
  }

  async getDynamicSchema(
    connectionId: string | undefined,
    connectorId: string,
    operationId: string,
    parameters: Record<string, any>,
    dynamicState: any,
    _isManagedIdentityConnection?: boolean
  ): Promise<OpenAPIV2.SchemaObject> {
    console.log('🔍 MockConnectorService.getDynamicSchema called:', { 
      connectionId, 
      connectorId, 
      operationId, 
      parameters, 
      dynamicState 
    });

    // Handle specific operations
    if (operationId === 'getLogicAppSwagger') {
      // This is called for child workflow dynamic properties
      // Extract workflow ID from parameters if available
      const workflowId = parameters?.workflowId || parameters?.host?.workflow?.id;
      
      console.log('✅ Resolving schema for child workflow:', workflowId);
      
      // Return a more realistic schema based on common Logic Apps patterns
      const schema = {
        type: 'object',
        title: 'Child Workflow Input',
        description: `Input schema for child workflow${workflowId ? ` (${workflowId})` : ''} - Mock schema for standalone viewer`,
        properties: {
          // Common Logic Apps input properties
          message: {
            type: 'string',
            title: 'Message',
            description: 'Message to send to child workflow'
          },
          data: {
            type: 'object',
            title: 'Data',
            description: 'Data payload for child workflow',
            additionalProperties: true,
            properties: {
              id: {
                type: 'string',
                title: 'ID',
                description: 'Unique identifier'
              },
              value: {
                type: 'string',
                title: 'Value',
                description: 'Data value'
              }
            }
          },
          headers: {
            type: 'object',
            title: 'Headers',
            description: 'HTTP headers to pass to child workflow',
            additionalProperties: {
              type: 'string'
            }
          },
          parameters: {
            type: 'object',
            title: 'Parameters',
            description: 'Additional parameters for child workflow',
            additionalProperties: true
          }
        },
        additionalProperties: true
      };
      
      console.log('✅ Returning mock schema:', schema);
      return schema;
    }

    // Return generic schema for other operations
    console.log('⚠️ Returning generic schema for operation:', operationId);
    return {
      type: 'object',
      title: 'Dynamic Schema',
      description: 'Mock dynamic schema for standalone viewer',
      additionalProperties: true
    };
  }

  async getTreeDynamicValues(
    connectionId: string | undefined,
    connectorId: string,
    operationId: string,
    parameters: Record<string, any>,
    dynamicState: TreeDynamicExtension,
    _isManagedIdentityConnection?: boolean
  ): Promise<TreeDynamicValue[]> {
    console.log('MockConnectorService.getTreeDynamicValues called:', { 
      connectionId, 
      connectorId, 
      operationId, 
      parameters, 
      dynamicState 
    });

    // Return empty tree for now
    return [];
  }
}