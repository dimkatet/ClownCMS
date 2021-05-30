import * as React from 'react';
import { connect } from 'react-redux';
import * as ProjectStore from '../../store/ProjectStore';
import * as NavigationStore from '../../store/NavigationStore';
import { ApplicationState } from '../../store';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/AddCircle';
import MenuIcon from '@material-ui/icons/Menu';
import PopUp from './PopUp';
import './styles/NavMenuEditor.css';


type Props = ProjectStore.ProjectState & typeof ProjectStore.actionCreators & typeof NavigationStore.actionCreators;

interface State {
    isAdding: boolean,
    isAuth: boolean,
    addingText: string,
    addingType: number,
    selectedItemID: number,
    showAddMenuItem: boolean,
    showingMenu: boolean,
    windowWidth: number
    
}

class NavMenuEditor extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.props.requestMenu()
        this.state = {
            isAdding: false,
            addingText: "",
            addingType: 0,
            selectedItemID: -1,
            showAddMenuItem: false,
            isAuth: localStorage.getItem('access_token') ? true : false,
            showingMenu: false,
            windowWidth: window.innerWidth
        };

        window.addEventListener('resize', this.updateWidth);
    }

    private updateWidth = () => {
        this.setState({ windowWidth: window.innerWidth });
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

    private MenuItem = (props: any) => {
        return (
            <div
                className='header-item'
                onMouseOver={props.actionChange}
            >
                <div
                    className='header-item-content'
                    onClick={props.execute}
                >
                    {props.menuItemName}
                </div>
                { props.children}
            </div >
        )
    }

    public render() {
        return (
            <div className='wrapper_Header'
                onMouseLeave={() => this.setState({
                    addingText: '',
                    addingType: 3,
                    selectedItemID: -1,
                    showAddMenuItem: false
                })}
                onMouseOver={() => {
                    this.setState({ showAddMenuItem: true });
                }}
            >
                <div className='header-item-logo'>
                    SiteName
                </div>
                {this.state.windowWidth <= 575 && <div
                        className='header-button'
                        onMouseDown={e => {
                            this.setState({ showingMenu: !this.state.showingMenu })
                        }}
                >
                    <MenuIcon fontSize='inherit' />
                </div>}
                <div className='header-nav-items'>
                {(this.state.showingMenu || this.state.windowWidth > 575) && this.props.navMenuItems.map((item, index) =>
                    <this.MenuItem
                        menuItemName={item.menuItemName}
                        execute={() => this.props.setCurrentMenuItem(item)}
                        actionClear={() => {
                            this.setState({ selectedItemID: -1, addingType: 3, addingText: "" });
                        }}
                        actionChange={() => {
                            this.setState({
                                selectedItemID: item.menuItemId,
                                addingType: item.menuItemType,
                                addingText: item.menuItemName
                            });
                        }}
                        key={index}
                    >
                        {this.state.selectedItemID === item.menuItemId && this.state.isAuth && < div
                            className='header-item-change'
                            onClick={() => {
                                this.setState({ isAdding: true });
                            }}
                        >
                            <SettingsIcon fontSize='inherit' />
                        </div>}
                    </this.MenuItem>)
                    }
                    </div>
                {this.state.isAuth && < div className='header-item-add'
                    onClick={() => this.setState({
                        isAdding: true,
                        addingText: "",
                        addingType: 3,
                        selectedItemID: -1,
                        showAddMenuItem: false
                    })}
                >
                    <AddIcon fontSize='large' />
                </div>}

                {this.state.isAdding && <PopUp onClose={this.Close}>
                    <div className='pop-up-content'>
                            <div>Введите тип элемента</div>
                            <div>
                                <select value={this.state.addingType} onChange={(event) => { this.setState({ addingType: Number(event.target.value) }); }}>
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
                                    value={this.state.addingText}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            this.getSave(this.state.selectedItemID)(this.state.addingText, this.state.addingType);
                                        }
                                    }}
                                    onChange={(e) => {
                                        this.setState({ addingText: e.target.value })
                                    }} />
                            </div>
                            <div className='wrapper_button'>
                                <button onClick={() => { this.getDelete(this.state.selectedItemID)(); }}>
                                    Удалить
                        </button>
                                <button onClick={() => { this.getSave(this.state.selectedItemID)(this.state.addingText, this.state.addingType); }}>
                                    Сохранить
                        </button>
                            </div>
                        </div>

                    </PopUp>}

            </div>
        )
    }

}

export default connect(
    (state: ApplicationState) => state.project,
    { ...ProjectStore.actionCreators, ...NavigationStore.actionCreators}
)(NavMenuEditor as any);
