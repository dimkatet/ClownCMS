import * as React from 'react';

type Props =
    {
        text: string,
        saveText: (text: string) => void,
        name: string,
        valid?: (value: string) => boolean;
    };

export let TextEditor: React.FC<Props> = (props) => {
    let [isEditMode, setEditMode] = React.useState<boolean>(props.text === "")
    let [inerValue, setInerValue] = React.useState<string>(props.text)
    React.useEffect(() => { setInerValue(props.text); setEditMode(props.text === "");}, [props.text])

    let textEdit = () => {
        setEditMode(true)
    }
    let textChange = (ev: React.FocusEvent<HTMLInputElement>) => {
        setInerValue(ev.currentTarget.value);
    }
    let textSave = () => {
        if (!props.valid || props.valid(inerValue) === true) {
            props.saveText(inerValue);
            setEditMode(false)
        }
        
    }
    return (<div>
        {!isEditMode && <div onDoubleClick={textEdit}>{inerValue}</div>}
        {isEditMode && <input name={props.name} type="text" onChange={textChange} onBlur={textSave} value={inerValue} autoFocus />}
        </div>
    )
};
