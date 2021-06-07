import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { ContentState, convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import config from './project_config.json';
import * as NavigationStore from './NavigationStore'

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
    projectName: string,
    footerContent: ContentState
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

interface UpdateFooterAction {
    type: 'UPDATE_FOOTER',
    content: ContentState
};

interface SaveFooterAction {
    type: 'SAVE_FOOTER',
    status: boolean
};

const requestMenu = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.project) {
        fetch(config.URL + 'menuItems/' + appState.project.ProjectId, { method: 'GET' })
            .then(response => response.json() as Promise<NavMenuItem[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_PROJECT_MENU', navMenuItems: data });
                if (data.length > 0) {
                    const menuItem = data.find(item => item.menuItemId === parseInt(appState.navigation.matchState.menuItemId) ? true : false) || data[0];
                    NavigationStore.actionCreators.setCurrentMenuItem(menuItem)(dispatch, getState);
                }
            });
        dispatch({ type: 'REQUEST_PROJECT_MENU' });
    }
}

const requestProjectData = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.project) {
        fetch(config.URL + 'projects/' + appState.project.ProjectId, { method: 'GET' })
            .then(response => response.json() as Promise<{ projectName: string, footerContent: string }>)
            .then(data => {
                const content = convertFromRaw(JSON.parse(data.footerContent));
                dispatch({
                    type: 'RECEIVE_PROJECT_DATA',
                    projectData: {
                        projectName: data.projectName,
                        footerContent: content
                    }
                });
            })
    }
}

export type ProjectAction = RequestProjectMenuAction | ReceiveProjectsMenuAction | ChangeProjectsMenuItemAction | AddProjectsMenuItemAction | SelectProjectAction | ReceiveProjectData | UpdateFooterAction | SaveFooterAction;

export const actionCreators = {

    requestMenu: (): AppThunkAction<ProjectAction> => requestMenu,

    requestProjectData: (): AppThunkAction<ProjectAction> => requestProjectData,

    setMenuItem: (menuItemId: number, menuItemName: string, menuItemType: number): AppThunkAction<ProjectAction> => (dispatch, getState) => {
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

    addMenuItem: (menuItemName: string, menuItemType: number): AppThunkAction<ProjectAction> => (dispatch, getState) => {
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

    deleteMenuItem: (menuItemId: number): AppThunkAction<ProjectAction> => (dispatch, getState) => {
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

    selectProject: (projectID: number): AppThunkAction<ProjectAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.project) {
            dispatch({ type: 'SELECT_PROJECT_ACTION', projectID: projectID });
        }
    },

    updateFooter: (content: ContentState): AppThunkAction<ProjectAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.project) {
            dispatch({ type: 'UPDATE_FOOTER', content: content });
        }
    },

    saveFooter: (content: ContentState): AppThunkAction<ProjectAction> => (dispatch, getState) => {
        const appState = getState();
        console.log('load');
        if (appState && appState.project) {
            const c = convertToRaw(content);
            const item = {
                projectId: appState.project.ProjectId,
                footerContent: JSON.stringify(c)
            }
            fetch('projects/footer', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify(item)
            })
                .then(response => response.ok)
                .then(status => dispatch({ type: 'SAVE_FOOTER', status }));
        }
    }
};

export const unloadedState: ProjectState = { navMenuItems: [], isLoading: false, ProjectId: config.Project.ProjectId, projectData: { projectName: '', footerContent: EditorState.createEmpty().getCurrentContent() } }

export const reducer: Reducer<ProjectState> = (state: ProjectState | undefined, incomingAction: Action): ProjectState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as ProjectAction;
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
        case 'UPDATE_FOOTER':
            return {
                navMenuItems: state.navMenuItems,
                isLoading: state.isLoading,
                ProjectId: state.ProjectId,
                projectData: {
                    projectName: state.projectData.projectName,
                    footerContent: action.content
                }
            }
        case 'SAVE_FOOTER':
            console.log('Footer saved');
            return state;
        default: break;
    }

    return state;
};