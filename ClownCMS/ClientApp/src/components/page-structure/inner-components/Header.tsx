import * as React from 'react';
import { connect } from 'react-redux';
import * as ProjectStore from '../../../store/ProjectStore';
import * as NavigationStore from '../../../store/NavigationStore';
import * as BodyStore from '../../../store/BodyStore';
import { ApplicationState } from '../../../store';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/AddCircle';
import MenuIcon from '@material-ui/icons/Menu';
import PopUp from '../../elements/PopUp';
import './styles/Header.css';


type HeaderProps = ProjectStore.ProjectState &
    NavigationStore.NavigatinonState &
    typeof ProjectStore.actionCreators &
    typeof NavigationStore.actionCreators &
    typeof BodyStore.actionCreators;

interface HeaderState {
    isAdding: boolean,
    isAuth: boolean,
    addingText: string,
    addingType: number,
    selectedItemID: number,
    showingMenu: boolean,
    isMobile: boolean
}

class Header extends React.Component<HeaderProps, HeaderState>
{
    constructor(props: HeaderProps) {
        super(props);
        const defaultId = this.props.navMenuItems.length > 0 ? this.props.navMenuItems[0].menuItemId : -1;
        if (defaultId !== -1) {
            console.log(defaultId);
            this.props.setCurrentMenuItem(this.props.navMenuItems[0]);
        }
        this.state = {
            isAdding: false,
            addingText: "",
            addingType: 0,
            selectedItemID: defaultId,
            isAuth: localStorage.getItem('access_token') ? true : false,
            showingMenu: false,
            isMobile: window.innerWidth > 575 ? false : true
        };

        window.addEventListener('resize', this.updateWidth);
    }

    componentDidMount() {
        this.props.requestProjectData();
        this.props.requestMenu();
    }

    private updateWidth = () => {
        if (this.state.isMobile && window.innerWidth > 575) {
            this.setState({ isMobile: false });
        } else if (!this.state.isMobile && window.innerWidth <= 575) {
            this.setState({ isMobile: true });
        }
    }

    private getSave = (id: number) => {
        if (id === -1)
            return (menuItemName: string, menuItemType: number) => { this.props.addMenuItem(menuItemName, menuItemType); this.Close(); this.props.navigatinonClear(); }
        return (menuItemName: string, menuItemType: number) => { this.props.setMenuItem(id, menuItemName, menuItemType); this.Close(); this.props.navigatinonClear(); }
    }

    private getDelete = (id: number) => {
        if (id === -1)
            return this.Close;
        return () => { this.props.deleteMenuItem(id); this.Close(); this.props.navigatinonClear(); }
    }

    private Close = () => this.setState({ isAdding: false, addingText: "", addingType: 3, selectedItemID: -1 })


    public render() {
        return (
            <div className='wrapper_Header'>
                <div
                    className='header-item-logo'
                    onMouseDown={e => {
                        if (this.props.navMenuItems.length > 0) {
                            this.props.setCurrentMenuItem(this.props.navMenuItems[0]);
                        }
                        this.props.resetNavigation();
                        this.props.resetBody();
                    }}
                >
                    {this.props.projectData.projectName}
                </div>
                {this.state.isMobile && <div
                    className='header-button'
                    onMouseDown={e => {
                        this.setState({ showingMenu: !this.state.showingMenu })
                    }}
                >
                    <MenuIcon fontSize='inherit' />
                </div>}
                <div className='header-nav-items'>
                    {(this.state.showingMenu || !this.state.isMobile) && this.props.navMenuItems.map((item, index) => <MenuItem
                        menuItemId={item.menuItemId}
                        menuItemName={item.menuItemName}
                        menuItemType={item.menuItemType}
                        execute={() => this.props.setCurrentMenuItem(item)}
                        edit={(text: string, type: number, id: number) => this.setState({
                            isAdding: true,
                            addingText: text,
                            addingType: type,
                            selectedItemID: id
                        })}
                        isAuth={this.state.isAuth}
                        key={index}
                    />)}
                </div>
                {this.state.isAuth && < div className='header-item-add'
                    onClick={() => this.setState({
                        isAdding: true,
                        addingText: "",
                        addingType: 3,
                        selectedItemID: -1
                    })}
                >
                    <AddIcon fontSize='large' />
                </div>}

                {this.state.isAdding && <MenuItemEditor
                    onClose={() => { this.setState({ isAdding: false }) }}
                    addingType={this.state.addingType}
                    addingText={this.state.addingText}
                    onSubmit={(text: string, type: number) => { this.getSave(this.state.selectedItemID)(text, type); }}
                    onDelete={() => this.getDelete(this.state.selectedItemID)() }
                />}

            </div>
        )
    }
}

const MenuItem = (props: {
    menuItemName: string,
    menuItemType: number,
    menuItemId: number,
    execute(): void,
    edit(text: string, type: number, id: number): void,
    isAuth: boolean
}) => {
    const [isOver, setIsOver] = React.useState(false);
    return (
        <div
            className='header-item'
            onMouseOver={() => { setIsOver(true); }}
            onMouseLeave={() => { setIsOver(false); }}
        >
            <div
                className='header-item-content'
                onClick={props.execute}
            >
                {props.menuItemName}
            </div>
            {isOver && props.isAuth && < div
                className='header-item-change'
                onClick={() => props.edit(props.menuItemName, props.menuItemType, props.menuItemId)}
            >
                <SettingsIcon fontSize='inherit' />
            </div>}
        </div >
    )
}

const MenuItemEditor = (props: {
    onClose(): void,
    addingType: number,
    addingText: string,
    onSubmit(text: string, type: number ): void,
    onDelete(): void
}) => {
    const [text, setText] = React.useState(props.addingText);
    const [type, setType] = React.useState(props.addingType);
    return <PopUp onClose={props.onClose}>
        <div className='pop-up-content'>
            <div>Введите тип элемента</div>
            <div>
                <select value={type} onChange={(event) => { setType(Number(event.target.value)); }}>
                    <option value="0">form0</option>
                    <option value="1">form1</option>
                    <option value="2">form2</option>
                    <option value="3">form3</option>
                    <option value="4">form4</option>
                    <option value="5">form5</option>
                </select>
            </div>
            <div>Введите название элемента</div>
            <div>
                <input
                    value={text}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            props.onSubmit(text, type);
                        }
                    }}
                    onChange={(e) => {
                        setText(e.target.value);
                    }} />
            </div>
            <div className='wrapper_button'>
                <button
                    className='nav-item-create-buttons'
                    onClick={() => {
                        props.onDelete();
                    }}
                >
                    Удалить
                </button>
                <button
                    className='nav-item-create-buttons'
                    onClick={() => {
                        props.onSubmit(text, type);
                    }}>
                    Сохранить
                </button>
            </div>
        </div>

    </PopUp>
}

export default connect(
    (state: ApplicationState) => ({ ...state.project, ...state.navigation }),
    { ...ProjectStore.actionCreators, ...NavigationStore.actionCreators, ...BodyStore.actionCreators }
)(Header as any);
