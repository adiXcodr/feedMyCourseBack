import React from 'react';
import { withRouter } from 'react-router-dom';
import SideBar from "../Components/SideBar";
import { useSelector } from "react-redux";


const Home = () => {

  const user = useSelector((state) => state.auth.userData);
  const loggedin = useSelector((state) => state.auth.loggedin);

  return (<SideBar loading={false} loggedin={loggedin} user={user} />)
}

export default withRouter(Home);