import type { RootState } from './store';
import { useSelector } from 'react-redux';

export const useIsLocal = () => {
  return useSelector((state: RootState) => state.workflowLoader?.isLocal ?? false);
};

export const useHostingPlan = () => {
  return useSelector((state: RootState) => state.workflowLoader?.hostingPlan ?? 'standard');
};

export const useIsDarkMode = () => {
  return useSelector((state: RootState) => state.workflowLoader?.isDarkMode ?? false);
};

export const useIsReadOnly = () => {
  return useSelector((state: RootState) => state.workflowLoader?.isReadOnly ?? false);
};

export const useHostOptions = () => {
  return useSelector((state: RootState) => state.workflowLoader?.hostOptions ?? {
    displayRuntimeInfo: true,
    maxStateHistorySize: 0,
    collapseGraphsByDefault: false,
    enableMultiVariable: true,
  });
};

export const useIsMonitoringView = () => {
  return useSelector((state: RootState) => state.workflowLoader?.isMonitoringView ?? false);
};

export const useIsUnitTestView = () => {
  return useSelector((state: RootState) => state.workflowLoader?.isUnitTest ?? false);
};

export const useResourcePath = () => {
  return useSelector((state: RootState) => state.workflowLoader?.resourcePath ?? '');
};

export const useAppId = () => {
  return useSelector((state: RootState) => state.workflowLoader?.appId);
};

export const useWorkflowName = () => {
  return useSelector((state: RootState) => state.workflowLoader?.workflowName);
};

export const useRunId = () => {
  return useSelector((state: RootState) => state.workflowLoader?.runId);
};

export const useShowChatBot = () => {
  return useSelector((state: RootState) => state.workflowLoader?.showChatBot ?? false);
};

export const useShowConnectionsPanel = () => {
  return useSelector((state: RootState) => state.workflowLoader?.showConnectionsPanel ?? false);
};

export const useShowEdgeDrawing = () => {
  return useSelector((state: RootState) => state.workflowLoader?.showEdgeDrawing ?? false);
};

export const useAreCustomEditorsEnabled = () => {
  return useSelector((state: RootState) => state.workflowLoader?.areCustomEditorsEnabled ?? false);
};

export const useSuppressDefaultNodeSelect = () => {
  return useSelector((state: RootState) => state.workflowLoader?.suppressDefaultNodeSelect ?? false);
};

export const useShowPerformanceDebug = () => {
  return useSelector((state: RootState) => state.workflowLoader?.showPerformanceDebug ?? false);
};

export const useStringOverrides = () => {
  return useSelector((state: RootState) => !!state.workflowLoader?.hostOptions?.stringOverrides);
};

export const useRunFiles = () => {
  return useSelector((state: RootState) => state.workflowLoader?.runFiles ?? []);
};

export const useRunInstance = () => {
  return useSelector((state: RootState) => state.workflowLoader?.runInstance);
};

export const useQueryCachePersist = () => {
  return useSelector((state: RootState) => state.workflowLoader?.queryCachePersist ?? false);
};

export const useIsMultiVariableEnabled = () => {
  return useSelector((state: RootState) => state.workflowLoader?.hostOptions?.enableMultiVariable ?? true);
};

export const useIsJsonViewerMode = () => {
  return useSelector((state: RootState) => state.workflowLoader?.isJsonViewerMode ?? false);
};
