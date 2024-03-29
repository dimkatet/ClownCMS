﻿import * as React from 'react';
import PreviewEditor from './PreviewEditor';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import './styles/ContentPreview.css';
import config from '../../store/project_config.json';
import { Link } from 'react-router-dom';

export default function BodyPreview(props: {
    previewName: string,
    previewDescription: string,
    imageURL?: string,
    execute: () => void,
    link: string,
    edit: (setState: Function) => (name: string, description: string, image?: File, imageURL?: string) => void,
    delete: () => void,
    isAuth: boolean
}) {
    const [onOver, setOver] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false)
    return (
        <div
            className='preview'
            onMouseOver={() =>
                setOver(true)
            }
            onMouseLeave={() =>
                setOver(false)
            }
        >
            <Link
                className='preview-container'
                onClick={props.execute}
                to={props.link}
            >
                <div className='preview-header'>
                    <h3>
                        {props.previewName}
                    </h3>
                </div>
                <div className='preview-description'>
                    <div>{props.previewDescription}</div>
                </div>
                {props.imageURL && <div className='preview-image-container'>
                    <img
                        className='preview-image'
                        src={config.URL.slice(0, -1) + props.imageURL}
                        alt='Preview'
                    />
                </div>}
            </Link>
            {onOver && props.isAuth && <div className='preview-buttons'>
                <div
                    className='preview-settings'
                    onClick={(e) => {
                        setIsEdit(true);
                    }}
                >
                    <SettingsIcon fontSize='inherit' />
                </div>
                <div
                    className='preview-delete'
                    onClick={props.delete}
                >
                    <DeleteIcon fontSize='inherit' />
                </div>
            </div>}
            {isEdit && props.isAuth && <PreviewEditor
                onClose={() => setIsEdit(false)}
                onSubmit={props.edit(setIsEdit)}
                name={props.previewName}
                description={props.previewDescription}
                imageURL={props.imageURL}
            />}
        </div>
    )
}