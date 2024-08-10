import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserContext from './contexts/UserContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserEvents from './pages/UserEvents';
import AddUserEvent from './pages/AddUserEvent';
import AddUser from './pages/AddUser.jsx'
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
import EditUser from './pages/EditUser.jsx'
import EditSignUp from './pages/EditSignUp';
import Reports from './pages/Reports';
import AddReport from './pages/AddReport';
import EditReport from './pages/EditReport';
import AdminECManagement from './pages/AdminECManagement';
import Register from './pages/Register';
import Login from './pages/Login';
import AboutUs from './pages/aboutus'; 
import Footer from './footer.jsx';
import http from './http';
import RequestOtp from './pages/RequestOtp';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';


function App() {
  const [user, setUser] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [colorMenuAnchorEl, setColorMenuAnchorEl] = useState(null);
  const [themeColor, setThemeColor] = useState('#4caf50'); // Default green

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

  const handleColorMenuClick = (event) => {
    setColorMenuAnchorEl(event.currentTarget);
  };

  const handleColorMenuClose = (color) => {
    setThemeColor(color);
    setColorMenuAnchorEl(null);
    localStorage.setItem('themeColor', color); // Persist theme color
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

  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
      setThemeColor(savedColor);
    }
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: themeColor,
      },
    },
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={theme}>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Container style={{ display: 'flex', alignItems: 'center' }} maxWidth="xl">
                    <img src="../ECOV3.png" alt="Logo" style={{ marginRight: '5px', height: '50px', display: 'flex' }} />
                    <Typography variant="h6" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                      ECOVERSE
                    </Typography>
                  </Container>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>

                {/* Color Theme Selector */}
                {user && user.role === 'admin' && (
                  <Button
                    aria-controls="color-menu"
                    aria-haspopup="true"
                    onClick={handleColorMenuClick}
                    style={{ marginLeft: '15px' }}
                  >
                    Change Theme
                  </Button>
                )}
                <Menu
                  id="color-menu"
                  anchorEl={colorMenuAnchorEl}
                  open={Boolean(colorMenuAnchorEl)}
                  onClose={() => setColorMenuAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleColorMenuClose('#4caf50')}>Green</MenuItem>
                  <MenuItem onClick={() => handleColorMenuClose('#2196f3')}>Blue</MenuItem>
                  <MenuItem onClick={() => handleColorMenuClose('#f44336')}>Red</MenuItem>
                  <MenuItem onClick={() => handleColorMenuClose('#9c27b0')}>Purple</MenuItem>
                </Menu>

                {user && user.role === 'admin' ? (
                  <>
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
                        <Link to="/reports" style={{ textDecoration: 'none', color: 'inherit' }}>
                          View all reports
                        </Link>
                      </MenuItem>
                    </Menu>

                    <Button onClick={logout}>Logout</Button>
                  </>
                ) : (

                  user && (
                    <>
                      {/* User Dropdown */}
                      <Button
                        aria-controls="user-menu"
                        aria-haspopup="true"
                        onClick={handleUserMenuClick}
                        style={{ marginLeft: 'auto' }}
                      >
                        <Typography>{user.name}</Typography>
                      </Button>
                      <Menu
                        id="user-menu"
                        anchorEl={userAnchorEl}
                        open={Boolean(userAnchorEl)}
                        onClose={handleUserMenuClose}
                      >
                        <MenuItem onClick={handleUserMenuClose}>
                          <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Profile
                          </Link>
                        </MenuItem>

                        <MenuItem onClick={handleUserMenuClose}>
                          <Link to="/AddUserEvent" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Add Your Own Events
                          </Link>
                        </MenuItem>

                        <MenuItem onClick={handleUserMenuClose}>
                          <Link to="/Courses" style={{ textDecoration: 'none', color: 'inherit' }}>
                            All Courses
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleUserMenuClose}>
                          <Link to="/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                            All Events
                          </Link>
                        </MenuItem>

                        <MenuItem onClick={handleUserMenuClose}>
                          <Link to="/AddReport" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Add Reports
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleAdminMenuClose}>
                        <Link to="/UserEvent" style={{ textDecoration: 'none', color: 'inherit' }}>
                          Your Added Events
                        </Link>
                      </MenuItem>
                      </Menu>
                      <Button onClick={logout}>Logout</Button>
                    </>
                  )
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
          {location.pathname === '/' && (
            <div className='hero-container'>
              <div className="text-container">
                <h1 className="title">Welcome to EcoVerse</h1>
                <p className="description">Empowering our community with sustainable living practices.</p>
                <p>Click here to find out more!</p>
                <button className="explore-button">Explore</button>
              </div>
            </div>
          )}

          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/UserEvent" element={<UserEvents />} />
              <Route path="/AddUserEvent" element={<AddUserEvent />} />
              <Route path="/EditUserEvent/:id" element={<EditUserEvent />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/AddSignUp" element={<AddSignUp />} />
              <Route path="/AddSignUpEvent" element={<AddSignUpEvent />} />
              <Route path="/SignUps" element={<SignUps />} />
              <Route path="/AddCourse" element={<AddCourse />} />
              <Route path="/AddUser" element={<AddUser />} />
              <Route path="/Courses" element={<Courses />} />
              <Route path="/course-details/:id" element={<CourseDetails />} />
              <Route path="/UserCourseDetails/:id" element={<UserCourseDetails />} />
              <Route path="/edit-course/:id" element={<EditCourse />} />
              <Route path="/AddEvent" element={<AddEvent />} />
              <Route path="/Events" element={<Events />} />
              <Route path="/event-details/:id" element={<EventDetails />} />
              <Route path="/UserEventDetails/:id" element={<UserEventDetails />} />
              <Route path="/edit-event/:id" element={<EditEvent />} />
              <Route path="/edituser/:id" element={<EditUser />} />
              <Route path="/EditSignUp/:id" element={<EditSignUp />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/addreport" element={<AddReport />} />
              <Route path="/editreport/:id" element={<EditReport />} />
              <Route path="/AdminECManagement" element={<AdminECManagement />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/aboutus" element={<AboutUs />} />
              {/* <Route path="/request-otp" element={<RequestOtp />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} /> */}
            </Routes>
          </Container>
          <Footer />
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
