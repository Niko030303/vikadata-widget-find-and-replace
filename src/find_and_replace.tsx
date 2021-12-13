/** @jsx jsx */
import { useActiveViewId, useRecords, useFields, usePrimaryField, useViewMeta, FieldPicker, useDatasheet } from '@vikadata/widget-sdk';
import React, {useState} from 'react'
import { jsx } from '@emotion/react'
import { Button,TextInput } from '@vikadata/components';

export const FindAndReplace: React.FC = () => {
   
    //定义 useRefs
    const findRef = React.useRef<HTMLInputElement>(null);
    const reRef = React.useRef<HTMLInputElement>(null);

    //定义 useState
    const [ fieldId, setFieldId] = useState<string | null>()
    const [ result, setResult ] = React.useState<any>([]);                  //选择范围的内容
    const [ replacements, setReplacements ] = React.useState<any>([])             //预览图表

    // 新建图表需要的上下文
    const activeViewId = useActiveViewId();
    const view = useViewMeta(activeViewId);
    const records = useRecords(activeViewId);
    const datasheet = useDatasheet()
    const primaryField = usePrimaryField();
    
    // 定义常量
    React.useEffect(() => {
        console.log('@小组件更新@');

        console.log("此时的查找结果:",result); //这里实时获取查找结果
        console.log("替换后的结果:",replacements); //这里实时获取替换结果
    }, [result,replacements])

    React.useEffect(() => {
        console.log("此时的字段（fieldId）:",fieldId)
        GetRecords()
    }, [fieldId])

    //选择范围后，获取该视图的所有单元格数据
    const GetRecords = () => {
        const getRecords = records.map((record) => {
            return({
                "id":record.id,
                "title":record.title,
                "value":record.getCellValue(fieldId)
            })})
        console.log("---列内容---", getRecords)
        
        return setResult(getRecords)
        }

    // 预览结果
    const ReplacePreview = ()=>{
        
        const rep = []
    
        for(const item of result){ //item的类型是对象
            console.log("item是：",item.title)
            console.log("item.value是：",item.value)

            if (typeof item.value !== 'string'){
                continue;
            }
            if (!item.value){
                continue
            }
            
            const newValue = item.value.replaceAll(findRef.current?.value, reRef.current?.value);
            console.log("替换后的字符串：",newValue)
            if (item.value !== newValue) {
                rep.push(
                    {
                        "id": item.id,
                        "title": item.title,
                        "before": item.value,
                        "after": newValue
                    }
                )
            }
        }

        // if (replacements===[]) {
        //     console.log('No replacements found')
        // }else{
        //     console.log("replacements",replacements)
        //     return setReplacements(replacements)
        // }
 
        return setReplacements(rep)
      
    }

    const SetRecords = () => {
        const fid = fieldId

        const recordsToSet = replacements.map((replacement) => {
            
            return({
                id:replacement.id,
                valuesMap:{
                    [fid] : replacement.after
                },
                
            })
        })

        console.log("recordsToSet: ", recordsToSet)
        if (datasheet.checkPermissionsForSetRecords(recordsToSet).acceptable) {
          datasheet.setRecords(recordsToSet);
        }
    }

    return (
        <div>
            <p>当前激活的视图: {view?.name}</p>
            
            <p >请选择范围</p>
            <FieldPicker name="字段选择" fieldId={fieldId} viewId={activeViewId} onChange={option => setFieldId(option.value)
            }/><p/>
            
            <p>请输入要查找的内容</p>
            <TextInput size="small" placeholder="比如“小明”" ref={findRef} /><p/>
            
            <p>请输入要替换的内容</p>
            <TextInput size="small" placeholder="比如“大黄”"  ref={reRef} /><p/>
            <Button variant="jelly" color="primary" onClick={ReplacePreview}>预览</Button>&nbsp;&nbsp;
            <Button variant="fill" color="primary" onClick={SetRecords}>全部替换</Button><p/>
            <div>
            <table id="tbl" width="450" border="1">
                <thead>
                    <tr>
                        <td>序号</td>
                        <td>{primaryField.name}(首字段)</td>
                        <td>替换前</td>
                        <td>替换后</td>
                    </tr>
                </thead>
                <tbody>
                    {replacements.map((record,index) =>
                        <tr key={record["id"]}>
                            <td>{index+1}</td>
                            <td>{record["title"]}</td>
                            <td>{record["before"]}</td>
                            <td>{record["after"]}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>  
        </div>
    )
}