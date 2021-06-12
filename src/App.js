import React, { Component } from 'react';
// import Landing from './Container/Landing'
import Home from './Containers/Home'
import classes from './App.module.css';
import { BrowserRouter } from 'react-router-dom';
import firebase from "firebase";
import { firebaseConfig } from "./constants";

class App extends Component {

  UNSAFE_componentWillMount = () => {
    console.log("Firebase App Length", firebase.apps.length)
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <div className={classes.App}>
            {firebase.apps.length &&
              <Home />
            }
          </div>
        </React.Fragment>
      </BrowserRouter>
    );

  }
}

export default App;
