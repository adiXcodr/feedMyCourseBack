import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { saveUserData, setAuth } from "../redux/actions";
import { useTheme } from "@mui/material/styles";
import { Route, Link, Switch, withRouter } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import firebase from "../firebaseHandler";
import Landing from "../Containers/Landing";
import Dashboard from "../Containers/Dashboard";
import GiveFeedback from "./GiveFeedback";
import AddCourse from "./AddCourse";
import Analysis from "../Containers/Analysis";
import UserType from "./UserType";
import Profile from "../Containers/Profile";
import logo from "../Resources/Images/feedifyLogo.png";

const PREFIX = "SideBar";

const classes = {
    root: `${PREFIX}-root`,
    appBar: `${PREFIX}-appBar`,
    appBarShift: `${PREFIX}-appBarShift`,
    menuButton: `${PREFIX}-menuButton`,
    hide: `${PREFIX}-hide`,
    drawer: `${PREFIX}-drawer`,
    drawerOpen: `${PREFIX}-drawerOpen`,
    drawerClose: `${PREFIX}-drawerClose`,
    toolbar: `${PREFIX}-toolbar`,
    content: `${PREFIX}-content`,
};

const Root = styled("div")(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: "flex",
    },

    [`& .${classes.appBar}`]: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    [`& .${classes.appBarShift}`]: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    [`& .${classes.menuButton}`]: {
        marginRight: 36,
    },

    [`& .${classes.hide}`]: {
        display: "none",
    },

    [`& .${classes.drawer}`]: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },

    [`& .${classes.drawerOpen}`]: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    [`& .${classes.drawerClose}`]: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1,
        },
    },

    [`& .${classes.toolbar}`]: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },

    [`& .${classes.content}`]: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const drawerWidth = 240;

function MiniDrawer(props) {
    const { loading, history } = props;
    const loggedin = useSelector((state) => state.auth.loggedin);
    const user = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [minWidth, setMinWidth] = useState("1224px");

    const handleDrawerOpen = () => {
        setMinWidth("0px");
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setMinWidth("1224px");
        setOpen(false);
    };

    const singOutUser = () => {
        firebase
            .auth()
            .signOut()
            .then(async () => {
                await localStorage.clear();
                dispatch(setAuth(false));
                dispatch(saveUserData(null));
                // history.push("/");
                window.location.reload();
            })
            .catch(function (error) {
                // An error happened.
            });
    };

    const isDesktopOrLaptop = useMediaQuery({
        query: `(min-width: ${minWidth})`,
    });

    return (
        <Root className={classes.root}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
                color="inherit"
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                        size="large"
                    >
                        {/* <MenuIcon /> */}
                        <Avatar
                            alt={"FF"}
                            src={logo}
                            style={{ width: 40, height: 40 }}
                        />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        style={{ fontWeight: "bold" }}
                    >
                        FEEDIFY
                    </Typography>
                </Toolbar>
            </AppBar>

            {isDesktopOrLaptop && (
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <Typography variant="h6" noWrap>
                            Menu
                        </Typography>
                        <IconButton onClick={handleDrawerClose} size="large">
                            {theme.direction === "rtl" ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </div>

                    <Divider />
                    {loggedin ? (
                        <List>
                            <ListItem
                                button
                                key={"Dashboard"}
                                onClick={() => history.push("/dashboard")}
                            >
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Dashboard"} />
                            </ListItem>

                            {user && user.userType == "Faculty" && (
                                <ListItem
                                    button
                                    key={"Report"}
                                    onClick={() => history.push("/analysis")}
                                >
                                    <ListItemIcon>
                                        <EqualizerIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={"Report"} />
                                </ListItem>
                            )}
                            <ListItem
                                button
                                key={"Profile"}
                                onClick={() => history.push("/profile")}
                            >
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Profile"} />
                            </ListItem>
                        </List>
                    ) : (
                        <List>
                            <ListItem
                                button
                                key={"Home"}
                                onClick={() => history.push("/")}
                            >
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Home"} />
                            </ListItem>
                        </List>
                    )}
                    <Divider />

                    {loggedin && (
                        <List>
                            <ListItem
                                button
                                key={"Log Out"}
                                onClick={singOutUser}
                            >
                                <ListItemIcon>
                                    <MeetingRoomIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Log Out"} />
                            </ListItem>
                        </List>
                    )}
                </Drawer>
            )}

            <div style={{ marginTop: "10vh", width: "100%" }}>
                <Switch>
                    <Route
                        path="/"
                        exact
                        render={() => (
                            <Landing
                                loading={loading}
                                loggedin={loggedin}
                                user={user}
                            />
                        )}
                    />
                    <Route
                        path="/dashboard"
                        exact
                        render={() => (
                            <Dashboard
                                loading={loading}
                                loggedin={loggedin}
                                user={user}
                            />
                        )}
                    />
                    <Route
                        path="/analysis"
                        exact
                        render={() => (
                            <Analysis
                                loading={loading}
                                loggedin={loggedin}
                                user={user}
                            />
                        )}
                    />
                    <Route
                        path="/changeUsertype"
                        exact
                        render={() => (
                            <UserType
                                loading={loading}
                                loggedin={loggedin}
                                user={user}
                            />
                        )}
                    />
                    <Route
                        path="/dashboard/giveFeedback"
                        exact
                        render={() => (
                            <GiveFeedback
                                loading={loading}
                                loggedin={loggedin}
                                user={user}
                            />
                        )}
                    />
                    <Route
                        path="/addCourse"
                        exact
                        render={() => (
                            <AddCourse
                                loading={loading}
                                loggedin={loggedin}
                                user={user}
                            />
                        )}
                    />
                    <Route
                        path="/profile"
                        exact
                        render={() => (
                            <Profile
                                loading={loading}
                                loggedin={loggedin}
                                user={user}
                            />
                        )}
                    />
                </Switch>
            </div>
        </Root>
    );
}

export default withRouter(MiniDrawer);
