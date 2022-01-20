import React from 'react';
import { initializeWidget } from '@vikadata/widget-sdk';
import { FindAndReplace } from './find_and_replace';
import { Demo } from './demo';
import { Setting } from './setting';

export const HelloWorld: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1, overflow: 'auto', padding: '0 8px'}}>
        <FindAndReplace />
        {/* <Demo /> */}
      </div>
      {/* <Setting /> */}
    </div>
  );
};

initializeWidget(HelloWorld, process.env.WIDGET_PACKAGE_ID);
