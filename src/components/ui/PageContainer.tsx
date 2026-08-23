import React from 'react';

type PageContainerWidth = 'reading' | 'form' | 'standard' | 'messages' | 'wide';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: PageContainerWidth;
}

const widthClasses: Record<PageContainerWidth, string> = {
  reading: 'page-container--reading',
  form: 'page-container--form',
  standard: 'page-container--standard',
  messages: 'page-container--messages',
  wide: 'page-container--wide',
};

export const PageContainer: React.FC<PageContainerProps> = ({
  width = 'wide',
  className = '',
  children,
  ...props
}) => (
  <div className={`page-container ${widthClasses[width]} ${className}`.trim()} {...props}>
    {children}
  </div>
);
