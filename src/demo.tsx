/** @jsx jsx */
import { useActiveViewId, useRecords, useFields, useCloudStorage, usePrimaryField, useViewMeta, FieldPicker, useDatasheet } from '@vikadata/widget-sdk';
import React, {useState} from 'react'
import { jsx } from '@emotion/react'
import { Button,TextInput, Select } from '@vikadata/components';

export const Demo: React.FC = () => {

        const viewId = useActiveViewId();
        const [fieldId, setFieldId] = useCloudStorage('key1', '');
        const [fieldId1, setFieldId1] = useCloudStorage('key2', '');

        return (<div>
            <FieldPicker viewId={viewId} fieldId={fieldId} onChange={option => setFieldId(option.value)} />
            <br />
            <FieldPicker viewId={viewId} fieldId={fieldId1} onChange={option => setFieldId1(option.value)} />;
        </div>
         
        ) 

}