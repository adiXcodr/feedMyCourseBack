import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import classes from './Dashboard.module.css';
import { withRouter } from 'react-router-dom';
import { Select, Button, MenuItem } from '@material-ui/core';
const db = firebase.firestore();

const allUserTypes = [
  "Student",
  "Faculty",
  "Parents",
  "Alumni",
  "Industry Personel"
];

const Dashboard = (props) => {

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("Student");

  const handleUserTypeChange = () => {
    if (user) {
      db.collection("users").doc(user.uid).update({ userType: userType }).then(() => {
        console.log("Changed usertype to", userType);
        let newUser = user;
        newUser.userType = userType;
        setUser(newUser);
        window.location.reload();
      }).catch((err) => {
        console.lof("Could not change user-type", err);
      });
    }
  };

  useEffect(() => {
    if (!props.loggedin) {
      props.history.push("/");
    }
  }, [props.loggedin]);

  useEffect(() => {
    console.log("User Data", props.user);
    if (props.user) {
      setUser(props.user);
      localStorage.setItem("uid", props.user.uid);
      localStorage.setItem("name", props.user.displayName);
      localStorage.setItem("email", props.user.email);
      localStorage.setItem("photo", props.user.photoURL);
      localStorage.setItem("phone", props.user.phoneNumber);
      localStorage.setItem("userType", props.user.userType || null);
    }

  }, [props.user]);

  return (
    <div className={classes.contentwrapper} style={{ width: "100vw" }}>
      {props.loading ? <p>Loading..</p> :
        (user && user.userType ?
          <React.Fragment>
            <p>Private stuff here !</p>
          </React.Fragment>
          :
          <div style={{
            width: "100%"
          }}>
            <p style={{ fontSize: 30, marginBottom: 30 }}>Help us know you better.</p>
            <p style={{ fontSize: 15 }}>Who are you?</p>
            <Select
              labelId="userType-select-label"
              id="userType-select"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              variant="outlined"
              style={{ width: "30%", marginBottom: 30 }}
            >
              {allUserTypes.map((val) => <MenuItem value={val}>{val}</MenuItem>)}
            </Select>
            <br></br>
            <Button style={{ width: "20%" }} variant="contained" color="primary" onClick={handleUserTypeChange}>
              Save
            </Button>
          </div>
        )
      }
    </div>

  );
}
export default withRouter(Dashboard);