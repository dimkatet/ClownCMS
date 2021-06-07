import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { EditorState, ContentState } from 'draft-js';
import { ApplicationState } from '../../../../store';
import * as BodyStore from '../../../../store/BodyStore';
import * as NavigationStore from '../../../../store/NavigationStore';
import TextEditor from '../../../elements/TextEditor';
import SliderBlock from '../../../elements/SliderBlock';
import convertToHTML from '../../../elements/utils/HTMLConverter';
import PreviewEditor from '../../../elements/PreviewEditor';
import ContentPreview from '../../../elements/ContentPreview';
import IconSave from '@material-ui/icons/Save';
import IconEdit from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import './styles/Body.css';
import '../../../elements/styles/SliderBlock.css';

type BodyProps = BodyStore.BodyState &
    NavigationStore.NavigatinonState &
    typeof BodyStore.actionCreators &
    typeof NavigationStore.actionCreators;

interface BodyState {
    contentState: ContentState,
    isEditing: boolean,
    isAuth: boolean,
    isAddingPreview: boolean,
    currentPreviewId: number
}

class Body extends React.PureComponent<BodyProps, BodyState>
{
    constructor(props: BodyProps) {
        super(props);
        this.state = {
            contentState: EditorState.createEmpty().getCurrentContent(),
            isEditing: false,
            isAuth: localStorage.getItem('access_token') ? true : false,
            isAddingPreview: false,
            currentPreviewId: -1
        };
        this.updateContent = this.updateContent.bind(this);
        this.insertContent = this.insertContent.bind(this);
    }

    public componentDidMount() {
    }

    public componentDidUpdate() {

        if (!this.state.isEditing) {
            this.insertContent();
        }
    }

    updateContent(content: ContentState) {
        this.props.updateContent(content);
    }

    insertContent() {
        const content = document.getElementById('body-content-id');
        if (!content)
            return;

        content.innerHTML = convertToHTML(this.props.content);
        const sliders = content.querySelectorAll('.js-slider');
        sliders.forEach((slider, index) => {
            const data = slider.getAttribute('data-slides');
            if (data === null)
                return;
            ReactDOM.render<{}>(
                <SliderBlock
                    slides={JSON.parse(data.replace(/'/g, '"'))}
                />, slider);
        });
    }

    private renderContent = () => {
        return <div className='body-container'>
            {this.state.isAuth && <div>
                <div
                    className='edit-button'
                    onMouseDown={(e) => {
                        if (this.state.isEditing) {
                            this.props.saveContent(this.props.content);
                        } else {
                            const content = document.getElementById('body-content-id');
                            if (content)
                                content.innerHTML = '';
                        }
                        this.setState({ isEditing: !this.state.isEditing })
                    }}
                >
                    {this.state.isEditing ? <IconSave /> : <IconEdit />}
                </div>
                <div className='body-content'>
                    {this.state.isEditing &&
                        <TextEditor
                            contentState={this.props.content}
                            updateContent={this.updateContent}
                        />}
                </div>
            </div>
            }
            <div className='body-content' id='body-content-id' />
        </div>

    }

    private renderContentPreviews = () => {
        if (this.props.menuItem.menuItemType === 1 || this.props.menuItem.menuItemType === 3 || this.props.menuItem.menuItemType === 5) {
            return <React.Fragment>
                <div className='body-previews'>
                    {this.props.currentCategory.previews.map((item, index) => {
                        const edit = (setState: Function) => (name: string, description: string, image?: File, imageURL?: string) => {
                            this.props.setPreview(item.previewId, name, description, imageURL ? imageURL : '', image);
                            setState(false);
                        }

                        return <ContentPreview
                            link={`/index/${this.props.menuItem.menuItemId}/${this.props.currentCategory.sectionId}/${this.props.currentCategory.categoryId}/${item.previewId}`}
                            execute={() => {
                                /*this.props.addSnapshot();*/
                                this.props.requestContent(item.previewId);
                                this.props.openPage();
                            }}
                            edit={edit}
                            delete={() => {
                                this.props.deletePreview(item.previewId);
                            }}
                            imageURL={item.imageURL}
                            previewDescription={item.previewDescription}
                            previewName={item.previewName}
                            isAuth={this.state.isAuth}
                            key={item.previewId}
                        />
                    })}
                    {this.state.isAuth && <div
                        className='body-preview-add'
                        onMouseDown={e => {
                            this.setState({ isAddingPreview: true });
                        }}
                    >
                        <AddIcon />
                    </div>}
                    {this.state.isAddingPreview ?
                        <PreviewEditor
                            onClose={() => this.setState({
                                isAddingPreview: false
                            })}
                            onSubmit={(name: string, description: string, image?: File, imageURL?: string) => {
                                this.props.addPreview(this.props.currentCategory.categoryId, name, description, image);
                                this.setState({ isAddingPreview: false });
                            }}
                        />
                        : null
                    }
                </div>
            </React.Fragment>
        }
        return null;
    }

    public render() {
        return <div className='body'>
            {this.props.isShowContent && this.renderContent()}
            {this.props.isActual && !this.props.isShowContent && this.renderContentPreviews()}
        </div>
    }

}


export default connect(
    (state: ApplicationState) => ({ ...state.body, ...state.navigation }),
    { ...BodyStore.actionCreators, ...NavigationStore.actionCreators }
)(Body as any);