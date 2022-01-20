/** @jsx jsx */
import { useActiveViewId, useRecords, useFields, useCloudStorage, usePrimaryField, useViewMeta, FieldPicker, useDatasheet } from '@vikadata/widget-sdk';
import React, {useState, useMemo, useRef} from 'react'
import { jsx } from '@emotion/react'
import { Button,TextInput, Select, Typography, List } from '@vikadata/components';
import { Table } from './table';

export const FindAndReplace: React.FC = () => {
   
    interface repType {
        "id": string;
        "title": string;
        "before": string;
        "after": string;
    }
    interface columnType {
        "col1": string;
        "col2": string;
        "col3": string;
        "col4": string;
    }

    //定义 useRefs
    const findRef = useRef<HTMLInputElement>(null);
    const reRef = useRef<HTMLInputElement>(null);

    //定义 useState
    const [ fieldId, setFieldId] = useCloudStorage<string | null>('')
    const [ result, setResult ] = useState<any>([]);                  //选择范围的内容
    const [ replacements, setReplacements ] = useState<any>([])             //预览图表
    const [ buttonBool, setButtonBool ] = useState<boolean>(true)

    // 新建图表需要的上下文
    const activeViewId = useActiveViewId();
    const view = useViewMeta(activeViewId);
    const fields = useFields(activeViewId);
    const records = useRecords(activeViewId);
    const datasheet = useDatasheet()
    const primaryField = usePrimaryField();

    // 筛选出符合条件的字段
    let fieldInfo = fields.filter((field) => {
        return field.type === 'SingleText' || field.type === 'Text' || field.type === 'URL' || field.type === 'Email' || field.type === 'Phone' 
      }).map((field) => {
        return {
            'label' : field.name,
            'value' : field.id,
          }
      })

    const data = useMemo(
        ()=>{  
            const result: Array<columnType> =  replacements.map((record,index) => {
                return ({
                        col1: (index+1).toString(),
                        col2: record["title"],
                        col3: record["before"],
                        col4: record["after"]
                    })
                }
            )
            return result
        }
        ,
        [replacements]
    )

    const data1 = useMemo(
        () => [
            {
            col1: 'Hello',
            col2: 'Worldddddddddddddd',
            col3: 'Hello',
            col4: 'World',
            },
            {
            col1: 'react-table',
            col2: 'rocks',
            col3: 'react-table',
            col4: 'rocks',
            },
            {
            col1: 'whatever',
            col2: 'you want',
            col3: 'whatever',
            col4: 'you want',
            },
        ],
        []
    )
       
    const columns = useMemo(
        () => [
            {
                Header: '序号',
                accessor: 'col1', // accessor is the "key" in the data
            },{
                Header: `${primaryField?.name}(首字段)`,
                accessor: 'col2',
            },{
                Header: "替换前",
                accessor: 'col3',
            },{
                Header: "替换后",
                accessor: 'col4',
            },
        ],
        []
    )

    React.useEffect(() => {
        setButtonBool(true)
    }, [])


    React.useEffect(() => {
        console.log("替换后的结果:",replacements); //这里实时获取替换结果
        // console.log('demoMemo:', demo)
        // console.log('dataMemo:', data)
    }, [replacements])

    React.useEffect(() => {
        console.log("此时的字段（fieldId）:",fieldId)
        // GetRecords()
        setButtonBool(true)
    }, [fieldId])

    React.useEffect(() => {
        console.log("此时的查找结果:",result); 
        if(result.length !== 0){
            ReplacePreview()
            setButtonBool(false)
        }
        
    }, [result])

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
        
        const rep = new Array<repType>()
    
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
        if (datasheet?.checkPermissionsForSetRecords(recordsToSet).acceptable) {
          datasheet?.setRecords(recordsToSet);
        }

        setButtonBool(true)

    }

    return (
        <div>
            <List
                bordered
              
                header={<Typography variant="body3" color="rgb(140, 140, 140);">
                            说明：
                            <br />
                            基于视图的文本查找替换
                            <br />
                            批量查找替换文本，只会影响当前视图下的记录
                </Typography>}

                footer={<Typography variant="body2" >
                            当前激活的视图：<b>{view?.name}</b>
                    </Typography>}
                />
                

            <Typography variant="body2" color="rgb(140, 140, 140);" >
                <br />
                请选择字段：
            </Typography>
            
            <Select 
                options={fieldInfo}
                value={fieldId}
                onSelected={(option) => {
                  setFieldId(option.value)
                }}
                dropdownMatchSelectWidth
                // triggerStyle={{ width: '50%' }}
                openSearch
            />
            <Typography variant="body2" color="rgb(140, 140, 140);" >
                <br />
                请输入要查找的文本：
            </Typography>
            
            <TextInput size="small" ref={findRef} />
            
            <Typography variant="body2"color="rgb(140, 140, 140);"  >
                <br />
                请输入要替换的文本：
            </Typography>
            <TextInput size="small"   ref={reRef} /><p/>
            <Button variant="jelly" color="primary" onClick={GetRecords}>预览</Button>&nbsp;&nbsp;
            <Button variant="fill" color="primary" onClick={SetRecords} disabled={buttonBool}>全部替换</Button><p/>
            <br />
            {/* apply the table props */}
            <Table columns={columns} data={data} />
        </div>
    )
}