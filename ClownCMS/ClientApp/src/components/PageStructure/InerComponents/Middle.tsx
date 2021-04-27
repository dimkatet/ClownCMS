import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../store';
import * as NavigationStore from '../../../store/NavigationStore';
import Body from './MiddleComponents/Body';
import LeftMenu from './MiddleComponents/LeftMenu';
import RightMenu from './MiddleComponents/RightMenu';
import './Middle.css';


type Props =
    NavigationStore.NavigatinonState 
    & typeof NavigationStore.actionCreators;


/*
 * Content part
 * setting dimensions for components
 */
class Middle extends React.PureComponent<Props>
{

    public componentDidMount() {
        //this.props.requestMenu();
    }

    public componentDidUpdate() {
        //
    }


    public render() {
        console.log(this.props);
        return (
            <React.Fragment>
                <div className='wrapper_Middle'>
                    <div>
                        <LeftMenu />
                    </div>
                    <div>
                        <Body />
                    </div>
                    <div>
                        <RightMenu />
                    </div>
                </div>
            </React.Fragment>
        )
    }

}


export default connect(
    (state: ApplicationState) => state.navigation, // Selects which state properties are merged into the component's props
    NavigationStore.actionCreators // Selects which action creators are merged into the component's props
)(Middle as any);