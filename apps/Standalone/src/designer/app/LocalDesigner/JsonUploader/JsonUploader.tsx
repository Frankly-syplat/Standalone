import type { AppDispatch } from '../../../state/store';
import { loadWorkflowFromJson } from '../../../state/workflowLoadingSlice';
import { MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

interface JsonUploaderProps {
  onWorkflowLoaded?: () => void;
}

export const JsonUploader: React.FC<JsonUploaderProps> = ({ onWorkflowLoaded }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonText(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  }, []);

  const handleLoadWorkflow = useCallback(async () => {
    if (!jsonText.trim()) {
      setError('Please provide JSON content');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await dispatch(loadWorkflowFromJson(jsonText));
      if (loadWorkflowFromJson.fulfilled.match(result)) {
        onWorkflowLoaded?.();
      } else if (loadWorkflowFromJson.rejected.match(result)) {
        setError(result.error.message || 'Failed to load workflow');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, jsonText, onWorkflowLoaded]);

  const handleClearJson = useCallback(() => {
    setJsonText('');
    setError(null);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#0078d4' }}>
        Logic App Viewer (Read-only)
      </h3>
      
      <div>
        <label htmlFor="file-upload" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Upload JSON File:
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ 
            marginBottom: '12px',
            width: '100%',
            padding: '4px'
          }}
        />
      </div>

      <TextField
        label="Or paste JSON content:"
        multiline
        rows={8}
        value={jsonText}
        onChange={(_, newValue) => setJsonText(newValue || '')}
        placeholder="Paste your Logic Apps workflow JSON here..."
        styles={{
          field: { 
            fontFamily: 'Monaco, Consolas, "Courier New", monospace', 
            fontSize: '11px',
            lineHeight: '1.4'
          },
          fieldGroup: { minHeight: '120px' }
        }}
      />

      {error && (
        <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setError(null)}>
          {error}
        </MessageBar>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <PrimaryButton
          text="Load Workflow"
          onClick={handleLoadWorkflow}
          disabled={!jsonText.trim() || isLoading}
          styles={{ root: { flex: '1', minWidth: '120px' } }}
        />
        <PrimaryButton
          text="Clear"
          onClick={handleClearJson}
          disabled={!jsonText.trim()}
          styles={{ 
            root: { 
              backgroundColor: '#f3f2f1', 
              color: '#323130',
              border: '1px solid #d2d0ce',
              flex: '1',
              minWidth: '80px'
            } 
          }}
        />
      </div>
    </div>
  );
};