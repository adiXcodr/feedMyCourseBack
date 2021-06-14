import React, { useState, useEffect } from 'react';
import classes from './GiveFeedback.module.css';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';

const GiveFeedback = (props) => {
    const { history } = props;
    const user = useSelector((state) => state.auth.userData);
    const loggedin = useSelector((state) => state.auth.loggedin);
    const location = useLocation();
    const params = location.state;
    const course = params.courseDetails;

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
            <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: 20 }} >

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

                </CardContent>
                <Button variant="contained" color="primary" style={{ marginBottom: 20 }} onClick={() => console.log("Give Feedback Pushed")}>
                    Give Feedback
                </Button>
            </Card>
        </div>

    );
}
export default withRouter(GiveFeedback);