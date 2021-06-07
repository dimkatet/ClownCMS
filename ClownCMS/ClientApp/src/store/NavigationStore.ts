import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { NavMenuItem } from './ProjectStore';
import * as BodyStore from './BodyStore';
import config from './project_config.json';

export interface NavigatinonState {
    isLoading: boolean,
    menuItem: NavMenuItem,
    isActual: boolean,
    isShowContent: boolean,
    sections: Section[],
    currentCategory: Category,
    matchState: Match
}

export interface Preview {
    previewId: number;
    previewName: string;
    previewDescription: string;
    imageURL?: string;
    categoryId: number;
}

export interface Category {
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

export interface Match {
    menuItemId: string,
    sectionId: string,
    categoryId: string,
    previewId: string
}

interface ResetNavigationAction {
    type: 'RESET_NAVIGATION'
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

interface SetCurrentCategory {
    type: 'SET_CUR_CATEGORY',
    category: Category
}

interface NavState {
    type: 'NAV_STATE';
}

interface EmptyState {
    type: 'EMPTY_STATE';
}

interface PageState {
    type: 'PAGE_STATE';
    state: boolean;
}

interface SetMatchAction {
    type: 'SET_MATCH',
    matchState: Match
}

export type NavigationAction = ResetNavigationAction | RequestNavigationAction | ReceiveNavigationAction | SetMenuItemAction | NavState | EmptyState | PageState | SetCurrentCategory | SetMatchAction;

const resetNavigation = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.navigation) {
        dispatch({ type: 'RESET_NAVIGATION' });
    }
}

const requestNavigation = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.navigation && appState.navigation.menuItem) {
        fetch(config.URL + 'navigation/' + appState.navigation.menuItem.menuItemId, { method: 'GET' })
            .then(response => response.json() as Promise<Section[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_NAVIGATION', sections: data });
                navigationHandler(data)(dispatch, getState);
            });
        dispatch({ type: 'REQUEST_NAVIGATION' });
    }
}

