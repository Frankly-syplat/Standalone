import React from 'react';

interface AgentChatProps {
  panelLocation?: any;
  chatbotWidth?: string;
  panelContainerRef?: React.RefObject<HTMLDivElement>;
}

// Stub component - chatbot functionality removed for simplified version
export const AgentChat = ({
  panelLocation,
  chatbotWidth = '400px',
  panelContainerRef,
}: AgentChatProps) => {
  // Return null to hide the chat component entirely
  return null;
};