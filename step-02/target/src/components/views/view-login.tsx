import * as React from 'react';
import * as Styles from './../../../style/index.css' ;
import { AppActionHandler } from '../../app/app-action-handler';

export interface ILoginViewProps {  }
export interface ILoginViewState {
    Username : string ;
    Password : string ;
}

export class LoginViewState implements ILoginViewState{
    Username: string = '';
    Password: string = '';
    
}

export class LoginView extends React.Component<ILoginViewProps, ILoginViewState> {

    constructor( _Props : ILoginViewProps ){
        super(_Props);
        this.state =  new LoginViewState();
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onUserNameChanged = this.onUserNameChanged.bind(this);
        this.OnLoginClick = this.OnLoginClick.bind(this);
    }

    private onUserNameChanged( _Event : React.ChangeEvent<HTMLInputElement> ):void{
        this.setState({
            Username : _Event.target.value
        });
    }

    private onPasswordChanged( _Event : React.ChangeEvent<HTMLInputElement> ):void{
        this.setState({
            Password : _Event.target.value
        });
    }

    private OnLoginClick():void{
        AppActionHandler.OnLoginRequested( this.state.Username , this.state.Password );
    }

    render() {
        return(
            <div className={Styles.view} >
                <div className={Styles.loginForm}>
                    <input type='text' value={this.state.Username} placeholder='Username' onChange={this.onUserNameChanged} />
                    <input type='password' value={this.state.Password} placeholder='Password' onChange={this.onPasswordChanged} />
                    <button onClick={this.OnLoginClick}>Login</button>
                </div>
            </div>
        );
    }
}