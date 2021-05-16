﻿import * as React from 'react';
import { render } from 'react-dom';
import * as AuthStore from '../../store/AuthStore';
import PopUp from '../PopUp';

function useForceUpdate() {
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value + 1); // update the state to force render
}

export default function Auth () {
    const [isAdding, setAdding] = React.useState(false);
    const [isRegistered, setRegistered] = React.useState(false);
    const [isAuth, setAuth] = React.useState(localStorage.getItem('access_token') ? true : false);

    React.useEffect(() => { setAuth(localStorage.getItem('access_token') ? true : false) },[localStorage.getItem('access_token')]);
    const [userName, setUserName] = React.useState(localStorage.getItem('UserName') ? localStorage.getItem('UserName') : "");
    React.useEffect(() => { setUserName(localStorage.getItem('UserName') ? localStorage.getItem('UserName') : "") },[localStorage.getItem('UserName')]);
    const [TextName, addingTextName] = React.useState("");
    const [TextEmail, addingTextEmail] = React.useState("");
    const [TextPass, addingTextPass] = React.useState("");

    const forceUpdate1 = useForceUpdate();
    const forceUpdate2 = useForceUpdate();
    const forceUpdate3 = useForceUpdate();

    var actions = AuthStore.actionCreators;
    return (<div >
        {!isAuth &&
            <div ><p onClick={() => { setAdding(true); setRegistered(true); }}>sign in</p> <p onClick={() => { setAdding(true); setRegistered(false); }}>sign up</p></div >}

        {isAuth &&
            <div><p>{userName}</p> <button onClick={() => { actions.authClear(); forceUpdate1(); }}>exit</button></div>}

        {!isAuth && isAdding && isRegistered &&
            <PopUp onClose={() => {
                setAdding(false);
            addingTextName("");
            addingTextEmail("");
            addingTextPass("");}}>
                <p>Email</p>
                <input
                    value={TextEmail}
                    onChange={(e) => {
                        addingTextEmail(e.target.value);
                    }} />
                <p>Password</p>
                <input
                    value={TextPass}
                    onChange={(e) => {
                        addingTextPass(e.target.value);
                    }} />
            <p onClick={() => {
                setRegistered(false);
                addingTextName("");
                addingTextEmail("");
                addingTextPass("");}}>зарегестрироваться</p>
            <button onClick={async() => {
                await actions.requestAuth(TextEmail, TextPass);
                setAdding(false);
                addingTextName("");
                addingTextEmail("");
                addingTextPass("");
                forceUpdate2();}}> войти </button>
            </PopUp>}

        {!isAuth && isAdding && !isRegistered &&
            <PopUp onClose={() => {
                setAdding(false);
                addingTextName("");
                addingTextEmail("");
                addingTextPass("");}}>
                <p>Name</p>
                <input
                    value={TextName}
                    onChange={(e) => {
                        addingTextName(e.target.value);
                    }} />
                <p>Email</p>
                <input
                value={TextEmail}
                    onChange={(e) => {
                        addingTextEmail(e.target.value);
                    }} />
                <p>Password</p>
                <input
                    value={TextPass}
                    onChange={(e) => {
                        addingTextPass(e.target.value);
                    }} />
            <p onClick={() => {
                setRegistered(true);
                addingTextName("");
                addingTextEmail("");
                addingTextPass(""); }}>уже зарегестрированн</p>
            <button onClick={async() => {
                await actions.reqistrationAuth(TextName, TextEmail, TextPass);
                setAdding(false);
                addingTextName("");
                addingTextEmail("");
                addingTextPass("");
                forceUpdate3();}}> зарегестрироваться </button>
            </PopUp>}

    </div>)
}
