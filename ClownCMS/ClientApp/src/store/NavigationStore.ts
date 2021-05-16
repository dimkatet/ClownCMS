import { clear } from 'console';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { NavMenuItem } from './ProjectStore';

export interface NavigatinonState {
    isLoading: boolean;
    menuItem: NavMenuItem;
    isActual: boolean;
    isShowContent: boolean;
    sections: Section[];
}

export interface Preview {
    previewId: number;
    previewName: string;
    previewDescription: string;
    imageURL?: string;
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

interface PageState {
    type: 'PAGE_STATE';
    state: boolean;
}

type KnownAction = RequestNavigationAction | ReceiveNavigationAction | SetMenuItemAction | NavState | EmptyState | PageState;

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
    requestNavigation: (): AppThunkAction<KnownAction> => requestNavigation,
    setCurrentMenuItem: (MenuItem: NavMenuItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'SET_MENU_ITEM', menuItem: MenuItem });
            requestNavigation(dispatch, getState);
        }
    },

    navigatinonUpdated: (): AppThunkAction<KnownAction> => Updated,

    navigatinonClear: (): AppThunkAction<KnownAction> => Clear,

    openPage: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'PAGE_STATE', state: true });
        }
    },

    closePage: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            dispatch({ type: 'PAGE_STATE', state: false });
        }
    },

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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },

    setPreview: (previewId: number, previewName: string, previewDescription: string, imageURL: string, image?: File): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.navigation) {
            fetch('preview', {
                method: 'POST',
                body: JSON.stringify({
                    previewId: previewId,
                    previewName: previewName
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
        }
    },

    addPreview: (categoryId: number, previewName: string, previewDescription: string, image?: File): AppThunkAction<KnownAction> => (dispatch, getState) => {
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
                }).then(response => { if (response.status == 200) { requestNavigation(dispatch, getState) } })
            })
        }
    }
}

const unloadedState: NavigatinonState = { sections: [], isLoading: false, isActual: false, isShowContent: false, menuItem: {} as NavMenuItem }

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
                isShowContent: false,
                menuItem: state.menuItem
            };
        case 'RECEIVE_NAVIGATION':
            return {
                sections: action.sections,
                isLoading: false,
                isActual: false,
                isShowContent: false,
                menuItem: state.menuItem
            };
        case 'SET_MENU_ITEM':
            return {
                sections: state.sections,
                isLoading: false,
                isActual: false,
                isShowContent: false,
                menuItem: action.menuItem
            };
        case 'NAV_STATE':
            return {
                sections: state.sections,
                isLoading: false,
                isActual: true,
                isShowContent: state.isShowContent,
                menuItem: state.menuItem
            };
        case 'EMPTY_STATE':
            return unloadedState;
        case 'PAGE_STATE':
            return { ...state, isShowContent: action.state };
        default: break;
    }

    return state;
};

