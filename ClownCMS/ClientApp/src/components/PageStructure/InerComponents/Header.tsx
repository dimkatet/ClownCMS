import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../store';
import NavElementEditor from '../../Elements/NavElementEditor';
import * as TestStore from '../../../store/TestStore';


type ProjectProps =
    TestStore.TestState // ... state we've requested from the Redux store
    & typeof TestStore.actionCreators;

/*similar to every page in project*/
class Header extends React.PureComponent<ProjectProps>
{

    public componentDidMount() {
        //
    }

    public componentDidUpdate() {
        //
    }


    public render() {
        return (            
            <div>
                <NavElementEditor text={this.props.text} type={this.props.navType} save={this.props.Save} del={() => { }} />
            </div>
        )
    }

}


export default connect(
    (state: ApplicationState) => state.test, // Selects which state properties are merged into the component's props
    TestStore.actionCreators // Selects which action creators are merged into the component's props
)(Header as any);