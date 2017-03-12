import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
// Render the main component into the dom
// ReactDOM.render(<App />, document.getElementById('app'));

import {Router, hashHistory, browserHistory} from 'react-router'
import routes from './components/routes'

ReactDOM.render((
  <Router routes={routes} history={browserHistory}>
    {/*<Router history={hashHistory}>*/}
  </Router>
), document.getElementById('app'));


