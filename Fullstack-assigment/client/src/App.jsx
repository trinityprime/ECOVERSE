import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import UserEvents from './pages/UserEvents';
import AddUserEvent from './pages/AddUserEvent';
import EditUserEvent from './pages/EditUserEvent';
import SuccessPage from './pages/SuccessPage';
import AddSignUp from './pages/AddSignUp';
import AddSignUpEvent from './pages/AddSignUpEvent';
import SignUps from './pages/SignUps';
import AddCourse from './pages/AddCourse';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import UserCourseDetails from './pages/UserCourseDetails';
import EditCourse from './pages/EditCourse';
import AddEvent from './pages/AddEvent';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import UserEventDetails from './pages/UserEventDetails';
import EditEvent from './pages/EditEvent';
import EditSignUp from './pages/EditSignUp';
import Reports from './pages/Reports';
import AddReport from './pages/AddReport';
import EditReport from './pages/EditReport';
import AdminECManagement from './pages/AdminECManagement';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserContext from './contexts/UserContext';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import Profile from './pages/Profile';
import Footer from './footer.jsx';

function App() {
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  const handleUserMenuClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleAdminMenuClick = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Container style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="../ECOV3.png" alt="Logo" style={{ marginRight: '5px', height: '30px', display: 'flex' }} />
                    <Typography variant="h6" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                      ECOVERSE
                    </Typography>
                  </Container>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>

                {/* User Dropdown */}
                <Button
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  onClick={handleUserMenuClick}
                  style={{ marginLeft: 'auto' }}
                >
                  User
                </Button>
                <Menu
                  id="user-menu"
                  anchorEl={userAnchorEl}
                  open={Boolean(userAnchorEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <Link to="/AddUserEvent" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Add Your Own Event
                    </Link>
                  </MenuItem>

                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/Courses" style={{ textDecoration: 'none', color: 'inherit' }}>
                      All Courses
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                      All Events
                    </Link>
                  </MenuItem>

                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/AddReport" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Add Report
                    </Link>
                  </MenuItem>
                </Menu>

                {/* Admin Dropdown */}
                <Button
                  aria-controls="admin-menu"
                  aria-haspopup="true"
                  onClick={handleAdminMenuClick}
                  style={{ marginLeft: '15px' }}
                >
                  Admin
                </Button>
                <Menu
                  id="admin-menu"
                  anchorEl={adminAnchorEl}
                  open={Boolean(adminAnchorEl)}
                  onClose={handleAdminMenuClose}
                >
                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/UserEvent" style={{ textDecoration: 'none', color: 'inherit' }}>
                      All user added event
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/SignUps" style={{ textDecoration: 'none', color: 'inherit' }}>
                      View all user signups
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/AddCourse" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Add Course
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/AddEvent" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Add Event
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/AdminECManagement" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Admin Management
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleAdminMenuClose}>
                    <Link to="/Reports" style={{ textDecoration: 'none', color: 'inherit' }}>
                      View all reports
                    </Link>
                  </MenuItem>
                </Menu>

                {user && (
                  <>
                    <Link to="/profile" style={{ marginLeft: '15px' }}>
                      <Typography>{user.name}</Typography>
                    </Link>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
                
                {!user && (
                  <>
                    <Link to="/register">
                      <Typography>Register</Typography>
                    </Link>
                    <Link to="/login">
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}

              </Toolbar>
            </Container>
          </AppBar>
          <Container>
            <Routes>
              <Route path={"/"} element={<UserEvents />} />
              <Route path={"/UserEvent"} element={<UserEvents />} />
              <Route path={"/SignUps"} element={<SignUps />} />
              <Route path={"/AddSignUpEvent"} element={<AddSignUpEvent />} />
              <Route path={"/AddUserEvent"} element={<AddUserEvent />} />
              <Route path={"/EditUserEvent/:id"} element={<EditUserEvent />} />
              <Route path={"/success"} element={<SuccessPage />} />
              <Route path={"/AddSignUp"} element={<AddSignUp />} />
              <Route path={"/AddCourse"} element={<AddCourse />} />
              <Route path={"/course-details/:id"} element={<CourseDetails />} />
              <Route path={"/Courses"} element={<Courses />} />
              <Route path={"/edit-course/:id"} element={<EditCourse />} />
              <Route path={"/addevent"} element={<AddEvent />} />
              <Route path={"/events"} element={<Events />} />
              <Route path={"/event-details/:id"} element={<EventDetails />} />
              <Route path={"/AdminECManagement"} element={<AdminECManagement />} />
              <Route path={"/edit-event/:id"} element={<EditEvent />} />
              <Route path={"/user-course-details/:id"} element={<UserCourseDetails />} />
              <Route path={"/user-event-details/:id"} element={<UserEventDetails />} />
              <Route path={"/EditSignUp/:id"} element={<EditSignUp />} />
              <Route path={"/reports"} element={<Reports />} />
              <Route path={"/addreport"} element={<AddReport />} />
              <Route path={"/editreport/:id"} element={<EditReport />} />
              <Route path={"/adduser"} element={<AddUser />} />
              <Route path={"/edituser/:id"} element={<EditUser />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/profile"} element={<Profile />} />
            </Routes>
          </Container>
          <Footer />
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;