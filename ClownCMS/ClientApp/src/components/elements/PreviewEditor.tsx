import * as React from 'react';
import PopUp from './PopUp';

export default function PreviewEditor(props: {
    onClose: () => void,
    onSubmit: (name: string, description: string, image?: File, imageURL?: string) => void,
    name?: string,
    description?: string,
    imageURL?: string
}) {
    const [name, setName] = React.useState(props.name ? props.name : '');
    const [description, setDescription] = React.useState(props.description ? props.description : '');
    const [imageURL, setImageURL] = React.useState(props.imageURL ? props.imageURL : '');
    const [image, setImage] = React.useState<File | undefined>();
    const urlCreator = window.URL || window.webkitURL;
    return <PopUp onClose={props.onClose}>
        <div className='pop-up-content'>
            <div>Название темы:</div>
            <div><input
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }} />
            </div>

            <div>Описание:</div>
            <div><input
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
            />
            </div>

            <div>Выберите фото: </div>
            <div>
                <input
                    type='file'
                    id='middle-file-id'
                    onChange={e => {
                        const files = e.target.files;
                        if (files === null)
                            return;
                        if (!files[0].type.includes('image/'))
                            return;
                        setImage(files[0]);
                        setImageURL(urlCreator.createObjectURL(files[0]));
                    }}
                />
                {imageURL && <img
                    className='pop-up-image-preview'
                    src={imageURL}
                    alt='Preview'
                />}
            </div>

            <div>
                <button
                    className='preview-editor-button'
                    onClick={() => {
                        props.onSubmit(name, description, image, imageURL)
                    }}
                >
                    {props.name ? 'Изменить' : 'Создать'}
                </button>
            </div>
        </div>
    </PopUp>
}