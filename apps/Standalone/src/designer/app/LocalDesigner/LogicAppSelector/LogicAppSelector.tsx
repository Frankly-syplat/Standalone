import { JsonUploader } from '../JsonUploader/JsonUploader';
import { useCallback } from 'react';

export const LocalLogicAppSelector: React.FC = () => {
  const handleWorkflowLoaded = useCallback(() => {
    // Workflow loaded successfully via JSON upload
  }, []);

  return (
    <div>
      <JsonUploader onWorkflowLoaded={handleWorkflowLoaded} />
    </div>
  );
};
