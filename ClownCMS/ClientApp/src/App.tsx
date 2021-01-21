import * as React from 'react';
import { Route } from 'react-router';
import StartPage from './components/StartPage';

import './custom.css'

export default () => (
    <Route exact path='/' component={StartPage} />
);
