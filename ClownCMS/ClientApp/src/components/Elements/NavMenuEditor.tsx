import * as React from 'react';
import { connect } from 'react-redux';
import * as ProjectStore from '../../store/ProjectStore'
import { ApplicationState } from '../../store'
import { Button } from 'reactstrap';
import PopUp from '../PopUp';

type Props = ProjectStore.ProjectState & typeof ProjectStore.actionCreators;

class NavMenuEditor extends React.PureComponent<Props, { isAdding: boolean, addingText: string, addingType: number, selectedItemID: number}> {
    constructor(props: Props) {
        super(props)
        props.requestMenu()
        this.state = { isAdding: false, addingText: "", addingType: 0, selectedItemID: -1};
    }
    private AddNew = (menuItemName: string, menuItemType: number) => { { this.props.addMenuItem(menuItemName, menuItemType) } }

    private getSave = (id: number) => {
        if (id == -1)
            return this.AddNew;
        return (menuItemName: string, menuItemType: number) => this.props.setMenuItem(id, menuItemName, menuItemType)
    }
    private getDelete = (id: number) => {
        if (id == -1)
            return this.Close;
        return () => this.props.deleteMenuItem(id)
    }

    private Close = () => this.setState({ isAdding: false, addingText: "", addingType: 3, selectedItemID: -1 })

    private MenuItem = (props: any) => {
        return (
            <div>
                <button onFocus={props.focus}>
                    {props.menuItemName}
                </button>
                {props.children}
            </div>
        )
    }

    public render() {
        return (<div>

            {this.props.navMenuItems.map(item =>
                <this.MenuItem menuItemName={item.menuItemName} focus={() => { this.setState({ selectedItemID: item.menuItemId, addingType: item.menuItemType, addingText: item.menuItemName }); }}>
                    {this.state.selectedItemID == item.menuItemId ? <button onClick={() => { this.setState({ isAdding: true }); }} onBlur={this.Close} autoFocus> </button> : null}
                </this.MenuItem>)
            }

            {this.state.isAdding &&
                <PopUp onClose={this.Close}>
                <div className='popUpContent'>
                    <div>Введите тип элемента</div>
                    <div>
                        <select value={this.state.addingType} onChange={(event) => { this.setState({ addingType: Number(event.target.value) }); }}>
                            <option value="1">form1</option>
                            <option value="2">form2</option>
                            <option value="3">form3</option>
                            <option value="4">form4</option>
                        </select>
                    </div>
                    <div>Введите название элемента</div>
                    <div>
                        <input 
                            value={this.state.addingText}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.getSave(this.state.selectedItemID)(this.state.addingText, this.state.addingType);
                                    this.Close();
                                }
                            }}
                            onChange={(e) => {
                                this.setState({ addingText: e.target.value })
                            }} />
                    </div>
                    <div>
                        <button onClick={() => { this.getSave(this.state.selectedItemID)(this.state.addingText, this.state.addingType); this.Close(); }}>
                            Сохранить
                        </button>
                    </div>
                    <div>
                        <button onClick={() => { this.getDelete(this.state.selectedItemID)(); this.Close(); }}>
                            Удалить
                        </button>
                    </div>
                </div>

                </PopUp>}

           

            <input type='button' value='add' onClick={() => this.setState({ isAdding: true, addingText: "", addingType: 3, selectedItemID: -1})} />
        </div>
        )
    }

}

export default connect(
    (state: ApplicationState) => state.project, 
    ProjectStore.actionCreators 
)(NavMenuEditor as any);
