import React, { useState, useEffect } from "react";
import classes from "./GiveFeedback.module.css";
import { useLocation, withRouter } from "react-router-dom";
import {
    Card,
    CardContent,
    Button,
    Typography,
    TextField,
    Slider,
} from "@mui/material";
import { useSelector } from "react-redux";
import firebase from "../firebaseHandler";
const db = firebase.firestore();

const GiveFeedback = (props) => {
    const { history } = props;
    const user = useSelector((state) => state.auth.userData);
    const location = useLocation();
    const params = location.state;
    const course = params.courseDetails;
    const [instructor, setInstructor] = useState(1);
    const [overall, setOverall] = useState(1);
    const [content, setContent] = useState(1);
    const [punctuality, setPunctuality] = useState(1);
    const [additional, setAdditional] = useState("");
    const [query, setQuery] = useState(1);
    const [edit, setEdit] = useState(false);
    const [editccode, setEditccode] = useState("");

    const marks = [
        {
            value: 1,
            label: "1",
        },
        {
            value: 3,
            label: "3",
        },
        {
            value: 5,
            label: "5",
        },
    ];

    const handleAddFeedback = () => {
        const datePosted = Date.now();
        const toAdd = {
            uid: user.uid,
            courseCode: course ? course.courseCode : editccode,
            instructor,
            overall,
            content,
            punctuality,
            additional,
            query,
            datePosted,
        };
        if (edit) {
            db.collection("feedback")
                .doc(params.feedbackDetails.id)
                .set(toAdd)
                .then(() => {
                    console.log("Feedback Add Success");
                    history.push("/profile");
                })
                .catch((error) => {
                    console.log("Feedback Add Failure", error);
                });
        } else {
            db.collection("feedback")
                .add(toAdd)
                .then(() => {
                    console.log("Feedback Add Success");
                    history.push("/profile");
                })
                .catch((error) => {
                    console.log("Feedback Add Failure", error);
                });
        }
    };

    const getEditableDetails = (feedbackDetails) => {
        console.log("Feedback details are", feedbackDetails);
        setEditccode(feedbackDetails.courseCode);
        setEdit(true);
        setInstructor(Number(feedbackDetails.instructor));
        setOverall(Number(feedbackDetails.overall));
        setContent(Number(feedbackDetails.content));
        setPunctuality(Number(feedbackDetails.punctuality));
        setAdditional(feedbackDetails.additional);
        setQuery(Number(feedbackDetails.query));
    };

    useEffect(() => {
        if (!user) {
            history.push("/");
        } else {
            if (user.userType === "Faculty") {
                history.push("/dashboard");
            } else {
                if (params.feedbackDetails) {
                    getEditableDetails(params.feedbackDetails);
                }
            }
        }
    }, []);

    return (
        <div className={classes.GiveFeedbackcontainer}>
            <Card
                style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: 20,
                    marginBottom: 50,
                    transition: "0.3s",
                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                    "&:hover": {
                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                    },
                    borderRadius: 30,
                    padding: 20,
                    paddingTop: 30,
                }}
            >
                <CardContent>
                    {course && (
                        <div>
                            <Typography color="textSecondary" gutterBottom>
                                {course.courseCode}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {course.name}
                            </Typography>
                            <Typography color="textSecondary">
                                {course.instructorName} -{" "}
                                {course.instructorEmail}
                            </Typography>
                        </div>
                    )}

                    {edit && (
                        <Typography variant="h5" component="h2">
                            {editccode}
                        </Typography>
                    )}

                    <div style={{ marginTop: 30 }}>
                        <Typography
                            variant="p"
                            component="p"
                            style={{ textAlign: "left", fontSize: 20 }}
                        >
                            How relevant was the content provided in accordance
                            with the course?
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
                                marginTop: 40,
                            }}
                            value={content}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography
                            variant="p"
                            component="p"
                            style={{ textAlign: "left", fontSize: 20 }}
                        >
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
                                marginTop: 40,
                            }}
                            value={punctuality}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography
                            variant="p"
                            component="p"
                            style={{ textAlign: "left", fontSize: 20 }}
                        >
                            How interactive were the classes in terms of doubts
                            resolved?
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
                                marginTop: 40,
                            }}
                            value={query}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography
                            variant="p"
                            component="p"
                            style={{ textAlign: "left", fontSize: 20 }}
                        >
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
                                marginTop: 40,
                            }}
                            value={instructor}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography
                            variant="p"
                            component="p"
                            style={{ textAlign: "left", fontSize: 20 }}
                        >
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
                                marginTop: 40,
                            }}
                            value={overall}
                        />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Typography
                            variant="p"
                            component="p"
                            style={{ textAlign: "left", fontSize: 20 }}
                        >
                            Additional comments (if any)
                        </Typography>
                        <TextField
                            variant="outlined"
                            onChange={(e) => setAdditional(e.target.value)}
                            style={{
                                width: "100%",
                                marginTop: 20,
                            }}
                            value={additional}
                            multiline={true}
                            rows={4}
                        />
                    </div>
                </CardContent>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: 20, marginTop: 20 }}
                    onClick={handleAddFeedback}
                >
                    {edit ? "Edit" : "Give"} Feedback
                </Button>
            </Card>
        </div>
    );
};
export default withRouter(GiveFeedback);
