import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { NavMenuItem } from './ProjectStore';

export interface NavigatinonState {
    isLoading: boolean;
    menuItem: NavMenuItem;
    sections: Section[];
}

export interface Preview {
    previewId: number;
    previewName: string;
    categoryId: number;
}

export interface Category
{
    categoryId: number;
    categoryName: string;
    sectionId: number;
    previews: Preview[];
}

export interface Section {
    sectionId: number;
    sectionName: string;
    menuItemId: number;
    categories: Category[];
}

interface ReceiveNavigationAction {
    type: 'RECEIVE_NAVIGATION';
    sections: Section[];
}

interface RequestNavigationAction {
    type: 'REQUEST_NAVIGATION';
}

interface SetMenuItemAction {
    type: 'SET_MENU_ITEM';
    menuItem: NavMenuItem;
}

type KnownAction = RequestNavigationAction | ReceiveNavigationAction | SetMenuItemAction;

const requestNavigation = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.navigation && appState.navigation.menuItem.menuItemId) {
        fetch('navigation/' + appState.navigation.menuItem.menuItemId, { method: 'GET' })
            .then(response => response.json() as Promise<Section[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_NAVIGATION', sections: data });
            });
        dispatch({ type: 'REQUEST_NAVIGATION' });
    }
}

export const actionCreators = {
    requestNavigation: (): AppThunkAction<KnownAction> => requestNavigation,
    setMenuItem: (MenuItem: NavMenuItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'SET_MENU_ITEM', menuItem: MenuItem });
            requestNavigation(dispatch, getState);
        }
    }
}

const unloadedState: NavigatinonState = { sections: [], isLoading: false, menuItem: {} as NavMenuItem }

export const reducer: Reducer<NavigatinonState> = (state: NavigatinonState | undefined, incomingAction: Action): NavigatinonState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_NAVIGATION':
            return {
                sections: state.sections,
                isLoading: true,
                menuItem: state.menuItem
            };
        case 'RECEIVE_NAVIGATION':
            return {
                sections: action.sections,
                isLoading: false,
                menuItem: state.menuItem
            };
        case 'SET_MENU_ITEM':
            return {
                sections: state.sections,
                isLoading: false,
                menuItem: action.menuItem
            };
        default: break;
    }

    return state;
};

