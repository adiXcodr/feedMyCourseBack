import React from 'react';
import classes from './GiveFeedback.module.css';
import { useLocation } from 'react-router-dom';

const GiveFeedback = (props) => {
    const location = useLocation();
    const params = location.state;
    const courseDetails = params.courseDetails;
    return (
        <div className={classes.GiveFeedbackcontainer}>
            <p>Add your feedback for {courseDetails.name}</p>
        </div>

    );
}
export default GiveFeedback;