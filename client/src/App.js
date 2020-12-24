import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <Route path="/" exact component={Landing} />
      <section className="main">
        <Switch>
          <Route path="/dashboard" exact component={Dashboard} />
        </Switch>
      </section>
    </div>
  );
};

export default App;
