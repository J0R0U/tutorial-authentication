import AppDispatcher = require('./app-dispatcher');
import { AppActionType } from './app-action-type';

export namespace AppActionHandler{
    export function OnLoginRequested( _UserName : string , _Password : string ):void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_LOGIN_REQUESTED ,
            Data : {
                UserName : _UserName ,
                Password : _Password
            }
        } );
    }

    export function OnLoginFailed( _Message : string ):void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_LOGIN_FAILED ,
            Data : {
                Message : _Message
            }
        } );
    }

    export function OnLoginSucceeded( _UserName : string ):void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_LOGIN_SUCCEEDED ,
            Data : {
                UserName : _UserName
            }
        } );
    }

    export function OnLogoutRequested():void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_LOGOUT_REQUESTED ,
            Data : {}
        } );
    }

    export function OnLogoutFailed( _Message : string ):void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_LOGOUT_FAILED ,
            Data : {
                Message : _Message
            }
        } );
    }

    export function OnLogoutSucceeded():void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_LOGOUT_SUCCEEDED ,
            Data : {}
        } );
    }

    export function OnSecretRequested():void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_SECRET_REQUESTED ,
            Data : {}
        } );
    }

    export function OnSecretFailed( _Message : string ):void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_SECRET_FAILED ,
            Data : {
                Message : _Message
            }
        } );
    }

    export function OnSecretSucceeded( _UserName : string ):void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_SECRET_SUCCEEDED ,
            Data : {
                UserName : _UserName
            }
        } );
    }
}