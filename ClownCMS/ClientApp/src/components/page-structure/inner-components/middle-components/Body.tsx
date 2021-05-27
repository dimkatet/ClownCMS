﻿import * as React from 'react';
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
import BodyPreview from '../../../elements/BodyPreview';
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
    isAddingPreview: boolean
}

class Body extends React.PureComponent<BodyProps, BodyState>
{
    constructor(props: BodyProps) {
        super(props);
        this.state = {
            contentState: EditorState.createEmpty().getCurrentContent(),
            isEditing: false,
            isAuth: localStorage.getItem('access_token') ? true : false,
            isAddingPreview: false
        };
        this.updateContent = this.updateContent.bind(this);
        this.insertContent = this.insertContent.bind(this);
    }

    public componentDidMount() {
    }

    public componentDidUpdate() {
        if (!this.state.isEditing)
            this.insertContent();

        switch (this.props.menuItem.menuItemType) {
            case 1:
                if (this.props.sections.length > 0 && this.props.sections[0].categories.length > 0) {
                    this.props.setCurrentCategory(this.props.sections[0].categories[0]);
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

    private renderContnet = () => {
        return <div className='body-container'>
            {this.state.isAuth && <div>
                <div
                    className='edit-button'
                    onMouseDown={(e) => {
                        if (this.state.isEditing) {
                            this.props.saveContent(this.props.content);
                            //this.insertContent();
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
            {this.props.isShowContent && this.renderContnet()}
            {this.props.isActual && !this.props.isShowContent && this.renderContentPreviews()}
        </div>
    }

}


export default connect(
    (state: ApplicationState) => ({ ...state.body, ...state.navigation }),
    { ...BodyStore.actionCreators, ...NavigationStore.actionCreators }
)(Body as any);