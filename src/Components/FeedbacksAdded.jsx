import React, { useState, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, Badge, Divider } from '@mui/material';
import { useSelector } from "react-redux";
import firebase from "../firebaseHandler";
import moment from "moment";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
const db = firebase.firestore();

const FeedbackAdded = (props) => {
    const { history } = props;
    const location = useLocation();
    const params = location.state;
    const user = useSelector((state) => state.auth.userData);
    const [feedbacks, setFeedback] = useState([]);


    const getFeedbackAdded = () => {
        db.collection("feedback").where("uid", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                let feedback = [];
                querySnapshot.forEach((doc) => {
                    let obj = doc.data();
                    obj.id = doc.id;
                    feedback.push(obj);
                });
                console.log("Got added feedback", feedback);
                setFeedback(feedback);
            })
            .catch((error) => {
                console.log("Error getting added feedback: ", error);
            });
    };

    useEffect(() => {
        getFeedbackAdded();
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
                        Feedback Added
                    </Typography>

                    {feedbacks && feedbacks.length > 0 ?
                        feedbacks.map((feedback, idx) =>
                            <div style={{ marginTop: 30 }}>

                                <Typography style={{ fontSize: 20 }}>
                                    {feedback.courseCode}
                                </Typography>

                                <Typography >
                                    Overall Score : {feedback.overall}
                                </Typography>

                                <Typography >
                                    Added {moment(feedback.datePosted).fromNow()}
                                </Typography>

                                {user.uid == feedback.uid ?
                                    <CardActions>
                                        <Button size="small" onClick={() => history.push({
                                            pathname: "/dashboard/giveFeedback",
                                            state: { courseDetails: null, feedbackDetails: feedback }
                                        })}>Edit Feedback</Button>
                                    </CardActions>
                                    :
                                    null}

                                {idx != feedbacks.length - 1 &&
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
export default withRouter(FeedbackAdded);