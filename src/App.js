import React, { useEffect, useState } from 'react';
import Home from './Containers/Home';
import classes from './App.module.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { setAuth, saveUserData } from "./redux/actions";
import firebase from "./firebaseHandler";
import { colors } from "./constants";
const db = firebase.firestore();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary
    }
  }
});

const App = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection("users").doc(user.uid).get().then((doc) => {
          if (doc.exists) {
            let db_user = doc.data();
            console.log("User data from firestore", db_user);
            let newUser = user;
            for (const property in db_user) {
              if (!(property in newUser)) {
                newUser[property] = db_user[property];
              }
            }
            console.log("Combined user data", newUser);
            store.dispatch(setAuth(true));
            store.dispatch(saveUserData(newUser));
            setLoading(false);
          } else {
            store.dispatch(setAuth(true));
            store.dispatch(saveUserData(user));
            setLoading(false);
          }
        }).catch((error) => {
          console.log("Error getting user data:", error);
          store.dispatch(setAuth(true));
          store.dispatch(saveUserData(user));
          setLoading(false);
        });
      } else {
        store.dispatch(setAuth(false));
        store.dispatch(saveUserData(null));
        setLoading(false);
      }
    });
  }, []);

  return (
    <HashRouter>
      <React.Fragment>
        <div className={classes.App}>
          <Provider store={store}>
            {loading ?
              <div class="loader"></div>
              :
              <MuiThemeProvider theme={theme}>
                <Home />
              </MuiThemeProvider>
            }
          </Provider>
        </div>
      </React.Fragment>
    </HashRouter>
  );

}

export default App;
