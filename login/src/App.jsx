import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Login} from './components/Login/Login';
import {Dashboard} from './page/Dashboard/Dashboard';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
