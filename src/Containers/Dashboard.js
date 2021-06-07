import React, { useEffect } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import classes from './Dashboard.module.css';
import { useHistory, withRouter } from 'react-router-dom';

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user;
      var credential = authResult.credential;
      var isNewUser = authResult.additionalUserInfo.isNewUser;
      var providerId = authResult.additionalUserInfo.providerId;
      var operationType = authResult.operationType;
      // Do something with the returned AuthResult.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    signInFailure: function (error) {
      // Some unrecoverable error occurred during sign-in.
      // Return a promise when error handling is completed and FirebaseUI
      // will reset, clearing any UI. This commonly occurs for error code
      // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
      // occurs. Check below for more details on this.
      // return handleUIError(error);
    },

  },
  queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
  signInFlow: 'popup',
  signInSuccessUrl: '',//Specifying sign in success url can cause double redirect since we are also managing redirect in react-router with local state.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  // Other config options...
}
const Dashboard = (props) => {

  useEffect(() => {
    if (!props.loggedin) {
      props.history.push("/");
    }
  }, [props.loggedin]);
  return (
    <div className={classes.contentwrapper}>
      {props.loading ? <p>Loading..</p> :
        (!props.loggedin ?
          <React.Fragment>
            <p>Please sign in to see this page.</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} className={classes.emailbox} />
          </React.Fragment> :
          <p>Private stuff here !</p>
        )}
    </div>

  );
}
export default withRouter(Dashboard);