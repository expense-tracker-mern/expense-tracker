import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
// import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import Navbar from './components/Utils/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <Route path="/" exact component={Landing} />
      <Switch>
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </div>
  );
};

export default App;
