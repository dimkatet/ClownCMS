import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../store';
//import * as ProjectStore from '../../store/ProjectConfig';
import Body from './MiddleComponents/Body';
import LeftMenu from './MiddleComponents/LeftMenu';
import RightMenu from './MiddleComponents/RightMenu';
import './Middle.css';


/*type ProjectProps =
    ProjectsStore.ProjectsState // ... state we've requested from the Redux store
    & typeof ProjectsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>;*/


/*
 * Content part
 * setting dimensions for components
 */
export default class Middle extends React.PureComponent//<ProjectsProps>
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
                <div className='wrapper_Middle'>
                        <LeftMenu />
                        <Body />
                        <RightMenu />
                </div>
            </React.Fragment>
        )
    }

}

/*
export default connect(
    (state: ApplicationState) => state.projects, // Selects which state properties are merged into the component's props
    ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(NavigationEditor as any);*/