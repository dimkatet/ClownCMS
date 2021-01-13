import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../../store';
//import * as ProjectStore from '../../store/ProjectConfig';


/*type ProjectProps =
    ProjectsStore.ProjectsState // ... state we've requested from the Redux store
    & typeof ProjectsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>;*/

/*
 * Navigation | None
 */
export default class LeftMenu extends React.PureComponent//<ProjectsProps>
{

    public componentDidMount() {
        //
    }

    public componentDidUpdate() {
        //
    }


    public render() {
        return (
            <React.Fragment>
                <div>LeftMenu</div>
            </React.Fragment>
        )
    }

}

/*
export default connect(
    (state: ApplicationState) => state.projects, // Selects which state properties are merged into the component's props
    ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(NavigationEditor as any);*/