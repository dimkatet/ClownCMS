import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../store';
import * as NavigationStore from '../../../store/NavigationStore';
import * as BodyStore from '../../../store/BodyStore';
import Body from './middle-components/Body';
import PopUp from '../../PopUp';
import './styles/Middle.css';


type Props =
    NavigationStore.NavigatinonState
    & typeof NavigationStore.actionCreators & typeof BodyStore.actionCreators;


type State = {
    CurrentCategory: NavigationStore.Category,
    SelectedID: number,
    isAddingPreview: boolean,
    newPreviewName: string,
    newPreviewDescription: string,
    newImage?: File
}

/*
 * Content part
 * setting dimensions for components
 */
class Middle extends React.PureComponent<Props, State>
{

    constructor(props: any) {
        super(props);
        this.state = { CurrentCategory: {} as NavigationStore.Category, SelectedID: -1, isAddingPreview: false, newPreviewName: '', newPreviewDescription: '', newImage: undefined }
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
                                        execute={() => { this.setState({ CurrentCategory: item, SelectedID: item.categoryId }); this.props.navigatinonUpdated(); }}
                                        Name={item.categoryName}>
                                        {<div className='left_iner'>{
                                            (this.state.SelectedID == item.categoryId) && (item.previews.length > 0) && item.previews.map(prev =>
                                                <NavItem
                                                    delete={() => { this.props.deletePreview(prev.previewId) }}
                                                    save={(text: string) => { this.props.setPreview(prev.previewId, text) }}
                                                    execute={() => { this.props.requestContent(prev.previewId); this.props.openPage(); }}
                                                    Name={prev.previewName} />)
                                        }{this.state.SelectedID == item.categoryId && <AddItem save={(text: string) => {/* this.props.addPreview(text, item.categoryId)*/}} />}</div>}
                                    </NavItem>)}
                                <AddItem save={(text: string) => { this.props.addCategory(text, this.props.sections[0].sectionId) }} />
                            </div>;
                    return null;
                case 5: return <div>
                    {this.props.sections.map(item =>
                        <NavItem
                            delete={() => { this.props.deleteSection(item.sectionId) }}
                            save={(text: string) => { this.props.setSection(item.sectionId, text) }}
                            execute={() => this.setState({ SelectedID: item.sectionId })}
                            Name={item.sectionName}>
                                {<div className='left_iner'>{
                                    (this.state.SelectedID == item.sectionId) && (item.categories.length > 0) && item.categories.map(categor =>
                                        <NavItem
                                            delete={() => { this.props.deleteCategory(categor.categoryId) }}
                                            save={(text: string) => { this.props.setCategory(categor.categoryId, text) }}
                                            execute={() => { this.setState({ CurrentCategory: categor }); this.props.navigatinonUpdated(); this.props.closePage();}}
                                            Name={categor.categoryName} />)
                            }{this.state.SelectedID == item.sectionId && <AddItem save={(text: string) => { this.props.addCategory(text, item.sectionId) }} />}</div>}
                        </NavItem>)}
                    <AddItem save={(text: string) => { console.log(text); this.props.addSection(text)}} />
                    </div>;
                default: return null;
            }
        return null;
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
                                    save={(text: string) => { this.props.setPreview(item.previewId, text) }}
                                    execute={() => { { this.props.requestContent(item.previewId); this.props.openPage(); }}}
                                    Name={item.previewName} />)}
                           {/*<AddItem save={(text: string) => { this.props.addPreview(text, this.props.sections[0].categories[0].categoryId) }} />*/}
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
            return <div>
                {this.state.CurrentCategory.previews.map(item => <BodyPreview
                    execute={
                        () => {
                            this.props.requestContent(item.previewId);
                            this.props.openPage();
                        }}
                    imageURL={item.imageURL}
                    previewDescription={item.previewDescription}
                    previewName={item.previewName} />
                )}
                {
                    //change AddItem to new editor
                }
                {/* <AddItem save={(text: string) => { this.props.addPreview(text, this.state.CurrentCategory.categoryId) }} /> */}
                <button
                    onMouseDown={e => {
                        this.setState({ isAddingPreview: true });
                    }}
                >Add</button>
            </div>;
        }
        return null;
    }
    private prepare = () => {
        switch (this.props.menuItem.menuItemType) {
            case 1: if (this.props.sections.length > 0 && this.props.sections[0].categories.length > 0) { this.setState({ CurrentCategory: this.props.sections[0].categories[0] }); this.props.navigatinonUpdated(); console.log("1"); } break;
            case 0: if (this.props.sections.length > 0 && this.props.sections[0].categories.length > 0 && this.props.sections[0].categories[0].previews.length > 0) {this.props.requestContent(this.props.sections[0].categories[0].previews[0].previewId); this.props.openPage(); } break;
            default: return null;
        }
    }
    public render() {
        this.prepare();
        return (
            <React.Fragment>
                <div className='wrapper_Middle'>
                    <div onMouseLeave={() => { this.setState({ SelectedID: -1 }) }}>
                        <this.renderLeftMenu />
                    </div>
                    <div>
                        {this.props.isShowContent && <Body />}
                        {this.props.isActual && !this.props.isShowContent && <this.renderBodyPreview />}
                        {this.state.isAddingPreview ?
                            <PopUp onClose={() => this.setState({ isAddingPreview: false, newPreviewName: '', newPreviewDescription: '' })}>
                                <div className='popUpContent'>
                                    <div>Название темы:</div>
                                    <div><input
                                        value={this.state.newPreviewName}
                                        onChange={(e) => {
                                            this.setState({ newPreviewName: e.target.value })
                                        }} />
                                    </div>

                                    <div>Описание:</div>
                                    <div><input
                                        value={this.state.newPreviewDescription}
                                        onChange={(e) => {
                                            this.setState({ newPreviewDescription: e.target.value })
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
                                                const image = files[0];
                                                this.setState({ newImage: image });
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => {
                                                this.props.addPreview(this.state.CurrentCategory.categoryId, this.state.newPreviewName, this.state.newPreviewDescription, this.state.newImage);
                                                this.setState({ isAddingPreview: false, newPreviewName: '', newPreviewDescription: '', newImage: undefined });
                                            }}>
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </PopUp>
                            : null
                        }
                    </div>
                    <div>
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
        <div onMouseOver={() => setOver(true)} onMouseLeave={() => setOver(false)}>
            {!isEdit && <div>
                <button onClick={props.execute}>
                    {text}
                </button>
                {isOver && <button onClick={() => { setEdit(true); setOver(false);}} />}
            </div>}
            {isEdit &&
                <div>
                <input
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }} />
                <button onClick={() => { setEdit(false); if (text != props.Name) props.save(text); setText(props.Name); }}>ok</button>
                <button onClick={() => { setEdit(false); props.delete(); }}>del</button>
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
            {!isEdit &&
                <button onClick={()=>setEdit(true)}>
                    add
                </button>}
            {isEdit &&
                <div>
                    <input
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value)
                    }} />
                <button onClick={() => { setEdit(false); props.save(text); setText(''); }}>ok</button>
                    <button onClick={() => { setEdit(false); setText('');}}>close</button>
                </div>}
        </div>
    )
}

function BodyPreview(props: {
    previewName: string,
    previewDescription: string,
    imageURL?: string,
    execute: () => void
}) {
    return (
        <div className='preview' onClick={props.execute}>
            <h3>
                {props.previewName}
            </h3>
            <p>{props.previewDescription}</p>
            {props.imageURL ? <img src={props.imageURL} /> : null}

        </div>
    )
}

export default connect(
    (state: ApplicationState) => state.navigation, // Selects which state properties are merged into the component's props
    { ...NavigationStore.actionCreators, ...BodyStore.actionCreators } // Selects which action creators are merged into the component's props
)(Middle as any);