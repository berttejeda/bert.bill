// React core
import React from 'react';

export default function CollapsibleSection({ style, isCollapsed, children }) {

  return (
    <div>
      <div
        className="collapse-content"
        style={isCollapsed ? style.expanded : style.collapsed}
        aria-expanded={isCollapsed}
      >
        {children}
      </div>
    </div>
  );
}
