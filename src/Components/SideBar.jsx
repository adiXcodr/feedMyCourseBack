import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from "react-redux";
import { saveUserData, setAuth } from "../redux/actions";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import HomeIcon from '@material-ui/icons/Home';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import firebase from "../firebaseHandler";
import Landing from "../Containers/Landing";
import Dashboard from "../Containers/Dashboard";
import GiveFeedback from "./GiveFeedback";
import AddCourse from "./AddCourse";
import UserType from './UserType';
import Profile from "../Containers/Profile";
import logo from "../Resources/Images/feedifyLogo.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    
}));

function MiniDrawer(props) {
    const { loading, loggedin, user, history } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const singOutUser = () => {
        firebase.auth().signOut().then(async () => {
            await localStorage.clear();
            dispatch(setAuth(false));
            dispatch(saveUserData(null));
            // history.push("/");
            window.location.reload();
        }).catch(function (error) {
            // An error happened.
        })
    };

    return (
        <div className={classes.root}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
                color="white"
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
                    >
                        {/* <MenuIcon /> */}
                        <Avatar alt={"FF"} src={logo} style={{ width: 40, height: 40 }} />
                    </IconButton>
                    <Typography variant="h6" noWrap style={{fontWeight:"bold"}}>
                        FEEDIFY
                    </Typography>
                </Toolbar>
            </AppBar>


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
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                {loggedin ?
                    <List>

                        <ListItem button key={"Dashboard"} onClick={() => history.push("/dashboard")}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary={"Dashboard"} />
                        </ListItem>
                        <ListItem button key={"Profile"} onClick={() => history.push("/profile")}>
                            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary={"Profile"} />
                        </ListItem>

                    </List>
                    :
                    <List>

                        <ListItem button key={"Home"} onClick={() => history.push("/")}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItem>

                    </List>
                }
                <Divider />
                {loggedin &&
                    <List>
                        <ListItem button key={"Log Out"} onClick={singOutUser}>
                            <ListItemIcon><MeetingRoomIcon /></ListItemIcon>
                            <ListItemText primary={"Log Out"} />
                        </ListItem>
                    </List>
                }
            </Drawer>

            <div style={{ marginTop: "10vh", width: "100%" }}>
                <Switch>
                    <Route path='/' exact render={() => <Landing loading={loading} loggedin={loggedin} user={user} />} />
                    <Route path='/dashboard' exact render={() => <Dashboard loading={loading} loggedin={loggedin} user={user} />} />
                    <Route path='/changeUsertype' exact render={() => <UserType loading={loading} loggedin={loggedin} user={user} />} />
                    <Route path='/dashboard/giveFeedback' exact render={() => <GiveFeedback loading={loading} loggedin={loggedin} user={user} />} />
                    <Route path='/addCourse' exact render={() => <AddCourse loading={loading} loggedin={loggedin} user={user} />} />
                    <Route path='/profile' exact render={() => <Profile loading={loading} loggedin={loggedin} user={user} />} />
                </Switch>

            </div>
        </div >
    );
}


export default withRouter(MiniDrawer);