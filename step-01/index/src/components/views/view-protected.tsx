import * as React from 'react';
import * as Styles from './../../../style/index.css';
import { AuthState } from '../../types/auth-state';
import LoginStore = require('./../../stores/store-login');
import { EventSubscription } from 'fbemitter';
import { Redirect } from 'react-router';

export interface IProtectedViewProps { }
export interface IProtectedViewState {
    AuthState: AuthState;
}

export class ProtectedViewState implements IProtectedViewState {
    AuthState: AuthState;

    constructor() {
        this.AuthState = LoginStore.AuthState;
    }
}

export class ProtectedView extends React.Component<IProtectedViewProps, IProtectedViewState> {

    __LoginStoreListener: EventSubscription;

    constructor(_Props: IProtectedViewProps) {
        super(_Props);
        this.state = new ProtectedViewState();

        this.onLoginStoreChanged = this.onLoginStoreChanged.bind(this);
    }

    componentDidMount(): void {
        this.__LoginStoreListener = LoginStore.addListener(this.onLoginStoreChanged);
    }
    componentWillUnmount(): void {
        this.__LoginStoreListener.remove();
    }

    private onLoginStoreChanged(): void {
        this.setState({
            AuthState: LoginStore.AuthState
        });
    }
    render() {
        return (
            <div className={Styles.view} >
                {this.state.AuthState == AuthState.AUTHENTICATED ? 'Protected Page' : <Redirect to='login' />}
            </div>
        );
    }
}