const navigationHandler = (data: Section[]): AppThunkAction<NavigationAction> => (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.navigation && data.length > 0 && data[0].categories.length > 0) {
        const type = appState.navigation.menuItem.menuItemType;
        let section = data.find(item => {
            if (item.sectionId === parseInt(appState.navigation.matchState.sectionId))
                return true;
            return false;
        }) || data[0];
        /*section = section ? section : data[0];*/
        let category = section.categories.find(item => {
            if (item.categoryId === parseInt(appState.navigation.matchState.categoryId))
                return true;
            return false;
        }) || section.categories[0];
        /*category = category ? category : section.categories[0];*/
        let preview = category.previews.find(item => {
            if (item.previewId === parseInt(appState.navigation.matchState.previewId))
                return true;
            return false;
        }) || category.previews[0];
        if (type === 0 || type === 2 || type === 4 || (preview && preview.previewId === parseInt(appState.navigation.matchState.previewId))) {
            actionCreators.setCurrentCategory(category)(dispatch, getState);
            BodyStore.actionCreators.requestContent(preview.previewId)(dispatch, getState);
            actionCreators.openPage()(dispatch, getState);
        } else if (type === 1 || type === 3 || type === 5) {
            actionCreators.setCurrentCategory(category)(dispatch, getState);
            Updated(dispatch, getState);
        }
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

const postImage = async (image?: File) => {
    if (image === undefined)
        return '';
    const formData = new FormData();
    let urn = '';
    formData.append('data', image)
    await fetch('image', {
        method: 'POST',
        body: formData
    })
        .then(r => r.text())
        .then(data => {
            urn = data
        })
    return urn;

}

export const actionCreators = {

    setMatch: (matchState: Match): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation && appState.project) {
            dispatch({ type: 'SET_MATCH', matchState: matchState });
            if (appState.project.navMenuItems.length > 0) {
                const menuItem = appState.project.navMenuItems.find(item => item.menuItemId === parseInt(matchState.menuItemId) ? true : false) || appState.project.navMenuItems[0];
                actionCreators.setCurrentMenuItem(menuItem)(dispatch, getState);
            }
        }
    },

    resetNavigation: (): AppThunkAction<NavigationAction> => resetNavigation,

    requestNavigation: (): AppThunkAction<NavigationAction> => requestNavigation,

    setCurrentMenuItem: (MenuItem: NavMenuItem): AppThunkAction<NavigationAction> => (dispatch: any, getState: any) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'SET_MENU_ITEM', menuItem: MenuItem });
            requestNavigation(dispatch, getState);
        }
    },

    navigatinonUpdated: (): AppThunkAction<NavigationAction> => Updated,

    navigatinonClear: (): AppThunkAction<NavigationAction> => Clear,

    openPage: (): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'PAGE_STATE', state: true });
        }
    },

    closePage: (): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'PAGE_STATE', state: false });
        }
    },

    setSection: (sectionId: number, sectionName: string): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('section', {
                method: 'POST',
                body: JSON.stringify({
                    sectionId: sectionId,
                    sectionName: sectionName
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
        }
    },
    deleteSection: (sectionId: number): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('section', {
                method: 'DELETE',
                body: JSON.stringify({
                    sectionId: sectionId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
        }
    },

    addSection: (sectionName: string): AppThunkAction<NavigationAction> => (dispatch, getState) => {
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
        }
    },

    setCategory: (categoryId: number, categoryName: string): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('category', {
                method: 'POST',
                body: JSON.stringify({
                    categoryId: categoryId,
                    categoryName: categoryName
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
        }
    },

    deleteCategory: (categoryId: number): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('category', {
                method: 'DELETE',
                body: JSON.stringify({
                    categoryId: categoryId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
        }
    },

    addCategory: (categoryName: string, sectionId: number): AppThunkAction<NavigationAction> => (dispatch, getState) => {
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
        }
    },

    setPreview: (previewId: number, previewName: string, previewDescription: string, imageURL: string, image?: File): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            postImage(image).then(urn => {
                fetch('preview', {
                    method: 'POST',
                    body: JSON.stringify({
                        previewId: previewId,
                        previewName: previewName,
                        previewDescription: previewDescription,
                        imageURL: image ? urn : imageURL
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
            });
        }
    },

    deletePreview: (previewId: number): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('preview', {
                method: 'DELETE',
                body: JSON.stringify({
                    previewId: previewId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
        }
    },

    addPreview: (categoryId: number, previewName: string, previewDescription: string, image?: File): AppThunkAction<NavigationAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation && previewName) {
            postImage(image).then(urn => {
                fetch('preview', {
                    method: 'PUT',
                    body: JSON.stringify({
                        categoryId: categoryId,
                        preview: {
                            previewName: previewName,
                            previewDescription: previewDescription,
                            imageURL: urn
                        }
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(response => { if (response.status === 200) { requestNavigation(dispatch, getState) } })
            })
        }
    },

    setCurrentCategory: (category: Category): AppThunkAction<NavigationAction> => (dispatch: any, getState: any) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'SET_CUR_CATEGORY', category });
        }
    },
}

export const unloadedState: NavigatinonState = {
    sections: [],
    isLoading: false,
    isActual: false,
    isShowContent: false,
    menuItem: {} as NavMenuItem,
    currentCategory: {} as Category,
    matchState: {} as Match
}

export const reducer: Reducer<NavigatinonState> = (state: NavigatinonState | undefined, incomingAction: Action): NavigatinonState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as NavigationAction;
    switch (action.type) {
        case 'SET_MATCH':
            return { ...state, matchState: action.matchState };
        case 'RESET_NAVIGATION':
            return unloadedState;
        case 'REQUEST_NAVIGATION':
            return {
                sections: state.sections,
                isLoading: true,
                isActual: false,
                isShowContent: false,
                menuItem: state.menuItem,
                currentCategory: state.currentCategory,
                matchState: state.matchState
            };
        case 'RECEIVE_NAVIGATION':
            return {
                sections: action.sections,
                isLoading: false,
                isActual: false,
                isShowContent: false,
                menuItem: state.menuItem,
                currentCategory: state.currentCategory,
                matchState: state.matchState
            };
        case 'SET_MENU_ITEM':
            return {
                sections: state.sections,
                isLoading: false,
                isActual: false,
                isShowContent: false,
                menuItem: action.menuItem,
                currentCategory: state.currentCategory,
                matchState: state.matchState
            };
        case 'NAV_STATE':
            return {
                sections: state.sections,
                isLoading: false,
                isActual: true,
                isShowContent: state.isShowContent,
                menuItem: state.menuItem,
                currentCategory: state.currentCategory,
                matchState: state.matchState
            };
        case 'SET_CUR_CATEGORY':
            return {
                sections: state.sections,
                isLoading: false,
                isActual: true,
                isShowContent: state.isShowContent,
                menuItem: state.menuItem,
                currentCategory: action.category,
                matchState: state.matchState
            }
        case 'EMPTY_STATE':
            return unloadedState;
        case 'PAGE_STATE':
            return { ...state, isShowContent: action.state };
        default: break;
    }

    return state;
};

