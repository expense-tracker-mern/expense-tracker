import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
// import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </div>
  );
};

export default App;
