import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../store';
import NavMenuEditor from '../../elements/NavMenuEditor';


/*similar to every page in project*/
export default class Header extends React.PureComponent
{

    public componentDidMount() {
        //
    }

    public componentDidUpdate() {
        //
    }


    public render() {
        return <NavMenuEditor />
    }

}
