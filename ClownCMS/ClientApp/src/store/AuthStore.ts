import { clear } from 'console';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { NavMenuItem } from './ProjectStore';

export const actionCreators = {
    requestAuth: async (Email: string, Password: string) => {

        await fetch('http://localhost:59831/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: Email,
                password: Password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => { if (response.status != 200) throw new Error('Auth not complit'); return response.json() as Promise<{ access_token: string, name: string }> }).then(data => {
            localStorage.setItem('UserName', data.name);
            localStorage.setItem('access_token', data.access_token);

        }).catch((error) => { console.log(error); });
    },
    reqistrationAuth: async (Name: string, Email: string, Password: string) => {

        await fetch('http://localhost:59831/auth/registration', {
            method: 'POST',
            body: JSON.stringify({
                email: Email,
                password: Password,
                name: Name
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => { if (response.status != 200) throw new Error('Auth not complit'); return response.json() as Promise<{ access_token: string, name: string }> }).then(data => {
            localStorage.setItem('UserName', data.name);
            localStorage.setItem('access_token', data.access_token);

        }).catch((error) => { console.log(error); });

    },
    authClear: () => {
        localStorage.clear();
    }
}


