import React, { Component } from 'react';
import Home from './Containers/Home';
import classes from './App.module.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./redux/store";

class App extends Component {

  UNSAFE_componentWillMount = () => {

  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <div className={classes.App}>
            <Provider store={store}>
              <Home />
            </Provider>
          </div>
        </React.Fragment>
      </BrowserRouter>
    );

  }
}

export default App;
