import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface TestState {
    text: string;
}


interface InitValueAction {
    type: 'INIT_VALUE';
    text: string;
}


type KnownAction = InitValueAction ;

export const actionCreators = {
    setValue: (text: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        //const appState = getState();
        dispatch({ type: 'INIT_VALUE', text: text });
    }
};

const unloadedState: TestState = { text: ""};

export const reducer: Reducer<TestState> = (state: TestState | undefined, incomingAction: Action): TestState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'INIT_VALUE':
            return {
                text: action.text
            };
        default: return state;
    }

    //return state;
};