import * as React from 'react';
import * as Styles from './../../../style/index.css' ;

export interface IPublicViewProps {  }
export interface IPublicViewState {  }

export class PublicView extends React.Component<IPublicViewProps, IPublicViewState> {
    render() {
        return(
            <div className={Styles.view} >
                Public Page
            </div>
        );
    }
}