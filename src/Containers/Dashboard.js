import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, Badge, TextField, InputAdornment } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import SelectUserType from "../Components/UserType";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SearchIcon from '@material-ui/icons/Search';
import moment from "moment";
import firebase from "../firebaseHandler";
const db = firebase.firestore();

const Dashboard = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const loggedin = useSelector((state) => state.auth.loggedin);
  const [orgcourses, setOrgCourses] = useState([]);
  const [courses, setCourses] = useState([]);


  const handleSearch = (e) => {
    let query = e.target.value;
    console.log("Search Courses Value", query);
    if (query != "") {
      query = query.toLowerCase();
      let result = courses.filter(item => (
        item.name + item.courseCode + item.instructorName + item.instructorEmail
      ).toLowerCase().indexOf(query) > -1);
      console.log("Result is", result)
      setCourses(result);
    }
    else {
      setCourses(orgcourses);
    }

  };

  const getAllCourses = () => {
    db.collection("courses").get().then((querySnapshot) => {
      let courses = [];
      querySnapshot.forEach((doc) => {
        courses.push(doc.data());
      });
      setOrgCourses(courses);
      setCourses(courses);
    });
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    if (!loggedin) {
      props.history.push("/");
    }
  }, [loggedin]);

  return (
    <div style={{ width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: 20 }}>
      {(user && user.userType ?
        <div style={{}}>

          <Card className="dashboardTopBar"
            style={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 20,
              padding: 20,
              paddingBottom: 30
            }}>

            <Typography variant="h6" component="h4" style={{ marginBottom: 20 }}>
              Welcome, {user.displayName} {user && user.userType ? "(" + user.userType + ")" : ""}
            </Typography>

            <div
              style={{
                display: "flex",
                flexDirection: "row"
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

              {user.userType == "Faculty" &&
                <Button size="small" variant="contained" color="primary" onClick={() => history.push("/addCourse")}>Add Course</Button>
              }
            </div>
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

                <Typography variant="h6" component="h4" color="textSecondary">
                  Posted By
                </Typography>
                <Typography >
                  {course.instructorName} - {course.instructorEmail}
                </Typography>

                <Typography >
                  {moment(course.datePosted).fromNow()}
                </Typography>

              </CardContent>

              {user.userType != "Faculty" ?
                <CardActions>
                  <Button size="small" onClick={() => history.push({
                    pathname: "/dashboard/giveFeedback",
                    state: { courseDetails: course }
                  })}>Give Feedback</Button>
                </CardActions>
                :
                (course.instructorEmail == user.email ?
                  <CardActions>
                    <Button size="small" onClick={() => history.push({
                      pathname: "/addCourse",
                      state: { courseCode: course.courseCode }
                    })}>Edit Course</Button>
                  </CardActions>
                  :
                  null
                )
              }
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