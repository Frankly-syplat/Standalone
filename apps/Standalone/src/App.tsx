import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store as designerStore } from './designer/state/store';
import { lazy, Suspense } from 'react';

export const App = () => {
  return (
    <Routes>
      <Route index element={<DesignerStandalone />} />
      <Route path="/" element={<DesignerStandalone />} />
      <Route path="*" element={<DesignerStandalone />} />
    </Routes>
  );
};

const DesignerStandalone = () => (
  <Provider store={designerStore}>
    <Suspense fallback={null}>
      <DesignerWrapperLazy />
    </Suspense>
  </Provider>
);

const DesignerWrapperLazy = lazy(() =>
  import('./designer/app/DesignerShell/designer').then((m) => ({ default: m.DesignerWrapper as any }))
);
