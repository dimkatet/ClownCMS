import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import config from './project_config.json';

export interface ProjectState {
    isLoading: boolean,
    ProjectId: number,
    navMenuItems: NavMenuItem[],
    projectData: ProjectData    
}

export interface NavMenuItem {
    menuItemId: number;
    menuItemName: string;
    menuItemType: number;
}

interface ProjectData {
    projectName: string
}

interface RequestProjectMenuAction {
    type: 'REQUEST_PROJECT_MENU';
}

interface ReceiveProjectsMenuAction {
    type: 'RECEIVE_PROJECT_MENU';
    navMenuItems: NavMenuItem[];
}

interface ReceiveProjectData {
    type: 'RECEIVE_PROJECT_DATA',
    projectData: ProjectData

}

interface ChangeProjectsMenuItemAction {
    type: 'CHANGE_PROJECT_MENU_ITEM';
    navMenuItem: NavMenuItem;
}

interface AddProjectsMenuItemAction {
    type: 'ADD_PROJECT_MENU_ITEM';
    navMenuItem: NavMenuItem;
}

interface SelectProjectAction {
    type: 'SELECT_PROJECT_ACTION',
    projectID: number
}

const requestMenu = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.project) {
        fetch(config.URL + 'menuItems/' + appState.project.ProjectId, { method: 'GET' })
            .then(response => response.json() as Promise<NavMenuItem[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_PROJECT_MENU', navMenuItems: data });
            });
        dispatch({ type: 'REQUEST_PROJECT_MENU' });
    }
}

const requestProjectData = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.project) {
        fetch('projects/' + appState.project.ProjectId, { method: 'GET' })
            .then(response => response.text() as Promise<string>)
            .then(data => {
                dispatch({ type: 'RECEIVE_PROJECT_DATA', projectData: { projectName: data } });
            })
    }
}

type KnownAction = RequestProjectMenuAction | ReceiveProjectsMenuAction | ChangeProjectsMenuItemAction | AddProjectsMenuItemAction | SelectProjectAction | ReceiveProjectData;

export const actionCreators = {

    requestMenu: (): AppThunkAction<KnownAction> => requestMenu,

    requestProjectData: (): AppThunkAction<KnownAction> => requestProjectData,

    setMenuItem: (menuItemId: number, menuItemName: string, menuItemType: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(data => {
                if (data.status === 200)
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
        //if (response.status != 200) return;
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { return response.json() as Promise<NavMenuItem> }).then(data => {
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
        if (appState && appState.project) {
            fetch('menuItems', {
                method: 'DELETE',
                body: JSON.stringify({
                    menuItemId: menuItemId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestMenu(dispatch, getState) } })
        }
    },

    selectProject: (projectID: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.project) {
            dispatch({ type: 'SELECT_PROJECT_ACTION', projectID: projectID });
        }
    }
};

const unloadedState: ProjectState = { navMenuItems: [], isLoading: false, ProjectId: config.Project.ProjectId, projectData: {} as ProjectData }

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
                ProjectId: state.ProjectId,
                projectData: state.projectData
            };
        case 'RECEIVE_PROJECT_MENU':
            return {
                navMenuItems: action.navMenuItems,
                isLoading: false,
                ProjectId: state.ProjectId,
                projectData: state.projectData
            };
        case 'RECEIVE_PROJECT_DATA':
            return {
                navMenuItems: state.navMenuItems,
                isLoading: state.isLoading,
                ProjectId: state.ProjectId,
                projectData: action.projectData
            };
        case 'CHANGE_PROJECT_MENU_ITEM':
            let index = state.navMenuItems.findIndex(x => x.menuItemId === action.navMenuItem.menuItemId)
            let navMenuItems = state.navMenuItems;
            if (index !== -1)
                navMenuItems[index] = action.navMenuItem;
            return {
                navMenuItems: navMenuItems,
                isLoading: false,
                ProjectId: state.ProjectId,
                projectData: state.projectData
            };
        case 'ADD_PROJECT_MENU_ITEM':
            return {
                navMenuItems: [...state.navMenuItems, action.navMenuItem],
                isLoading: false,
                ProjectId: state.ProjectId,
                projectData: state.projectData
            };
        case 'SELECT_PROJECT_ACTION':
            return {
                navMenuItems: state.navMenuItems,
                isLoading: state.isLoading,
                ProjectId: action.projectID,
                projectData: state.projectData
            }
        default: break;
    }

    return state;
};