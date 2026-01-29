import type { AppDispatch } from '../../state/store';
import {
  useIsReadOnly,
  useIsUnitTestView,
} from '../../state/workflowLoadingSelectors';
import {
  setReadOnly,
  setUnitTest,
} from '../../state/workflowLoadingSlice';
import { Checkbox } from '@fluentui/react';
import { useDispatch } from 'react-redux';

const ContextSettings = () => {
  const isReadOnly = useIsReadOnly();
  const isUnitTest = useIsUnitTestView();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <Checkbox
        label="Read Only"
        checked={isReadOnly}
        onChange={(_, checked) => dispatch(setReadOnly(!!checked))}
      />
      <Checkbox 
        label="Unit Test View" 
        checked={isUnitTest} 
        onChange={(_, checked) => dispatch(setUnitTest(!!checked))}
      />
    </div>
  );
};

export default ContextSettings;
