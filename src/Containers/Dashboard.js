import React, { useEffect, useState } from 'react';
import classes from './Dashboard.module.css';
import { withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, Badge } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import SelectUserType from "../Components/UserType";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';


const Dashboard = (props) => {
  const {history} = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const loggedin = useSelector((state) => state.auth.loggedin);
  const [courses, setCourses] = useState([
    { name: "Data Structures", courseCode: "CO112", instructorName: "Arindam Karmakar", courseCredits: 3, datePosted: Date.now(), instructorEmail: "ak@gmail.com" },
    { name: "Software Engineering", courseCode: "CO113", instructorName: "Sattapathy", courseCredits: 2, datePosted: Date.now(), instructorEmail: "sp@gmail.com" },
    { name: "Cryptography", courseCode: "CO402", instructorName: "Nityananda Sarma", courseCredits: 4, datePosted: Date.now(), instructorEmail: "nmcse@gmail.com" }
  ]);

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
            {courses.map((course) =>
              <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: 20 }} >

                <CardContent>
                  <Badge badgeContent={course.courseCredits} color="primary" style={{ float:"right"}}>
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
                  <Button size="small" onClick={()=>history.push({
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