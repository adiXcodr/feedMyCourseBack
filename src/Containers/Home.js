import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SideBar from "../Components/SideBar";
import firebase from "../firebaseHandler";
const db = firebase.firestore();


class Home extends Component {

  state = {
    overlaywidth: 0,
    loggedin: null,
    loading: true,
    user: null
  }

  openOverlay = () => {
    this.setState({ overlaywidth: 100 })
  }
  closeOverlay = () => {
    this.setState({ overlaywidth: 0 })
  }
  singOutUser = () => {
    firebase.auth().signOut().then(async () => {
      // Sign-out successful.
      this.closeOverlay();
      await localStorage.clear();
      this.props.history.push("/");
    }).catch(function (error) {
      // An error happened.
    })
  }
  componentWillMount() {
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
            this.setState({ loggedin: true, loading: false, user: newUser });
            this.props.history.push("/dashboard");
          } else {
            console.log("No such document!");
            this.setState({ loggedin: true, loading: false, user: user });
          }
        }).catch((error) => {
          console.log("Error getting user data:", error);
          this.setState({ loggedin: true, loading: false, user: user });
        });
      } else {
        this.setState({ loggedin: false, loading: false, user: null })  // No user is signed in.
      }
    });
  }

  privateRoutes = () => {

  };

  render() {
    return (<SideBar loading={this.state.loading} loggedin={this.state.loggedin} user={this.state.user} />)
  }
}

export default withRouter(Home);