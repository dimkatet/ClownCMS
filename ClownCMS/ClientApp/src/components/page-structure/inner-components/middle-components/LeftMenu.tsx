import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../store';
import * as NavigationStore from '../../../../store/NavigationStore';
import * as BodyStore from '../../../../store/BodyStore';
import SideBarItem from '../../../elements/SidebarItem';
import AddSidebarItem from '../../../elements/AddSidebarItem';
import MenuIcon from '@material-ui/icons/Menu';
import './styles/LeftMenu.css';

type LeftMenuProps = NavigationStore.NavigatinonState
    & typeof NavigationStore.actionCreators
    & typeof BodyStore.actionCreators;

interface LeftMenuState {
    isAuth: boolean,
    SelectedID: number,
    showingMenu: boolean,
    windowWidth: number
}

class LeftMenu extends React.Component<LeftMenuProps, LeftMenuState>{

    constructor(props: LeftMenuProps) {
        super(props);

        this.state = {
            isAuth: localStorage.getItem('access_token') ? true : false,
            SelectedID: -1,
            showingMenu: false,
            windowWidth: window.innerWidth
        }

        window.addEventListener('resize', this.updateWidth);
    }

    public componentDidMount() {

    }

    private updateWidth = () => {
        this.setState({ windowWidth: window.innerWidth });
    }

    public componentDidUpdate() {
        if (this.props.menuItem.menuItemType === 5) {
            this.props.sections.map((item, index) => {
                item.categories.map(category => {
                    if (!this.props.isActual && this.props.currentCategory &&
                        this.props.currentCategory.categoryId && this.props.currentCategory.categoryId === category.categoryId) {
                        this.props.setCurrentCategory(category);
                        this.props.navigatinonUpdated();
                    }
                })
            });
        }
    }

    private renderItems = () => {
        switch (this.props.menuItem.menuItemType) {
            case 4:
                if (this.props.sections.length > 0)
                    return <div className='left-menu-container'>
                        {this.props.sections[0].categories.map((item, index) =>
                            <SideBarItem
                                delete={() => { this.props.deleteCategory(item.categoryId) }}
                                save={(text: string) => { this.props.setCategory(item.categoryId, text) }}
                                execute={() => {
                                    this.setState({ SelectedID: item.categoryId });
                                    this.props.setCurrentCategory(item);
                                    this.props.navigatinonUpdated();
                                }}
                                Name={item.categoryName}
                                isAuth={this.state.isAuth}
                                key={item.categoryId}
                            >
                                {<div className='left-menu-previews'>
                                    {(this.state.SelectedID === item.categoryId) && (item.previews.length > 0) && item.previews.map((prev, index) =>
                                        <SideBarItem
                                            delete={() => { this.props.deletePreview(prev.previewId) }}
                                            save={(text: string) => { this.props.setPreview(prev.previewId, text, '', '') }}
                                            execute={() => {
                                                this.props.requestContent(prev.previewId);
                                                this.props.openPage();
                                            }}
                                            Name={prev.previewName}
                                            isAuth={this.state.isAuth}
                                            key={prev.categoryId}
                                        />)}
                                    {this.state.SelectedID === item.categoryId && this.state.isAuth && <AddSidebarItem
                                        save={(text: string) => {
                                            this.props.addPreview(item.categoryId, text, '')
                                        }}
                                    />}
                                </div>}
                            </SideBarItem>)}
                        {this.state.isAuth && <AddSidebarItem
                            save={(text: string) => {
                                this.props.addCategory(text, this.props.sections[0].sectionId)
                            }}
                        />}
                    </div>;
                return null;
            case 5: return <div className='left-menu-container'>
                {this.props.sections.map((item, index) =>
                    <SideBarItem
                        delete={() => { this.props.deleteSection(item.sectionId) }}
                        save={(text: string) => { this.props.setSection(item.sectionId, text) }}
                        execute={() => {
                            if (this.state.SelectedID === item.sectionId)
                                this.setState({ SelectedID: -1 })
                            else this.setState({ SelectedID: item.sectionId })
                        }}
                        Name={item.sectionName}
                        isAuth={this.state.isAuth}
                        key={item.sectionId}
                    >
                        {<div className='left-menu-previews'>
                            {(this.state.SelectedID === item.sectionId) && (item.categories.length > 0) && item.categories.map((category, index) =>
                                <SideBarItem
                                    delete={() => { this.props.deleteCategory(category.categoryId) }}
                                    save={(text: string) => { this.props.setCategory(category.categoryId, text) }}
                                    execute={() => {
                                        this.props.setCurrentCategory(category);
                                        this.props.navigatinonUpdated();
                                        this.props.closePage();
                                    }}
                                    Name={category.categoryName}
                                    isAuth={this.state.isAuth}
                                    key={category.categoryId}
                                />
                            )}
                            {this.state.SelectedID === item.sectionId && this.state.isAuth && <AddSidebarItem
                                save={(text: string) => {
                                    this.props.addCategory(text, item.sectionId)
                                }}
                            />}
                        </div>}
                    </SideBarItem>)}
                {this.state.isAuth && <AddSidebarItem
                    save={(text: string) => {
                        this.props.addSection(text)
                    }}
                />}
            </div>

            default: return null;
        }
    }

    render() {
        return <div className='left-menu'>
            {this.state.windowWidth <= 575 && (this.props.menuItem.menuItemType == 4 || this.props.menuItem.menuItemType == 5) &&
                <div
                className='left-menu-button'
                onMouseDown={e => {
                    this.setState({ showingMenu: !this.state.showingMenu })
                }}
            >
                <MenuIcon />
            </div>}
            {(this.state.showingMenu || this.state.windowWidth > 575) && this.renderItems()}
        </div>
    }
}

export default connect(
    (state: ApplicationState) => state.navigation,
    { ...NavigationStore.actionCreators, ...BodyStore.actionCreators }
)(LeftMenu as any);