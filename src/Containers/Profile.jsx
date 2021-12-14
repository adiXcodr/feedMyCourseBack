import React from 'react';
import { useLocation, withRouter, Redirect } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, TextField, Avatar } from '@mui/material';
import { useSelector } from "react-redux";
import CoursesAdded from '../Components/CoursesAdded';
import FeedbacksAdded from '../Components/FeedbacksAdded';

const GiveFeedback = (props) => {
    const { history } = props;
    const location = useLocation();
    const params = location.state;
    const user = useSelector((state) => state.auth.userData);
    if (!user) {
        return (
            <Redirect to="/" />
        );
    }
    else {
        return (
            <div style={{ marginTop: 30 }}>

                <Card style={{
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: 50,
                    padding: 20,
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
                        <Avatar alt={user.displayName} src={user.photoURL} style={{ width: 100, height: 100, marginLeft: "auto", marginRight: "auto", marginBottom: 20 }} />
                        <Typography variant="h5" component="h2">
                            {user.displayName}
                        </Typography>
                        <Typography color="textSecondary">
                            {user.email || user.phoneNumber}
                        </Typography>

                        <Typography color="textSecondary">
                            {user.userType}
                        </Typography>

                        <Button size="small" variant="contained" color="primary" style={{ marginTop: 20 }} onClick={() => history.push("/changeUsertype")}>
                            Change
                        </Button>
                    </CardContent>

                </Card>

                {user.userType == "Faculty" ?
                    <CoursesAdded />
                    :
                    <FeedbacksAdded />
                }

            </div>

        );
    }

}
export default withRouter(GiveFeedback);