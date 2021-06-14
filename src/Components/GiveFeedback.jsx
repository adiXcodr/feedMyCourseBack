import React, { useState, useEffect } from 'react';
import classes from './GiveFeedback.module.css';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, TextField, Slider, Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import firebase from "../firebaseHandler";
const db = firebase.firestore();

const GiveFeedback = (props) => {
    const { history } = props;
    const user = useSelector((state) => state.auth.userData);
    const loggedin = useSelector((state) => state.auth.loggedin);
    const location = useLocation();
    const params = location.state;
    const course = params.courseDetails;
    const [instructor, setInstructor] = useState(1);
    const [overall, setOverall] = useState(1);
    const [content, setContent] = useState(1);
    const [punctuality, setPunctuality] = useState(1);
    const [additional, setAdditional] = useState("");
    const [query, setQuery] = useState(1);

    const marks = [
        {
            value: 1,
            label: '1',
        },
        {
            value: 3,
            label: '3',
        },
        {
            value: 5,
            label: '5',
        }
    ];

    const handleAddFeedback = () => {
        const datePosted = Date.now();
        const toAdd = {
            uid: user.uid,
            courseCode: course.courseCode,
            instructor,
            overall,
            content,
            punctuality,
            additional,
            query,
            datePosted
        };
        db.collection("feedback").add(toAdd)
            .then(() => {
                console.log("Feedback Add Success");
                history.push("/profile");
            })
            .catch((error) => {
                console.log("Feedback Add Failure", error);
            });
    };


    useEffect(() => {
        if (!user) {
            history.push("/");
        }
        else {
            if (user.userType == "Faculty") {
                history.push("/dashboard");
            }
        }
    }, []);

    return (
        <div className={classes.GiveFeedbackcontainer}>
            <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: 20, padding: 20 }} >

                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        {course.courseCode}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {course.name}
                    </Typography>
                    <Typography color="textSecondary">
                        {course.instructorName} - {course.instructorEmail}
                    </Typography>

                    <div style={{ marginTop: 30 }}>
                        <Typography variant="p" component="p" style={{ textAlign: "left", fontSize: 20 }}>
                            How relevant was the content provided in accordance with the course?
                        </Typography>
                        <Slider
                            defaultValue={1}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks={marks}
                            valueLabelDisplay="on"
                            max={5}
                            min={1}
                            onChange={(e, val) => setContent(val)}
                            style={{
                                marginTop: 40
                            }}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography variant="p" component="p" style={{ textAlign: "left", fontSize: 20 }}>
                            How regular were the classes held?
                        </Typography>
                        <Slider
                            defaultValue={1}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks={marks}
                            valueLabelDisplay="on"
                            max={5}
                            min={1}
                            onChange={(e, val) => setPunctuality(val)}
                            style={{
                                marginTop: 40
                            }}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography variant="p" component="p" style={{ textAlign: "left", fontSize: 20 }}>
                            How interactive were the classes in terms of doubts resolved?
                        </Typography>
                        <Slider
                            defaultValue={1}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks={marks}
                            valueLabelDisplay="on"
                            max={5}
                            min={1}
                            onChange={(e, val) => setQuery(val)}
                            style={{
                                marginTop: 40
                            }}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography variant="p" component="p" style={{ textAlign: "left", fontSize: 20 }}>
                            How would you rate the instructor?
                        </Typography>
                        <Slider
                            defaultValue={1}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks={marks}
                            valueLabelDisplay="on"
                            max={5}
                            min={1}
                            onChange={(e, val) => setInstructor(val)}
                            style={{
                                marginTop: 40
                            }}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography variant="p" component="p" style={{ textAlign: "left", fontSize: 20 }}>
                            Please share your overall experience with the course
                        </Typography>
                        <Slider
                            defaultValue={1}
                            aria-labelledby="discrete-slider-always"
                            step={1}
                            marks={marks}
                            valueLabelDisplay="on"
                            max={5}
                            min={1}
                            onChange={(e, val) => setOverall(val)}
                            style={{
                                marginTop: 40
                            }}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography variant="p" component="p" style={{ textAlign: "left", fontSize: 20 }}>
                            Additional comments (if any)
                        </Typography>
                        <TextField
                            variant="outlined"
                            onChange={(e) => setAdditional(e.target.value)}
                            style={{
                                width: "100%",
                                marginTop: 20
                            }}
                            value={additional}
                            multiline={true}
                            rows={4}
                        />
                    </div>

                </CardContent>
                <Button variant="contained" color="primary" style={{ marginBottom: 20, marginTop: 20 }} onClick={handleAddFeedback}>
                    Give Feedback
                </Button>
            </Card>
        </div>

    );
}
export default withRouter(GiveFeedback);