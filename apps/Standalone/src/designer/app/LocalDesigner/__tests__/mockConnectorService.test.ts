import { describe, it, expect, beforeEach } from 'vitest';
import { MockConnectorService } from '../mockConnectorService';

describe('MockConnectorService', () => {
  let service: MockConnectorService;

  beforeEach(() => {
    service = new MockConnectorService();
  });

  describe('getDynamicSchema', () => {
    it('should return child workflow schema for getLogicAppSwagger operation', async () => {
      const result = await service.getDynamicSchema(
        'test-connection',
        'workflow-connector',
        'getLogicAppSwagger',
        { workflowId: 'test-workflow' },
        {}
      );

      expect(result).toBeDefined();
      expect(result.type).toBe('object');
      expect(result.title).toBe('Child Workflow Input');
      expect(result.properties).toBeDefined();
      expect(result.properties?.message).toBeDefined();
      expect(result.properties?.data).toBeDefined();
      expect(result.properties?.headers).toBeDefined();
      expect(result.additionalProperties).toBe(true);
    });

    it('should return generic schema for other operations', async () => {
      const result = await service.getDynamicSchema(
        'test-connection',
        'other-connector',
        'other-operation',
        {},
        {}
      );

      expect(result).toBeDefined();
      expect(result.type).toBe('object');
      expect(result.title).toBe('Dynamic Schema');
      expect(result.additionalProperties).toBe(true);
    });
  });

  describe('getListDynamicValues', () => {
    it('should return empty array for getLogicAppSwagger operation', async () => {
      const result = await service.getListDynamicValues(
        'test-connection',
        'workflow-connector',
        'getLogicAppSwagger',
        {},
        {}
      );

      expect(result).toEqual([]);
    });

    it('should return empty array for other operations', async () => {
      const result = await service.getListDynamicValues(
        'test-connection',
        'other-connector',
        'other-operation',
        {},
        {}
      );

      expect(result).toEqual([]);
    });
  });

  describe('getTreeDynamicValues', () => {
    it('should return empty array', async () => {
      const result = await service.getTreeDynamicValues(
        'test-connection',
        'test-connector',
        'test-operation',
        {},
        { 
          dynamicState: {
            dynamicState: {},
            settings: {
              canSelectParentNodes: true,
              canSelectLeafNodes: true
            },
            open: {
              operationId: 'test-open',
              parameters: {}
            },
            browse: {
              operationId: 'test-browse',
              parameters: {}
            }
          },
          selectionState: {}
        }
      );

      expect(result).toEqual([]);
    });
  });

  describe('getLegacyDynamicContent', () => {
    it('should return empty object', async () => {
      const result = await service.getLegacyDynamicContent(
        'test-connection',
        'test-connector',
        {}
      );

      expect(result).toEqual({});
    });
  });
});