import { Store } from 'flux/utils';
import AppAction from './../app/app-action';
import AppDispatcher = require('./../app/app-dispatcher');
import { AppActionType } from '../app/app-action-type';
import * as $ from 'jquery';
import { AppActionHandler } from '../app/app-action-handler';
import { AuthState } from '../types/auth-state';

class LoginStoreClass extends Store<AppAction>{

    private __UserName: string = '';
    private __AuthState: AuthState = AuthState.NOT_AUTHENTICATED;

    public get AuthState(): AuthState {
        return this.__AuthState;
    }

    public get UserName(): string {
        return this.__UserName;
    }

    private Login( _Username: string, _Password: string ): void {
        $.ajax(
            {
                type: 'POST',
                url: 'http://localhost:8080/login',
                data: { 'User': _Username, 'Password': _Password },
                success: this.OnLoginSucceeded,
                error: this.OnLoginFailed
            }
        );
    }

    private Logout(): void {
        $.ajax(
            {
                type: 'POST',
                url: 'http://localhost:8080/logout',
                success: this.OnLogoutSucceeded,
                error: this.OnLogoutFailed
            }
        );
    }

    private OnLoginSucceeded( _Answer : string ): void {
        AppActionHandler.OnLoginSucceeded( _Answer );
    }

    private OnLoginFailed(_Response: any): void {
        AppActionHandler.OnLoginFailed(_Response.message);
    }

    private OnLogoutSucceeded(  ): void {
        AppActionHandler.OnLogoutSucceeded();
    }

    private OnLogoutFailed(_Response: any): void {
        AppActionHandler.OnLogoutFailed(_Response.message);
    }

    __onDispatch(_PayLoad: AppAction) {
        switch (_PayLoad.ActionType) {
            case AppActionType.AT_LOGIN_REQUESTED:
                this.__AuthState = AuthState.LOADING;
                this.Login(_PayLoad.Data.UserName, _PayLoad.Data.Password);
                break;

            case AppActionType.AT_LOGIN_SUCCEEDED:
                this.__AuthState = AuthState.AUTHENTICATED;
                this.__UserName = _PayLoad.Data.UserName;

                break;

            case AppActionType.AT_LOGIN_FAILED:
                alert('login failed');
                this.__AuthState = AuthState.NOT_AUTHENTICATED;
                break;

            case AppActionType.AT_LOGOUT_REQUESTED:
                this.__AuthState = AuthState.LOADING;
                this.Logout();
                break;

            case AppActionType.AT_LOGOUT_SUCCEEDED:
                this.__AuthState = AuthState.NOT_AUTHENTICATED;
                this.__UserName = '';
                break;

            case AppActionType.AT_LOGOUT_FAILED:
                alert('logout failed');
                this.__AuthState = AuthState.AUTHENTICATED;
                break;
        }

        this.__emitChange();
    }
}

let LoginStore: LoginStoreClass = new LoginStoreClass(AppDispatcher);
export = LoginStore;