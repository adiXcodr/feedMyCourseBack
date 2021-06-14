import React, { useState, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';
import firebase from "../firebaseHandler";
const db = firebase.firestore();

const AddCourse = (props) => {
    const { history } = props;
    const user = useSelector((state) => state.auth.userData);
    const loggedin = useSelector((state) => state.auth.loggedin);
    const location = useLocation();
    const params = location.state;
    const [name, setName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [instructorName, setInstructorName] = useState("");
    const [courseCredits, setCourseCredits] = useState("0");
    const [instructorEmail, setInstructorEmail] = useState("");

    const handleAddCourse = () => {
        const datePosted = Date.now();
        const toAdd = {
            name,
            courseCode,
            instructorName,
            courseCredits,
            instructorEmail,
            datePosted
        };
        db.collection("courses").doc(courseCode).set(toAdd)
            .then(() => {
                console.log("Course Add Success");
                history.push("/dashboard");
            })
            .catch((error) => {
                console.log("Course Add Failure", error);
            });

    };

    useEffect(() => {
        if (!user) {
            history.push("/");
        }
        else {
            if (user.userType != "Faculty") {
                history.push("/dashboard");
            }
            setInstructorName(user.displayName);
            setInstructorEmail(user.email);
        }
    }, []);

    return (
        <div>
            <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginTop: 30, padding: 20 }} >

                <CardContent>
                    <Typography variant="h5" component="h2">
                        Add Course Details
                    </Typography>

                    <TextField
                        id="courseName"
                        label="Course Name"
                        placeholder="Enter the course name"
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: "100%",
                            marginTop: 20
                        }}
                        value={name}
                    />

                    <TextField
                        id="courseCode"
                        label="Course Code"
                        placeholder="Enter the course code"
                        variant="outlined"
                        onChange={(e) => setCourseCode(e.target.value)}
                        style={{
                            width: "100%",
                            marginTop: 20
                        }}
                        value={courseCode}
                    />


                    <TextField
                        id="courseCredits"
                        label="Course Credits"
                        placeholder="Enter the number of credits"
                        variant="outlined"
                        onChange={(e) => setCourseCredits(e.target.value)}
                        style={{
                            width: "100%",
                            marginTop: 20
                        }}
                        value={courseCredits}
                    />


                </CardContent>
                <Button variant="contained" color="primary" style={{ marginBottom: 20, marginTop: 20 }} onClick={handleAddCourse}>
                    Add Course
                </Button>
            </Card>
        </div >

    );
}
export default withRouter(AddCourse);