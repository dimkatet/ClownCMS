import * as StartPageStore from './StartPageStore';
import * as ProjectStore from './ProjectStore'
import * as NavigationStore from './NavigationStore';
import * as BodyStore from './BodyStore';

// The top-level state object
export interface ApplicationState {
    startPage: StartPageStore.StartPageState | undefined;
    project: ProjectStore.ProjectState | undefined;
    navigation: NavigationStore.NavigatinonState | undefined;
    body: BodyStore.BodyState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    startPage: StartPageStore.reducer,
    project: ProjectStore.reducer,
    body: BodyStore.reducer,
    navigation: NavigationStore.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
