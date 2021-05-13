import { clear } from 'console';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { NavMenuItem } from './ProjectStore';

export interface AuthenticationState {
    isLoading: boolean;
    isAuth: boolean;
    name: string;
    access_token: string;
}

interface ReceiveAuthenticationAction {
    type: 'RECEIVE_AUTHENTICATION';
    name: string;
    access_token: string;
}

interface RequestAuthenticationAction {
    type: 'REQUEST_AUTHENTICATION';
}

interface ClearAuthenticationAction {
    type: 'CLEAR_AUTHENTICATION';
}

type KnownAction = ReceiveAuthenticationAction | RequestAuthenticationAction | ClearAuthenticationAction;



export const actionCreators = {
    requestAuth: (Email: string, Password: string): AppThunkAction<KnownAction> => (dispatch: any, getState: any) => {
        const appState = getState();
        if (appState && appState.project) {
            var date = fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: Email,
                    password: Password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status != 200) throw new Error('Auth not complit'); return response.json() as Promise<{ access_token: string, name: string }> }).then(data => {
                dispatch({ type: 'RECEIVE_AUTHENTICATION', name: data.name, access_token: data.access_token })

            }).catch((error) => { console.log(error); });
            dispatch({ type: 'REQUEST_AUTHENTICATION' });
        }
    },
    reqistrationAuth: (Name: string, Email: string, Password: string): AppThunkAction<KnownAction> => (dispatch: any, getState: any) => {
        const appState = getState();
        if (appState && appState.project) {
            var date = fetch('http://localhost:5000/auth/registration', {
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
                dispatch({
                    type: 'RECEIVE_AUTHENTICATION', name: data.name, access_token: data.access_token })

            }).catch((error) => { console.log(error); });
            dispatch({ type: 'REQUEST_AUTHENTICATION' });
        }
    },
    authClear: (): AppThunkAction<KnownAction> => (dispatch: any, getState: any) => {
        dispatch({ type: 'CLEAR_AUTHENTICATION' });
    }
}

const unloadedState: AuthenticationState = { isLoading: false, isAuth: false, name: '', access_token: ''}

export const reducer: Reducer<AuthenticationState> = (state: AuthenticationState | undefined, incomingAction: Action): AuthenticationState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_AUTHENTICATION':
            return {
                isLoading: false,
                isAuth: true,
                name: action.name,
                access_token: action.access_token
            };
        case 'REQUEST_AUTHENTICATION':
            return {
                isLoading: true,
                isAuth: false,
                name: state.name,
                access_token: state.access_token
            };
        case 'CLEAR_AUTHENTICATION':
            return unloadedState;
        default: break;
    }

    return state;
};

