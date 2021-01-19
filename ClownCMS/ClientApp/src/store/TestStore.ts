import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface TestState {
    text: string;
    navType: number;
}


interface Save {
    type: 'SAVE';
    text: string;
    navType: number
}



type KnownAction = Save;

export const actionCreators = {
    Save: (text: string, navType: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        //const appState = getState();
        dispatch({ type: 'SAVE', text: text, navType: navType });
    },
};

const unloadedState: TestState = { text: "", navType: 3 };

export const reducer: Reducer<TestState> = (state: TestState | undefined, incomingAction: Action): TestState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SAVE':
            return {
                text: action.text,
                navType: action.navType
            };
        default: return state;
    }

    //return state;
};