import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import classes from './Dashboard.module.css';
import { withRouter } from 'react-router-dom';
import { } from '@material-ui/core';
import SelectUserType from "../Components/UserType";


const Dashboard = (props) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!props.loggedin) {
      props.history.push("/");
    }
  }, [props.loggedin]);

  useEffect(() => {
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
          <SelectUserType user={user} />
        )
      }
    </div>

  );
}
export default withRouter(Dashboard);