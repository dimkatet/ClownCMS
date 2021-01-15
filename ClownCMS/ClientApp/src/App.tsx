import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Base from './components/PageStructure/Base';

import './custom.css'

export default () => (
    <Switch>
        <Route path='/' component={Base}/>
        <Route exact path='/' component={Home} />     
    </Switch>
);
