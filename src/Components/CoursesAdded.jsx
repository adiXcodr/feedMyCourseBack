import React, { useState, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, Badge, Divider } from '@material-ui/core';
import { useSelector } from "react-redux";
import firebase from "../firebaseHandler";
import moment from "moment";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
const db = firebase.firestore();

const CoursesAdded = (props) => {
    const { history } = props;
    const location = useLocation();
    const params = location.state;
    const user = useSelector((state) => state.auth.userData);
    const [courses, setCourses] = useState([]);


    const getCoursesAdded = () => {
        db.collection("courses").where("instructorEmail", "==", user.email)
            .get()
            .then((querySnapshot) => {
                let courses = [];
                querySnapshot.forEach((doc) => {
                    courses.push(doc.data());
                });
                console.log("Got added courses", courses);
                setCourses(courses);
            })
            .catch((error) => {
                console.log("Error getting added courses: ", error);
            });
    };

    useEffect(() => {
        getCoursesAdded();
    }, []);

    return (
        <div style={{ marginTop: 30 }}>

            <Card style={{
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: 20,
                marginBottom: 50,
                transition: "0.3s",
                boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                "&:hover": {
                    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                },
                borderRadius: 30,
                padding: 20,
                paddingTop: 30
            }} >
                <CardContent>

                    <Typography style={{ fontSize: 25, fontWeight: "bold" }} >
                        Courses Added
                    </Typography>

                    {courses && courses.length > 0 ?
                        courses.map((course, idx) =>
                            <div style={{ marginTop: 30 }}>
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

                                {course.instructorEmail == user.email ?
                                    <CardActions>
                                        <Button size="small" onClick={() => history.push({
                                            pathname: "/addCourse",
                                            state: { courseCode: course.courseCode }
                                        })}>Edit Course</Button>
                                    </CardActions>
                                    :
                                    null
                                }

                                {idx != courses.length - 1 &&
                                    <Divider variant="middle" style={{ marginTop: 20 }} />
                                }
                            </div>
                        )
                        :
                        null
                    }


                </CardContent>


            </Card>
        </div>

    );

}
export default withRouter(CoursesAdded);