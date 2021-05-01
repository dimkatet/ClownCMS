import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { NavMenuItem } from './ProjectStore';

export interface NavigatinonState {
    isLoading: boolean;
    menuItem: NavMenuItem;
    isActual: boolean;
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

interface NavState {
    type: 'NAV_STATE';
}

type KnownAction = RequestNavigationAction | ReceiveNavigationAction | SetMenuItemAction | NavState;

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
const Updated = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.navigation && appState.navigation) {
        dispatch({ type: 'NAV_STATE' });
    }
}

export const actionCreators = {
    requestNavigation: (): AppThunkAction<KnownAction> => requestNavigation,
    setCurrentMenuItem: (MenuItem: NavMenuItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'SET_MENU_ITEM', menuItem: MenuItem });
            requestNavigation(dispatch, getState);
        }
    },
    updated: (): AppThunkAction<KnownAction> => Updated
}

const unloadedState: NavigatinonState = { sections: [], isLoading: false, isActual: false, menuItem: {} as NavMenuItem }

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
                isActual: false,
                menuItem: state.menuItem
            };
        case 'RECEIVE_NAVIGATION':
            return {
                sections: action.sections,
                isLoading: false,
                isActual: false,
                menuItem: state.menuItem
            };
        case 'SET_MENU_ITEM':
            return {
                sections: state.sections,
                isLoading: false,
                isActual: false,
                menuItem: action.menuItem
            };
        case 'NAV_STATE':
            return {
                sections: state.sections,
                isLoading: false,
                isActual: true,
                menuItem: state.menuItem
            };
        default: break;
    }

    return state;
};

