import * as React from 'react';
import { connect } from 'react-redux';
import * as ProjectStore from '../../store/ProjectStore';
import * as NavigationStore from '../../store/NavigationStore';
import * as AuthStore from '../../store/AuthStore';
import { ApplicationState } from '../../store';
import { Button } from 'reactstrap';
import PopUp from '../PopUp';


type Props = AuthStore.AuthenticationState & typeof AuthStore.actionCreators;

class Auth extends React.PureComponent<Props, { isAdding: boolean, isRegistered: boolean, addingTextName: string, addingTextEmail: string, addingTextPass: string }> {
    constructor(props: Props) {
        super(props)
        this.state = { isAdding: false, isRegistered: false, addingTextName: "", addingTextEmail: "", addingTextPass: ""};
    }

   

    public render() {
        return (<div >
            {!this.props.isAuth &&
                <div ><p onClick={() => { this.setState({ isAdding: true, isRegistered: true }) }}>sign in</p> <p onClick={() => { this.setState({ isAdding: true, isRegistered: false }) }}>sign up</p></div >}

            {this.props.isAuth &&
                <div><p>{this.props.name}</p> <button onClick={() => { this.props.authClear();}}>exit</button></div>}
                
            {!this.props.isAuth && this.state.isAdding && this.state.isRegistered &&
                <PopUp onClose={() => { this.setState({ isAdding: false, addingTextName: "", addingTextEmail: "", addingTextPass: "" }) }}>
                    <p>Email</p>
                    <input
                        value={this.state.addingTextEmail}
                        onChange={(e) => {
                            this.setState({ addingTextEmail: e.target.value })
                    }} />
                    <p>Password</p>
                    <input
                        value={this.state.addingTextPass}
                        onChange={(e) => {
                            this.setState({ addingTextPass: e.target.value })
                        }} />
                    <p onClick={() => { this.setState({ isRegistered: false, addingTextName: "", addingTextEmail: "", addingTextPass: "" }) }}>зарегестрироваться</p>
                <button onClick={() => { this.props.requestAuth(this.state.addingTextEmail, this.state.addingTextPass); this.setState({ isAdding: false, addingTextName: "", addingTextEmail: "", addingTextPass: "" }); }}> войти </button>
                </PopUp>}

            {!this.props.isAuth && this.state.isAdding && !this.state.isRegistered &&
                <PopUp onClose={() => { this.setState({ isAdding: false, addingTextName: "", addingTextEmail: "", addingTextPass: "" }) }}>
                    <p>Name</p>
                    <input
                        value={this.state.addingTextName}
                        onChange={(e) => {
                            this.setState({ addingTextName: e.target.value })
                    }} />
                    <p>Email</p>
                    <input
                        value={this.state.addingTextEmail}
                        onChange={(e) => {
                            this.setState({ addingTextEmail: e.target.value })
                    }} />
                    <p>Password</p>
                    <input
                        value={this.state.addingTextPass}
                        onChange={(e) => {
                            this.setState({ addingTextPass: e.target.value })
                        }} />
                <p onClick={() => { this.setState({ isRegistered: true, addingTextName: "", addingTextEmail: "", addingTextPass: "" }) }}>уже зарегестрированн</p>
                <button onClick={() => { this.props.reqistrationAuth(this.state.addingTextName , this.state.addingTextEmail, this.state.addingTextPass); this.setState({ isAdding: false, addingTextName: "", addingTextEmail: "", addingTextPass: "" }); }}> зарегестрироваться </button>
                </PopUp>}

        </div> )
    }

}

export default connect(
    (state: ApplicationState) => state.auth,
    AuthStore.actionCreators
)(Auth as any);
