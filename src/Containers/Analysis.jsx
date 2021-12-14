import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, Badge, Divider, Paper, Grid, Select, MenuItem } from '@mui/material';
import { useSelector } from "react-redux";
import firebase from "../firebaseHandler";
// import classes from '../App.module.css';
import moment from "moment";
import { isMobile } from "react-device-detect";
import CourseBarRanks from '../Components/CourseBarRanks';
import FeedbackTable from "../Components/FeedbackTable";
import { colors } from "../constants";
const PREFIX = 'Analysis';

const classes = {
    root: `${PREFIX}-root`,
    paper: `${PREFIX}-paper`,
    control: `${PREFIX}-control`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.root}`]: {
        flexGrow: 1,
    },

    [`& .${classes.paper}`]: {
        height: 140,
        width: 100,
    },

    [`& .${classes.control}`]: {
        padding: theme.spacing(2),
    }
}));

const db = firebase.firestore();

const fields = [
    { id: "overall", name: "Overall" },
    { id: "content", name: "Content Provided" },
    { id: "punctuality", name: "Punctuality" },
    { id: "query", name: "Class Interaction" },
    { id: "instructor", name: "Your Impression" },
]

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
    const [feedbackField, setFeedbackField] = useState(fields[0].name);
    const [barChartData, setBarChartData] = useState([]);
    const [activeCourse, setActiveCourse] = useState("");
    const [activefeedback, setActiveFeedback] = useState([]);

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

    const truncateText = (text, len) => {
        if (text.length <= len) {
            return text;
        }
        else {
            return text.substring(0, len) + "...";
        }
    };

    const startFieldWiseBarChart = (courses, feedbackField) => {
        const field = fields.find(o => o.name === feedbackField);
        if (field) {
            console.log("Field ID selected is", field.id);
            let barChartData = [];
            courses.forEach((course) => {
                if (course.feedback && course.feedback.length > 0) {
                    let sum = 0;
                    course.feedback.forEach((entry) => {
                        sum += entry[field.id];
                    });
                    let avg = sum / course.feedback.length;
                    barChartData.push({
                        name: course.name,
                        score: avg,
                        courseCode: course.courseCode
                    });
                }
            });
            if (barChartData && barChartData.length > 0) {
                setBarChartData(barChartData);
            }
        }
    };

    const startSetActiveFeedback = (courses, name) => {
        setActiveCourse(name);
        const course = courses.find(o => o.courseCode === name);
        if (course) {
            let feedback = course.feedback;
            if (feedback) {
                setActiveFeedback(feedback);
            }
        }
    };

    useEffect(() => {
        getAnalysis();
    }, []);

    useEffect(() => {
        if (courses && courses.length > 0) {
            startSetActiveFeedback(courses, courses[0].courseCode);
            startSetDashboardData(courses);
            startFieldWiseBarChart(courses, feedbackField);
        }
    }, [courses]);

    useEffect(() => {
        if (courses && courses.length > 0) {
            startFieldWiseBarChart(courses, feedbackField);
        }
    }, [feedbackField]);

    return (
        <Root style={{ marginTop: 30, width: "90%", marginLeft: "auto", marginRight: "auto" }}>

            <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", marginBottom: 20, marginTop: 20 }} >

                <Grid container className={classes.root} spacing={2} justifyContent="center" >
                    <Grid item xs={12} >
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                    backgroundColor: colors.primary,
                                    transition: "0.3s",
                                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                    "&:hover": {
                                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                                    },
                                    borderRadius: 30,
                                }}>
                                    <Typography style={{ fontSize: 17, fontWeight: "bold" }}>Courses Added</Typography>
                                    <Typography>{totalCourses}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                    backgroundColor: colors.primary,
                                    transition: "0.3s",
                                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                    "&:hover": {
                                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                                    },
                                    borderRadius: 30,
                                }}>
                                    <Typography style={{ fontSize: 17, fontWeight: "bold" }}>Feedback Recieved</Typography>
                                    <Typography>{totalFeedback}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                    backgroundColor: colors.primary,
                                    transition: "0.3s",
                                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                    "&:hover": {
                                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                                    },
                                    borderRadius: 30,
                                }}>
                                    <Typography style={{ fontSize: 17, fontWeight: "bold" }}>Highest Rated Course</Typography>
                                    <Typography>{truncateText(topRated, 30)}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <Card style={{
                                    padding: 20,
                                    backgroundColor: colors.primary,
                                    transition: "0.3s",
                                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                    "&:hover": {
                                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                                    },
                                    borderRadius: 30,
                                }}>
                                    <Typography style={{ fontSize: 17, fontWeight: "bold" }}>Most Reviewed Course</Typography>
                                    <Typography >{truncateText(mostReviews, 30)}</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>


            </div>


            {courses && courses.length > 0 ?
                <Card style={{
                    width: "100%",
                    marginBottom: 20,
                    marginTop: 40,
                    padding: 20,
                    overflowX: "scroll",
                    marginBottom: 50,
                    transition: "0.3s",
                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                    "&:hover": {
                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                    },
                    borderRadius: 30,
                    padding: 30,
                    paddingTop: 40
                }} >
                    <Select
                        labelId="field-select-label"
                        id="field-select"
                        value={feedbackField}
                        onChange={(e) => setFeedbackField(e.target.value)}
                        variant="outlined"
                        style={{ width: "100%", marginBottom: 30, textAlign: "left" }}
                    >
                        {fields.map((val) => <MenuItem value={val.name}>{val.name}</MenuItem>)}
                    </Select>

                    {barChartData && barChartData.length > 0 ?
                        <CourseBarRanks data={barChartData} />
                        :
                        null
                    }

                </Card>
                :
                null
            }


            {courses && courses.length > 0 ?
                <Card style={{
                    width: "100%",
                    marginBottom: 20,
                    marginTop: 20,
                    padding: 20,
                    maxWidth: "100%",
                    marginBottom: 50,
                    transition: "0.3s",
                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                    "&:hover": {
                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                    },
                    borderRadius: 30,
                    padding: 30,
                    paddingTop: 30
                }} >
                    <Select
                        labelId="field-select-label"
                        id="field-select"
                        value={activeCourse}
                        onChange={(e) => startSetActiveFeedback(courses, e.target.value)}
                        variant="outlined"
                        style={{ width: "100%", marginBottom: 30, textAlign: "left" }}
                    >
                        {courses.map((val) => <MenuItem value={val.courseCode}>{val.courseCode}</MenuItem>)}
                    </Select>



                    <FeedbackTable feedback={activefeedback} />


                </Card>
                :
                null
            }

        </Root>
    );
}
export default withRouter(Analysis);