import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../store';
import * as NavigationStore from '../../../store/NavigationStore';
import * as BodyStore from '../../../store/BodyStore';
import Body from './middle-components/Body';
import PopUp from '../../PopUp';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import './styles/Middle.css';


type Props =
    NavigationStore.NavigatinonState
    & typeof NavigationStore.actionCreators & typeof BodyStore.actionCreators;


type State = {
    CurrentCategory: NavigationStore.Category,
    SelectedID: number,
    isAddingPreview: boolean
}

/*
 * Content part
 * setting dimensions for components
 */
class Middle extends React.PureComponent<Props, State>
{

    constructor(props: any) {
        super(props);
        this.state = { CurrentCategory: {} as NavigationStore.Category, SelectedID: -1, isAddingPreview: false }
    }

    public componentDidMount() {
        //
    }

    public componentDidUpdate() {
        //
    }

    private renderLeftMenu = () => {
            switch (this.props.menuItem.menuItemType) {
                case 4:
                    if (this.props.sections.length > 0)
                            return <div>
                                {this.props.sections[0].categories.map(item =>
                                    <NavItem
                                        delete={() => { this.props.deleteCategory(item.categoryId) }}
                                        save={(text: string) => { this.props.setCategory(item.categoryId, text) }}
                                        execute={() => {
                                            this.setState({ CurrentCategory: item, SelectedID: item.categoryId });
                                            this.props.navigatinonUpdated();
                                        }}
                                        Name={item.categoryName}>
                                        {<div className='left-menu-previews'>
                                            {(this.state.SelectedID == item.categoryId) && (item.previews.length > 0) && item.previews.map(prev =>
                                                <NavItem
                                                    delete={() => { this.props.deletePreview(prev.previewId) }}
                                                    save={(text: string) => { this.props.setPreview(prev.previewId, text, '', '') }}
                                                    execute={() => { this.props.requestContent(prev.previewId); this.props.openPage(); }}
                                                    Name={prev.previewName}
                                                />)}
                                            {this.state.SelectedID == item.categoryId && <AddItem save={(text: string) => { this.props.addPreview(item.categoryId, text, '') }} />}</div>}
                                    </NavItem>)}
                                <AddItem save={(text: string) => { this.props.addCategory(text, this.props.sections[0].sectionId) }} />
                            </div>;
                    return null;
                case 5: return <div>
                    {this.props.sections.map(item =>
                        <NavItem
                            delete={() => { this.props.deleteSection(item.sectionId) }}
                            save={(text: string) => { this.props.setSection(item.sectionId, text) }}
                            execute={() => {
                                if (this.state.SelectedID === item.sectionId)
                                    this.setState({ SelectedID: -1 })
                                else this.setState({ SelectedID: item.sectionId })
                            }}
                            Name={item.sectionName}>
                            {<div className='left-menu-previews'>
                                {(this.state.SelectedID == item.sectionId) && (item.categories.length > 0) && item.categories.map(category =>
                                    <NavItem
                                        delete={() => { this.props.deleteCategory(category.categoryId) }}
                                        save={(text: string) => { this.props.setCategory(category.categoryId, text) }}
                                        execute={() => {
                                            this.setState({ CurrentCategory: category });
                                            this.props.navigatinonUpdated();
                                            this.props.closePage();
                                        }}
                                        Name={category.categoryName}
                                    />
                                )}
                                {this.state.SelectedID == item.sectionId && <AddItem save={(text: string) => { this.props.addCategory(text, item.sectionId) }} />}
                            </div>}
                        </NavItem>)}
                    <AddItem save={(text: string) => { this.props.addSection(text)}} />
                    </div>;
                default: return null;
            }
    }
    private renderRightMenu = () => {
        if (this.props.sections.length > 0)
            switch (this.props.menuItem.menuItemType) {
                case 2:
                    if (this.props.sections[0].categories.length > 0)
                       return <div>
                            {this.props.sections[0].categories[0].previews.map(item =>
                                <NavItem
                                    delete={() => { this.props.deletePreview(item.previewId) }}
                                    save={(text: string) => { this.props.setPreview(item.previewId, text, '', '') }}
                                    execute={() => { { this.props.requestContent(item.previewId); this.props.openPage(); }}}
                                    Name={item.previewName} />)}
                           {<AddItem save={(text: string) => { this.props.addPreview(this.props.sections[0].categories[0].categoryId, text, '') }} />}
                        </div>;
                    return null;
                case 3: return <div>
                    {this.props.sections[0].categories.map(item =>
                        <NavItem
                            delete={() => { this.props.deleteCategory(item.categoryId) }}
                            save={(text: string) => { this.props.setCategory(item.categoryId, text) }}
                            execute={() => { this.setState({ CurrentCategory: item }); this.props.navigatinonUpdated(); this.props.closePage(); }}
                            Name={item.categoryName} />)}
                    <AddItem save={(text: string) => { this.props.addCategory(text, this.props.sections[0].sectionId) }} />
                </div>;
                default: return null;
            }
        return null;
    }
    private renderBodyPreview = () => {
        if (this.props.menuItem.menuItemType == 1 || this.props.menuItem.menuItemType == 3 || this.props.menuItem.menuItemType == 5) {
           
            return <React.Fragment>
                <div className='body-previews'>
                    {this.state.CurrentCategory.previews.map(item => {
                        const edit = (setState: Function) => (name: string, description: string, image?: File, imageURL?: string) => {
                            this.props.setPreview(item.previewId, name, description, imageURL ? imageURL : '', image);
                            setState(false);
                        }

                        return <BodyPreview
                            execute={() => {
                                this.props.requestContent(item.previewId);
                                this.props.openPage();
                            }}
                            edit={edit}
                            delete={() => {
                                this.props.deletePreview(item.previewId);
                            }}
                            imageURL={item.imageURL}
                            previewDescription={item.previewDescription}
                            previewName={item.previewName} />
                    })}
                </div>
                <div
                    className='body-preview-add'
                    onMouseDown={e => {
                        this.setState({ isAddingPreview: true });
                    }}
                >
                    <AddIcon />
                </div>
            </React.Fragment>
        }
        return null;
    }
    private prepare = () => {
        switch (this.props.menuItem.menuItemType) {
            case 1:
                if (this.props.sections.length > 0 && this.props.sections[0].categories.length > 0) {
                    this.setState({
                        CurrentCategory: this.props.sections[0].categories[0]
                    });
                    this.props.navigatinonUpdated();
                }
                break;
            case 0:
                if (this.props.sections.length > 0 && this.props.sections[0].categories.length > 0 && this.props.sections[0].categories[0].previews.length > 0) {
                    this.props.requestContent(this.props.sections[0].categories[0].previews[0].previewId);
                    this.props.openPage();
                }
                break;
            default: return null;
        }
    }
    public render() {
        this.prepare();
        return (
            <React.Fragment>
                <div className='wrapper_Middle'>
                    <div
                        className='left-menu'
                        onMouseLeave={() => {
                    }}>
                        <this.renderLeftMenu />
                    </div>
                    <div className='body'>
                        {this.props.isShowContent && <Body />}
                        {this.props.isActual && !this.props.isShowContent && <this.renderBodyPreview />}
                        {this.state.isAddingPreview ?
                            <PreviewEditor
                                onClose={() => this.setState({
                                    isAddingPreview: false
                                })}
                                onSubmit={(name: string, description: string, image?: File, imageURL?: string) => {
                                    this.props.addPreview(this.state.CurrentCategory.categoryId, name, description, image);
                                    this.setState({ isAddingPreview: false });
                                }}
                            />
                            : null
                        }
                    </div>
                    <div className='right-menu'>
                        <this.renderRightMenu />
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

function NavItem(props: any){
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
                <div className='left-menu-section'
                    onClick={props.execute}
                >
                    <div className='left-menu-section-content'>
                        {text}
                    </div>
                    {isOver && <SettingsIcon
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
                            if (text != props.Name)
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

function AddItem(props: any) {
    const [text, setText] = React.useState('');
    const [isEdit, setEdit] = React.useState(false);
    return (
        <div>
            {!isEdit && <div className='left-menu-add' onClick={() => setEdit(true)}>
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

function BodyPreview(props: {
    previewName: string,
    previewDescription: string,
    imageURL?: string,
    execute: () => void,
    edit: (setState: Function) => (name: string, description: string, image?: File, imageURL?: string) => void,
    delete: () => void
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
            <div
                className='preview-container'
                onClick={props.execute}
            >
                <div className='preview-header'>
                    <h3>
                        {props.previewName}
                    </h3>
                </div>
                <div className='preview-description'>
                    <div>{props.previewDescription}</div>
                </div>
                {props.imageURL ?
                    <div className='preview-image-container'>
                        <img className='preview-image' src={props.imageURL} />
                    </div>
                    : null
                }
            </div>
            {onOver && <div className='preview-buttons'>
                <div
                    className='preview-settings'
                    onClick={(e) => {
                        setIsEdit(true);
                    }}
                >
                    <SettingsIcon fontSize='inherit'/>
                </div>
                <div
                    className='preview-delete'
                    onClick={props.delete}
                >
                    <DeleteIcon fontSize='inherit'/>
                </div>
            </div>}
            {isEdit && <PreviewEditor
                onClose={() => setIsEdit(false)}
                onSubmit={props.edit(setIsEdit)}
                name={props.previewName}
                description={props.previewDescription}
                imageURL={props.imageURL}
            />}
        </div>
    )
}

function PreviewEditor(props: {
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
                {imageURL && <img className='pop-up-image-preview' src={imageURL} />}
            </div>

            <div>
                <button
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

export default connect(
    (state: ApplicationState) => state.navigation, // Selects which state properties are merged into the component's props
    { ...NavigationStore.actionCreators, ...BodyStore.actionCreators } // Selects which action creators are merged into the component's props
)(Middle as any);