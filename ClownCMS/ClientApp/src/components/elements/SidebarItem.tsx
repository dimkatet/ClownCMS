import * as React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { Link } from 'react-router-dom';

export default function SiderBarItem(props: any) {

    const [text, setText] = React.useState(props.Name);
    const [isEdit, setEdit] = React.useState(false);
    const [isOver, setOver] = React.useState(false);
    React.useEffect(() => { setText(props.Name) }, [props.Name]);
    return (
        <div onMouseOver={() =>
            setOver(true)
        }
            onMouseLeave={() =>
                setOver(false)
            }
        >
            {!isEdit && <div>
                <div className={`left-menu-section ${props.isCurrent ? 'active' : null}`}
                >
                    <div className='left-menu-section-content' onClick={props.execute}>
                        {props.link ? <Link to={props.link}>{text}</Link> : <p>{text}</p>}
                    </div>
                    {isOver && props.isAuth && <SettingsIcon
                        className='left-menu-section-change'
                        onClick={() => {
                            setEdit(true);
                            setOver(false);
                        }} />}
                </div>
            </div>}
            {isEdit && <div className='nav-item-edit'>
                <input
                    className='nav-item-edit-input'
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}
                />
                <div className='nav-item-edit-buttons'>
                    <div
                        className='nav-item-edit-button'
                        onClick={() => {
                            setEdit(false);
                            if (text !== props.Name)
                                props.save(text);
                            setText(props.Name);
                        }}
                    >
                        <SaveIcon />
                    </div>
                    <div
                        className='nav-item-edit-button'
                        onClick={() => {
                            setEdit(false);
                            props.delete();
                        }}
                    >
                        <DeleteIcon />
                    </div>
                </div>
            </div>}
            {props.children}
        </div>
    )
}