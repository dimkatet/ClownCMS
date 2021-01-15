import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../store';
import {TextEditor} from '../../Elements/TextEditor';
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
            <React.Fragment>
                <div>
                    <TextEditor text={this.props.text} saveText={this.props.setValue} />
                </div>
            </React.Fragment>
        )
    }

}


export default connect(
    (state: ApplicationState) => state.test, // Selects which state properties are merged into the component's props
    TestStore.actionCreators // Selects which action creators are merged into the component's props
)(Header as any);