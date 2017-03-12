/**
 * Created by sammy on 17/3/10.
 */
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './Main';
import Home from './Home'
import Driver from './Driver'
import Passenger from './Passenger'
import Block from './Block'

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/driver" component={Driver}>
            {/*<Route path="/repos/:userName/:repoName" component={Repo}/>*/}
        </Route>
        <Route path="/passenger" component={Passenger}/>
        <Route path="/blocks" component={Block}/>
    </Route>
)
