import * as React from 'react';
import './styles/PopUp.css'
import CloseIcon from '@material-ui/icons/Close';

type PopUpProps = { onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void };

class PopUp extends React.Component<PopUpProps>
{
    public render() {
        return (
            <React.Fragment>
                <div className='pop-up-bg' >
                    <div className='pop-up-container'>
                        <div
                            className='close-btn'
                            onMouseDown={this.props.onClose}
                        >
                            <CloseIcon fontSize='inherit'/>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default PopUp;