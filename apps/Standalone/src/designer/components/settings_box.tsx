import { LocalLogicAppSelector } from '../app/LocalDesigner/LogicAppSelector/LogicAppSelector';
import ContextSettings from '../app/SettingsSections/contextSettings';
import { useIsDarkMode, useIsJsonViewerMode } from '../state/workflowLoadingSelectors';
import { LocalizationSettings } from './LocalizationSettings';
import { darkTheme } from './themes';
import { ThemeProvider } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';

export const SettingsBox = () => {
  const isDark = useIsDarkMode();
  const isJsonViewerMode = useIsJsonViewerMode();

  const SettingsSection = (props: any) => {
    const { title, children, startExpanded = true } = props;
    const [expanded, toggleExpanded] = useBoolean(startExpanded);
    return (
      <>
        <h4 onClick={toggleExpanded.toggle} style={{
          padding: '12px 16px',
          margin: '0',
          backgroundColor: isDark ? '#2a2928' : '#f0f0f0',
          borderBottom: '1px solid #e1e1e1',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <span style={{ 
            display: 'inline-block', 
            marginRight: '8px',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>▶</span> 
          {title}
        </h4>
        {expanded ? <div style={{ padding: '16px' }}>{children}</div> : null}
      </>
    );
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : undefined}>
      <div style={{
        height: '100%',
        backgroundColor: isDark ? '#323130' : '#fafafa',
        color: isDark ? 'white' : 'black',
        overflow: 'auto'
      }}>
        <SettingsSection title="Upload Workflow">
          <LocalLogicAppSelector />
        </SettingsSection>
        <SettingsSection title="Context Settings" startExpanded={false}>
          <ContextSettings />
        </SettingsSection>
        <SettingsSection title="Locale" startExpanded={false}>
          <LocalizationSettings />
        </SettingsSection>
      </div>
    </ThemeProvider>
  );
};
