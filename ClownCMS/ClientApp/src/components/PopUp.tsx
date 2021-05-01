import * as React from 'react';
import './PopUp.css'    

type PopUpProps = { onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void };

class PopUp extends React.Component<PopUpProps>
{
    constructor(props: PopUpProps) {
        super(props);
    }

    public render() {
        return (
            <React.Fragment>
                <div className='popUpBG' >
                    <div className='popUpContainer'>
                        <button className='closeBtn' onClick={this.props.onClose}>X</button>
                        {this.props.children}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default PopUp;