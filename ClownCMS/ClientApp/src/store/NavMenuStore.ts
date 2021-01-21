import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface ProjectState {
    isLoading: boolean;
    ProjectId: number;
    navMenuItems: NavMenuItem[];
}

export interface NavMenuItem {
    menuItemId: number;
    menuItemName: string;
    menuItemType: number;
}

interface RequestProjectMenuAction {
    type: 'REQUEST_PROJECT_MENU';
}

interface ReceiveProjectsMenuAction {
    type: 'RECEIVE_PROJECT_MENU';
    navMenuItems: NavMenuItem[];
}

interface ChangeProjectsMenuItemAction {
    type: 'CHANGE_PROJECT_MENU_ITEM';
    navMenuItem: NavMenuItem;
}

interface AddProjectsMenuItemAction {
    type: 'ADD_PROJECT_MENU_ITEM';
    navMenuItem: NavMenuItem;
}

const requestMenu = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.menuItems) {
        fetch('menuItems/' + appState.menuItems.ProjectId, { method: 'GET' })
            .then(response => response.json() as Promise<NavMenuItem[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_PROJECT_MENU', navMenuItems: data });
            });
        dispatch({ type: 'REQUEST_PROJECT_MENU' });
    }
}

type KnownAction = RequestProjectMenuAction | ReceiveProjectsMenuAction | ChangeProjectsMenuItemAction | AddProjectsMenuItemAction;

export const actionCreators = {
    requestMenu: (): AppThunkAction<KnownAction> => requestMenu,
    setMenuItem: (menuItemId: number, menuItemName: string, menuItemType: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.menuItems) {
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
        if (appState && appState.menuItems) {
            fetch('menuItems', {
                method: 'PUT',
                body: JSON.stringify({
                    projectId: appState.menuItems.ProjectId,
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
    deleteMenuItem: ( menuItemId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.menuItems) {
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
    }
};

const unloadedState: ProjectState = { navMenuItems: [], isLoading: false, ProjectId: 1}

export const reducer: Reducer<ProjectState> = (state: ProjectState | undefined, incomingAction: Action): ProjectState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_PROJECT_MENU':
            return {
                navMenuItems: state.navMenuItems,
                isLoading: true,
                ProjectId: state.ProjectId
            };
        case 'RECEIVE_PROJECT_MENU':
            return {
                navMenuItems: action.navMenuItems,
                isLoading: false,
                ProjectId: state.ProjectId
            };
        case 'CHANGE_PROJECT_MENU_ITEM':
            let index = state.navMenuItems.findIndex(x => x.menuItemId == action.navMenuItem.menuItemId)
            let navMenuItems = state.navMenuItems;
            if (index != -1)
                navMenuItems[index] = action.navMenuItem;
            return {
                navMenuItems: navMenuItems,
                isLoading: false,
                ProjectId: state.ProjectId
            };
        case 'ADD_PROJECT_MENU_ITEM':
            return {
                navMenuItems: [...state.navMenuItems, action.navMenuItem],
                isLoading: false,
                ProjectId: state.ProjectId
            };
        default: break;
    }

    return state;
};