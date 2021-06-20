import React, { useState, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, Badge, Divider, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import firebase from "../firebaseHandler";
import classes from '../App.module.css';
import moment from "moment";
import { isMobile } from "react-device-detect";
const db = firebase.firestore();

const Analysis = (props) => {
    const { history } = props;
    const location = useLocation();
    const params = location.state;
    const loggedin = useSelector((state) => state.auth.loggedin);
    const user = useSelector((state) => state.auth.userData);
    const [courses, setCourses] = useState([]);
    const [topRated, setTopRated] = useState("None");
    const [mostReviews, setMostReviews] = useState("None");
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalFeedback, setTotalFeedback] = useState(0);

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            height: 140,
            width: 100,
        },
        control: {
            padding: theme.spacing(2),
        },
    }));

    useEffect(() => {
        if (!loggedin) {
            history.push("/");
        }
    }, [loggedin]);

    useEffect(() => {
        if (user.userType != "Faculty") {
            history.push("/dashboard");
        }
    }, [user]);

    const getAnalysis = () => {
        db.collection("courses").where("instructorEmail", "==", user.email)
            .get()
            .then(async (querySnapshot) => {
                let courses = [];
                for (let doc of querySnapshot.docs) {
                    let course = doc.data();
                    try {
                        let feedbackSnapshot = await db.collection("feedback").where("courseCode", "==", course.courseCode).get();
                        let feedback = [];
                        feedbackSnapshot.forEach((doc) => {
                            let obj = doc.data();
                            obj.id = doc.id;
                            feedback.push(obj);
                        });
                        course.feedback = feedback;
                        courses.push(course);
                    }
                    catch (err) {
                        console.log("Error getting added feedback: ", err);
                        courses.push(course);
                    }
                }
                console.log("Got Analysis Courses", courses, courses.length);
                setCourses(courses);
            })
            .catch((error) => {
                console.log("Error getting Analysis Courses: ", error);
            });

    };

    const startSetDashboardData = (courses) => {
        let coursesAdded = courses.length;
        setTotalCourses(coursesAdded);
        let feedbackRecieved = 0;
        let bestCourse = "None";
        let bestScore = null;
        let mostReviews = "None";
        let mostReviewsScore = null;
        courses.forEach((course) => {
            if (course.feedback && course.feedback.length > 0) {
                let sum = 0;
                feedbackRecieved += course.feedback.length;
                if (!mostReviewsScore || course.feedback.length > mostReviewsScore.score) {
                    mostReviewsScore = {
                        name: course.name,
                        code: course.courseCode,
                        score: course.feedback.length
                    };
                }
                course.feedback.forEach((entry) => {
                    sum += entry.overall;
                });
                let avgScore = sum / course.feedback.length;
                if (!bestScore || avgScore > bestScore.score) {
                    bestScore = {
                        name: course.name,
                        code: course.courseCode,
                        score: avgScore
                    };
                }
            }
        });
        if (bestScore) {
            bestCourse = bestScore.name;
        }
        if (mostReviewsScore) {
            mostReviews = mostReviewsScore.name;
        }
        let obj = {
            coursesAdded,
            feedbackRecieved,
            bestCourse,
            mostReviews
        };
        console.log("Analysis Dashboard Data", obj);
        setTotalFeedback(feedbackRecieved);
        setTopRated(bestCourse);
        setMostReviews(mostReviews);
    };

    const truncateText=(text,len)=>{
        if(text.length<=len){
            return text;
        }
        else{
            return text.substring(0,len)+"...";
        }
    };

    useEffect(() => {
        getAnalysis();
    }, []);

    useEffect(() => {
        if (courses && courses.length > 0) {
            startSetDashboardData(courses);
        }
    }, [courses]);

    return (
        <div style={{ marginTop: 30 }}>

            <div style={{ width: "90%", marginLeft: "auto", marginRight: "auto", marginBottom: 20, marginTop: 20 }} >

                <Grid container className={classes.root} spacing={2} justify="center">
                    <Grid item xs={12} >
                        <Grid container justify="center" spacing={2}>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                }}>
                                    <Typography style={{fontSize:17, fontWeight:"bold"}}>Courses Added</Typography>
                                    <Typography>{totalCourses}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                }}>
                                    <Typography style={{fontSize:17, fontWeight:"bold"}}>Feedback Recieved</Typography>
                                    <Typography>{totalFeedback}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                }}>
                                    <Typography style={{fontSize:17, fontWeight:"bold"}}>Highest Rated Course</Typography>
                                    <Typography>{truncateText(topRated,30)}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                }}>
                                    <Typography style={{fontSize:17, fontWeight:"bold"}}>Most Reviewed Course</Typography>
                                    <Typography >{truncateText(mostReviews,30)}</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>


            </div>
        </div>

    );

}
export default withRouter(Analysis);