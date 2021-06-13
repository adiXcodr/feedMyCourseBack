import React from 'react';
import classes from './GiveFeedback.module.css';
import { useLocation } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, TextField } from '@material-ui/core';

const GiveFeedback = (props) => {
    const location = useLocation();
    const params = location.state;
    const course = params.courseDetails;
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
                <Button size="small" variant="contained" color="primary" style={{marginBottom:20}} onClick={() => console.log("Give Feedback Pushed")}>
                    Send
                </Button>
            </Card>
        </div>

    );
}
export default GiveFeedback;