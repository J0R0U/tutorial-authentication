import * as React from 'react';
import { HashRouter, Link } from 'react-router-dom';
import * as Styles from './../../style/index.css';
import { PublicView } from './views/view-public';
import { ProtectedView } from './views/view-protected';
import { LoginView } from './views/view-login';
import { AuthState } from '../types/auth-state';
import { EventSubscription } from 'fbemitter';
import LoginStore = require('./../stores/store-login');
import { AppActionHandler } from '../app/app-action-handler';

export interface IAuthBarProps { }
export interface IAuthBarState {
    AuthState: AuthState;
    UserName: string;
}

export class AuthBarState implements IAuthBarState {
    AuthState: AuthState;
    UserName: string;

    constructor() {
        this.AuthState = LoginStore.AuthState;
        this.UserName = LoginStore.UserName;
    }
}

export class AuthBar extends React.Component<IAuthBarProps, IAuthBarState> {

    __LoginStoreListener: EventSubscription;

    constructor(_Props: IAuthBarProps) {
        super(_Props);

        this.state = new AuthBarState();

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
            AuthState: LoginStore.AuthState,
            UserName: LoginStore.UserName
        });
    }
    private renderAuthenticated(): JSX.Element {
        return (
            <div className={`${Styles.authBar} ${Styles.authenticated}`} >
                You are logged in as
                <span className={Styles.authName}>
                    {' ' + this.state.UserName}
                </span>.
                Not you?
                <span className={Styles.authAction} onClick={AppActionHandler.OnLogoutRequested}>
                    Logout
                </span>
            </div>
        );
    }

    private renderNotAuthenticated(): JSX.Element {
        return (
            <div className={`${Styles.authBar} ${Styles.notAuthenticated}`} >
                You are not logged in..
                <span className={Styles.authAction}>
                    <Link to='/login'>Login</Link>
                </span>
            </div>
        );
    }

    private renderLoading(): JSX.Element {
        return (
            <div className={`${Styles.authBar} ${Styles.loading}`} >
                Your credentials are beeing checked...
            </div>
        );
    }

    render() {
        switch (this.state.AuthState) {
            case AuthState.AUTHENTICATED:
                return this.renderAuthenticated();
            case AuthState.NOT_AUTHENTICATED:
                return this.renderNotAuthenticated();
            case AuthState.LOADING:
                return this.renderLoading();
            default:
                return null;
        }
    }
}