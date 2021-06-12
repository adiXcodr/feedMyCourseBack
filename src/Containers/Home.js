import React, { Component } from 'react';
import classes from './Home.module.css';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import About from '../Components/Aboutus';
import logo from "../Resources/Images/logo.svg";
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
    return (
      <React.Fragment>
        <div style={{ width: this.state.overlaywidth + '%' }} className={classes.overlay}>

          <span className={classes.closebtn} onClick={this.closeOverlay}>&times;</span>
          <div className={classes.overlaycontent}>
            <ul>
              <li onClick={this.closeOverlay}><Link to="/dashboard">Dashboard</Link></li>
              <li onClick={this.closeOverlay}><Link to="/about">About Us</Link></li>
              <li onClick={this.closeOverlay}><Link to="/contact">Contact Us</Link></li>
              {this.state.loggedin ?
                <li onClick={this.singOutUser}><Link >Sign Out</Link></li> :
                null}
            </ul>
          </div>
        </div>

        <div className={classes.Container}>
          <div className={classes.navbarcontainer}>
            <div className={classes.logocol} ><Link to=""><img src={logo} alt="companay-logo" width="30" height="30" /><span>Feedify</span></Link></div>
            <div className={classes.navlist}>

              {this.state.loggedin ?
                <ul>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li onClick={this.singOutUser}><Link >Sign Out</Link></li>
                </ul>
                : <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About Us</Link></li></ul>
              }

            </div>
            <span className={classes.hamburger} onClick={this.openOverlay}>&#9776;</span>
          </div>
          <div className={classes.contentcontainer}>
            <Switch>
              <Route path='/' exact render={() => <Landing loading={this.state.loading} loggedin={this.state.loggedin} user={this.state.user} />} />
              <Route path='/dashboard' exact render={() => <Dashboard loading={this.state.loading} loggedin={this.state.loggedin} user={this.state.user} />} />
              <Route path='/about' exact render={() => <About />} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Home);