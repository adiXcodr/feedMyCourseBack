import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, Badge, TextField, InputAdornment } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import SelectUserType from "../Components/UserType";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SearchIcon from '@material-ui/icons/Search';


const Dashboard = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const loggedin = useSelector((state) => state.auth.loggedin);
  const [courses, setCourses] = useState([
    { name: "Data Structures", courseCode: "CO112", instructorName: "Arindam Karmakar", courseCredits: 3, datePosted: Date.now(), instructorEmail: "ak@gmail.com" },
    { name: "Software Engineering", courseCode: "CO113", instructorName: "Sattapathy", courseCredits: 2, datePosted: Date.now(), instructorEmail: "sp@gmail.com" },
    { name: "Cryptography", courseCode: "CO402", instructorName: "Nityananda Sarma", courseCredits: 4, datePosted: Date.now(), instructorEmail: "nmcse@gmail.com" }
  ]);

  const handleSearch = (e) => {
    let query = e.target.value;
    console.log("Search Val", query);
  };

  useEffect(() => {
    if (!loggedin) {
      props.history.push("/");
    }
  }, [loggedin]);

  return (
    <div style={{ width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: 20 }}>
      {props.loading ? <p>Loading..</p> :
        (user && user.userType ?
          <div style={{}}>

            <Card className="dashboardTopBar"
              style={{
                display: "flex",
                flexDirection: "row",
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: 20,
                padding: 20
              }}>

              <TextField
                id="searchField"
                label="Search"
                placeholder="Search for your course"
                variant="outlined"
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                style={{
                  width: "80%",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              />
            </Card>

            {courses.map((course) =>
              <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: 20 }} >

                <CardContent>
                  <Badge badgeContent={course.courseCredits} color="primary" style={{ float: "right" }}>
                    <MonetizationOnIcon />
                  </Badge>
                  <Typography color="textSecondary" gutterBottom>
                    {course.courseCode}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {course.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {course.instructorName} - {course.instructorEmail}
                  </Typography>

                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => history.push({
                    pathname: "/dashboard/giveFeedback",
                    state: { courseDetails: course }
                  })}>Give Feedback</Button>
                </CardActions>
              </Card>
            )}
          </div>
          :
          <SelectUserType user={user} />
        )
      }
    </div>

  );
}
export default withRouter(Dashboard);