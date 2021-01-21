import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import StartPage from './components/StartPage';
import Base from './components/PageStructure/Base';

import './custom.css'

export default () => (
    <Switch>
        <Route exact path='/index' component={Base} />
        <Route exact path='/' component={StartPage} />

    </Switch>
);