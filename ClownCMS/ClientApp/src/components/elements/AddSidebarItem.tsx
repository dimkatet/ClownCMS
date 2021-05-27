import * as React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

export default function AddItem(props: any) {
    const [text, setText] = React.useState('');
    const [isEdit, setEdit] = React.useState(false);
    return (
        <div>
            {!isEdit && <div
                className='left-menu-add'
                onClick={() => setEdit(true)}
            >
                <AddIcon />
            </div>}
            {isEdit && <div className='nav-item-edit'>
                <input
                    className='nav-item-edit-input'
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }} />
                <div className='nav-item-edit-buttons'>
                    <div
                        className='nav-item-edit-button'
                        onClick={() => {
                            setEdit(false);
                            props.save(text);
                            setText('');
                        }}
                    >
                        <AddIcon />
                    </div>
                    <div
                        className='nav-item-edit-button'
                        onClick={() => {
                            setEdit(false);
                            setText('');
                        }}
                    >
                        <CloseIcon />
                    </div>
                </div>
            </div>}
        </div>
    )
}