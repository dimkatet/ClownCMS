import * as React from 'react';
import Body from './middle-components/Body';
import LeftMenu from './middle-components/LeftMenu';
import RightMenu from './middle-components/RightMenu';
import './styles/Middle.css';



export default class Middle extends React.PureComponent
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