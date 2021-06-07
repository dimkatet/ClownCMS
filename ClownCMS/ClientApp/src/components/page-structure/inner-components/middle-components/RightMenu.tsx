import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../store';
import * as NavigationStore from '../../../../store/NavigationStore';
import * as BodyStore from '../../../../store/BodyStore';
import SideBarItem from '../../../elements/SidebarItem';
import AddSidebarItem from '../../../elements/AddSidebarItem';
import MenuIcon from '@material-ui/icons/Menu';
import './styles/RightMenu.css';

type RightMenuProps = NavigationStore.NavigatinonState
    & typeof NavigationStore.actionCreators
    & typeof BodyStore.actionCreators;

interface RightMenuState {
    isAuth: boolean,
    showingMenu: boolean,
    isMobile: boolean
}

class RightMenu extends React.Component<RightMenuProps, RightMenuState>{

    constructor(props: RightMenuProps) {
        super(props);

        this.state = {
            isAuth: localStorage.getItem('access_token') ? true : false,
            showingMenu: false,
            isMobile: window.innerWidth > 575 ? false : true
        }

        window.addEventListener('resize', this.updateWidth);
    }

    public componentDidMount() {

    }

    public componentDidUpdate() {
        if (this.props.sections.length > 0 && this.props.menuItem.menuItemType === 3) {
            this.props.sections[0].categories.map((item, index) => {
                if (!this.props.isActual && this.props.currentCategory &&
                    this.props.currentCategory.categoryId && this.props.currentCategory.categoryId === item.categoryId) {
                    this.props.setCurrentCategory(item);
                    this.props.navigatinonUpdated();
                }
            })
        }

        console.log('RIGHT MENU UPDATE');
    }

    private updateWidth = () => {
        if (this.state.isMobile && window.innerWidth > 575) {
            this.setState({ isMobile: false });
        } else if (!this.state.isMobile && window.innerWidth <= 575) {
            this.setState({ isMobile: true });
        }
    }

    private renderItems = () => {
        if (this.props.sections.length < 1)
            return null;
        switch (this.props.menuItem.menuItemType) {
            case 2:
                if (this.props.sections[0].categories.length < 1)
                    return null
                return <div className='right-menu-container'>
                    {this.props.sections[0].categories[0].previews.map(item =>
                        <SideBarItem
                            delete={() => { this.props.deletePreview(item.previewId) }}
                            save={(text: string) => { this.props.setPreview(item.previewId, text, '', '') }}
                            execute={() => {
                                this.props.requestContent(item.previewId);
                                this.props.openPage();
                            }}
                            Name={item.previewName}
                            isAuth={this.state.isAuth}
                            key={item.previewId}
                        />)}
                    {this.state.isAuth && <AddSidebarItem
                        save={(text: string) => {
                            this.props.addPreview(this.props.sections[0].categories[0].categoryId, text, '')
                        }}
                    />}
                </div>
            case 3:
                if (this.props.sections.length < 1)
                    return null;
                return <div className='right-menu-container'>
                    {this.props.sections[0].categories.map(item => {
                        return <SideBarItem
                            delete={() => { this.props.deleteCategory(item.categoryId) }}
                            save={(text: string) => { this.props.setCategory(item.categoryId, text) }}
                            execute={() => {
                                this.props.setCurrentCategory(item);
                                this.props.navigatinonUpdated();
                                this.props.closePage();
                            }}
                            Name={item.categoryName}
                            isAuth={this.state.isAuth}
                            key={item.categoryId}
                        />
                    })}
                    {this.state.isAuth && <AddSidebarItem
                        save={(text: string) => {
                            this.props.addCategory(text, this.props.sections[0].sectionId)
                        }}
                    />}
                </div>
            default: return null;
        }
    }

    render() {
        return <div className='right-menu'>
            {this.state.isMobile && (this.props.menuItem.menuItemType == 2 || this.props.menuItem.menuItemType == 3) &&
                <div
                    className='right-menu-button'
                    onMouseDown={e => {
                        this.setState({ showingMenu: !this.state.showingMenu })
                    }}
                >
                    <MenuIcon />
                </div>}
            {(this.state.showingMenu || !this.state.isMobile) && this.renderItems()}
            </div>
    }
}

export default connect(
    (state: ApplicationState) => state.navigation,
    { ...NavigationStore.actionCreators, ...BodyStore.actionCreators }
)(RightMenu as any);