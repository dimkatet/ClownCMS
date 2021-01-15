import { debug } from 'console';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import { ApplicationState } from '../../store';
import * as TestStore from '../../store/TestStore'


type Props =
    {
        text: string,
        saveText: (text: string) => void

    };

export let TextEditor: React.FC<Props> = (props) => {
    let [isEditMode, setEditMode] = React.useState<boolean>(props.text === "")
    let [inerValue, setInerValue] = React.useState<string>(props.text)
    let textEdit = () => {
        setEditMode(true)
    }
    let textChange = (ev: React.FocusEvent<HTMLInputElement>) => {
        setInerValue(ev.currentTarget.value);
    }
    let textSave = () => {
        props.saveText(inerValue);
        setEditMode(false)
    }
    //(() => { props.setValue("123"); setEditMode(false) })()
    return (<div>
        {!isEditMode && <div onDoubleClick={textEdit}>{inerValue}</div>}
        {isEditMode && <input name="inputText" type="text" onChange={textChange} onBlur={textSave} value={inerValue} autoFocus />}
        </div>
    )
};


/*
export default connect(
    (state: ApplicationState) => state.test, // Selects which state properties are merged into the component's props
    TestStore.actionCreators // Selects which action creators are merged into the component's props
)(TextEditor as any);*/


/*{ createField("Email", "email", [required], Input) }
{ createField("Password", "password", [required], Input, { type: "password" }) }
{ createField(null, "rememberMe", [], Input, { type: "checkbox" }, "remember me") }*/