import * as React from 'react';
import { Field, reduxForm} from "redux-form";
import { TextEditor } from './TextEditor';
type Props =
    {
        text: string,
        type: NavType,
        save: (text: string, type: NavType) => void,
        del: () => void,
        //signal about close edit mode
        closeEvent?: () => void
    };

export enum NavType {
    GroupedDirectories,
    Directories,
    DirectorPages,
    Page
}

const maxLengthCreator = (maxLength: number) => (value: string) => {
    if (value.length > maxLength) return true;
    return false;
}

let NavElementEditor: React.FC<Props> = (props) => {
    let Save = () => {
        //don't save value with empty name
        if (inerValueText.length > 0) {
            props.save(inerValueText, inerValueType)
            setEditMode(false)
        } else {
            Close()
        }
        
    }

    let Close = () => {
        setInerValueText(props.text)
        setInerValueType(props.type)
        setEditMode(false)  
        if (props.closeEvent) {
            props.closeEvent();
        }  
    }

    let Delete = () => {
        props.del()
        setEditMode(false)
    }

    let [isEditMode, setEditMode] = React.useState<boolean>(props.text === "")
    let [inerValueText, setInerValueText] = React.useState<string>(props.text)
    let [inerValueType, setInerValueType] = React.useState<number>(props.type)
    React.useEffect(() => setInerValueText(props.text), [props.text]);
    React.useEffect(() => setInerValueType(props.type), [props.type]);

    return (
        <div>
            {isEditMode && <div>
                <div>
                    <input type='button' value='1' onClick={() => setInerValueType(NavType.GroupedDirectories)} />
                    <input type='button' value='2' onClick={() => setInerValueType(NavType.Directories)} />
                    <input type='button' value='3' onClick={() => setInerValueType(NavType.DirectorPages)} />
                    <input type='button' value='4' onClick={() => setInerValueType(NavType.Page)} />
                </div>
                <div>
                    {<input type='button' value='save' onClick={Save} />}
                    {<input type='button' value='delete' onClick={Delete} />}
                    {<input type='button' value='close' onClick={Close} />}
                </div>
            </div>}
            <form onSubmit={(e) => { e.preventDefault() }} onDoubleClick={() => { setEditMode(true) }}>
                <div>
                    <Field component={TextEditor}
                        name="navElemEditor"
                        text={inerValueText} saveText={setInerValueText}
                    />
                </div>
            </form>
        </div>
    )
};

export default reduxForm<{}, Props>({ form: 'update-nav-element' })(NavElementEditor);