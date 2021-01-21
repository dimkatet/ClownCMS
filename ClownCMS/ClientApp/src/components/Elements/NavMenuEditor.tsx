import * as React from 'react';
import { connect } from 'react-redux';
import * as NavMenuStore from '../../store/NavMenuStore'
import { ApplicationState } from '../../store'
import NavElementEditor from './NavElementEditor'

type Props = NavMenuStore.ProjectState & typeof NavMenuStore.actionCreators;

class NavMenuEditor extends React.PureComponent<Props, { isAdding: boolean, addingText: string, addingType: number }> {
    constructor(props: Props) {
        super(props)
        props.requestMenu()
        this.state = { isAdding: false, addingText: "", addingType: 0};
    }
    private AddNew = (menuItemName: string, menuItemType: number) => { { this.props.addMenuItem(menuItemName, menuItemType) } }

    private getSave = (id: number) => {
        return (menuItemName: string, menuItemType: number) => this.props.setMenuItem(id, menuItemName, menuItemType)
    }
    private getDelete = (id: number) => {
        return () => this.props.deleteMenuItem(id)
    }

    private Close = () => this.setState({ isAdding: false, addingText: "", addingType: 3 })

    public render() {
        return (<div>
            {this.props.navMenuItems.map(item => < NavElementEditor text={item.menuItemName} type={item.menuItemType} save={this.getSave(item.menuItemId)} del={this.getDelete(item.menuItemId)} />)}
            {this.state.isAdding && < NavElementEditor text={this.state.addingText} type={this.state.addingType} save={this.AddNew} del={this.Close} close={this.Close} />}
            <input type='button' value='add' onClick={() => this.setState({ isAdding: true, addingText: "", addingType: 0})} />
        </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.menuItems, 
    NavMenuStore.actionCreators 
)(NavMenuEditor as any);