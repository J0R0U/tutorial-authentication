import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import * as Styles from './../../style/index.css';
import { Switch, Route } from 'react-router';
import { PublicView } from './views/view-public';
import { ProtectedView } from './views/view-protected';
import { LoginView } from './views/view-login';
import { AuthBar } from './auth-bar';
import { AppActionHandler } from '../app/app-action-handler';

export interface IApplicationProps { }
export interface IApplicationState { }

export class Application extends React.Component<IApplicationProps, IApplicationState> {

    componentDidMount():void{
        AppActionHandler.OnCheckLoginState();   
    }

    render() {
        return (
            <HashRouter>
                <div className={Styles.application} >
                    <AuthBar />
                    <Switch>
                        <Route path='/login' component={LoginView} />
                        <Route path='/protected' component={ProtectedView} />
                        {/* Default View */}
                        <Route component={PublicView} />
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}