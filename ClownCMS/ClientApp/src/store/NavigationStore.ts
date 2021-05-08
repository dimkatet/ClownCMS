﻿import { clear } from 'console';
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

interface EmptyState {
    type: 'EMPTY_STATE';
}

type KnownAction = RequestNavigationAction | ReceiveNavigationAction | SetMenuItemAction | NavState | EmptyState;

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
    if (appState && appState.navigation) {
        dispatch({ type: 'NAV_STATE' });
    }
}

const Clear = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.navigation) {
        dispatch({ type: 'EMPTY_STATE' });
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
    navigatinonUpdated: (): AppThunkAction<KnownAction> => Updated,
    NavigatinonClear: (): AppThunkAction<KnownAction> => Clear,
    setSection: (sectionId: number, sectionName: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('section', {
                method: 'POST',
                body: JSON.stringify({
                    sectionId: sectionId,
                    sectionName: sectionName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    deleteSection: (sectionId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('section', {
                method: 'DELETE',
                body: JSON.stringify({
                    sectionId: sectionId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    addSection: (sectionName: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('section', {
                method: 'PUT',
                body: JSON.stringify({
                    menuItemId: appState.navigation.menuItem.menuItemId,
                    section: {
                        sectionName: sectionName
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    setCategory: (categoryId: number, categoryName: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('category', {
                method: 'POST',
                body: JSON.stringify({
                    categoryId: categoryId,
                    categoryName: categoryName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    deleteCategory: (categoryId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('category', {
                method: 'DELETE',
                body: JSON.stringify({
                    categoryId: categoryId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    addCategory: (categoryName: string, sectionId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('category', {
                method: 'PUT',
                body: JSON.stringify({
                    sectionId: sectionId,
                    category: {
                        categoryName: categoryName
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    setPreview: (previewId: number, previewName: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('preview', {
                method: 'POST',
                body: JSON.stringify({
                    previewId: previewId,
                    previewName: previewName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    deletePreview: (previewId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('preview', {
                method: 'DELETE',
                body: JSON.stringify({
                    previewId: previewId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },
    addPreview: (previewName: string, categoryId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('preview', {
                method: 'PUT',
                body: JSON.stringify({
                    categoryId: categoryId,
                    preview: {
                        previewName: previewName
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    }
}



/*setMenuItem: (menuItemId: number, menuItemName: string, menuItemType: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (appState && appState.project) {
        fetch('menuItems', {
            method: 'POST',
            body: JSON.stringify({
                menuItemId: menuItemId,
                menuItemName: menuItemName,
                menuItemType: menuItemType
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => {
            dispatch({
                type: 'CHANGE_PROJECT_MENU_ITEM', navMenuItem: {
                    menuItemId: menuItemId,
                    menuItemName: menuItemName,
                    menuItemType: menuItemType
                }
            })
        });
        dispatch({ type: 'REQUEST_PROJECT_MENU' });
    }
},
    addMenuItem: (menuItemName: string, menuItemType: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.project) {
            fetch('menuItems', {
                method: 'PUT',
                body: JSON.stringify({
                    projectId: appState.project.ProjectId,
                    menuItem: {
                        menuItemName: menuItemName,
                        menuItemType: menuItemType
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json() as Promise<NavMenuItem>).then(data => {
                dispatch({
                    type: 'ADD_PROJECT_MENU_ITEM', navMenuItem: {
                        menuItemId: data.menuItemId,
                        menuItemName: data.menuItemName,
                        menuItemType: data.menuItemType
                    }
                })
            });
            dispatch({ type: 'REQUEST_PROJECT_MENU' });
        }
    },
        deleteMenuItem: (menuItemId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
            const appState = getState();
            if (appState && appState.project) {
                fetch('menuItems', {
                    method: 'DELETE',
                    body: JSON.stringify({
                        menuItemId: menuItemId
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => { if (response.status == 200) { requestMenu(dispatch, getState) } })
            }
        }*/

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
        case 'EMPTY_STATE':
            return unloadedState;
        default: break;
    }

    return state;
};
