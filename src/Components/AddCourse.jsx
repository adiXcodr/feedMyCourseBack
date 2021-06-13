import React from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { Card, CardActions, CardContent, Button, Typography, TextField } from '@material-ui/core';

const AddCourse = (props) => {
    const { history } = props;
    const location = useLocation();
    const params = location.state;
    return (
        <div>
            <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: 20 }} >

                <CardContent>
                    <Typography variant="h5" component="h2">
                        Add Course Details
                    </Typography>


                </CardContent>
                <Button size="small" variant="contained" color="primary" style={{ marginBottom: 20 }} onClick={() => console.log("Add Course")}>
                    Add
                </Button>
            </Card>
        </div >

    );
}
export default withRouter(AddCourse);