import * as React from 'react';
import { connect } from 'react-redux';
import * as ProjectStore from '../../store/ProjectStore';
import * as NavigationStore from '../../store/NavigationStore';
import { ApplicationState } from '../../store';
import { Button } from 'reactstrap';
import PopUp from '../PopUp';
import './styles/NavMenuEditor.css';


type Props = ProjectStore.ProjectState & typeof ProjectStore.actionCreators & typeof NavigationStore.actionCreators;

class NavMenuEditor extends React.PureComponent<Props, { isAdding: boolean, addingText: string, addingType: number, selectedItemID: number}> {
    constructor(props: Props) {
        super(props)
        this.props.requestMenu()
        this.state = { isAdding: false, addingText: "", addingType: 0, selectedItemID: -1};
    }

    private getSave = (id: number) => {
        if (id == -1)
            return (menuItemName: string, menuItemType: number) => { this.props.addMenuItem(menuItemName, menuItemType); this.Close(); this.props.navigatinonClear(); }
        return (menuItemName: string, menuItemType: number) => { this.props.setMenuItem(id, menuItemName, menuItemType); this.Close(); this.props.navigatinonClear(); }
    }

    private getDelete = (id: number) => {
        if (id == -1)
            return this.Close;
        return () => { this.props.deleteMenuItem(id); this.Close(); this.props.navigatinonClear(); }
    }

    private Close = () => this.setState({ isAdding: false, addingText: "", addingType: 3, selectedItemID: -1 })

    private MenuItem = (props: any) => {
        return (
            <div>
                <button onMouseOver={props.actionChange}  onClick={props.execute}>
                    {props.menuItemName}
                </button>
                {props.children}
            </div>
        )
    }

    public render() {
        return (<div onMouseLeave={() => this.setState({ addingText: "", addingType: 3, selectedItemID: -1 })}>
            <div className='wrapper_Item'>
                {this.props.navMenuItems.map(item =>
                    <this.MenuItem menuItemName={item.menuItemName} execute={() => this.props.setCurrentMenuItem(item)} actionClear={() => { this.setState({ selectedItemID: -1, addingType: 3, addingText: "" }); }}  actionChange={() => { this.setState({ selectedItemID: item.menuItemId, addingType: item.menuItemType, addingText: item.menuItemName }); }}>
                        {this.state.selectedItemID == item.menuItemId ? <button onClick={() => { this.setState({ isAdding: true }); }}> </button> : null}
                    </this.MenuItem>)
                }
                <div>
                    <input type='button' value='add' onClick={() => this.setState({ isAdding: true, addingText: "", addingType: 3, selectedItemID: -1 })} />
                </div>
            </div>

            {this.state.isAdding &&
                <PopUp onClose={this.Close}>
                <div className='popUpMenuContent'>
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
                        <button onClick={() => { this.getSave(this.state.selectedItemID)(this.state.addingText, this.state.addingType);}}>
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
