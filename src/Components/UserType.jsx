import React, { useEffect, useState } from 'react';
import { Select, Button, MenuItem, TextField, Card } from '@material-ui/core';
import firebase from "../firebaseHandler";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { saveUserData } from "../redux/actions";
const db = firebase.firestore();

const allUserTypes = [
    "Student",
    "Faculty",
    "Parents",
    "Alumni",
    "Industry Personel"
];

const UserType = (props) => {
    const { history } = props;
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.userData);
    const [userType, setUserType] = useState(user && user.userType ? user.userType : "Student");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");


    const handleUserTypeChange = () => {
        if (user) {
            db.collection("users").doc(user.uid).set({
                userType: userType,
                email: email == "" ? user.email : email,
                username: displayName == "" ? user.displayName : displayName
            }, { merge: true }).then(() => {
                console.log("Changed usertype to", userType);
                history.push("/dashboard");
                window.location.reload();
            }).catch((err) => {
                console.log("Could not change user-type", err);
            });
        }
    };

    useEffect(() => {
        if (!user) {
            history.push("/");
        }
        else {
            console.log("User in usertype selection", user)
        }
    }, []);

    return (
        <Card style={{
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 40,
            padding: 20,
            paddingLeft: "5%",
            paddingRight: "5%",
            marginBottom: 50,
            transition: "0.3s",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
            "&:hover": {
                boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
            },
            borderRadius: 30,
            padding: 20,
            paddingTop: 30
        }}>
            <p style={{ fontSize: 30, marginBottom: 30 }}>Help us know you better.</p>
            <p style={{ fontSize: 15 }}>Who are you?</p>

            {!user.displayName || user.displayName == "" ?
                <TextField
                    id="name"
                    label="Name"
                    placeholder="Enter your name"
                    variant="outlined"
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                        width: "100%",
                        marginTop: 20
                    }}
                />
                : null
            }

            {!user.email || user.email == "" ?
                <TextField
                    id="email"
                    label="Email"
                    placeholder="Enter your email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        marginTop: 20,
                        marginBottom: 20
                    }}
                />
                : null
            }
            <Select
                labelId="userType-select-label"
                id="userType-select"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                variant="outlined"
                style={{ width: "100%", marginBottom: 30, textAlign: "left" }}
            >
                {allUserTypes.map((val) => <MenuItem value={val}>{val}</MenuItem>)}
            </Select>
            <br></br>
            <Button style={{ width: "20%", marginBottom: 20 }} variant="contained" color="primary" onClick={handleUserTypeChange}>
                Save
            </Button>
        </Card>
    );


};


export default withRouter(UserType);