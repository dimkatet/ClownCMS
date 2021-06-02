import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import StartPage from './components/StartPage';
import Base from './components/page-structure/Base';
import config from './store/project_config.json';

import './custom.css'

export default () => (
    <Switch>
        <Route exact path='/index' component={Base} />
        <Route exact path='/' component={StartPage} >
            {config.IsProject == true? < Redirect to="/index" /> : null}
        </Route>
    </Switch>
);