import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import AdminECManagement from './pages/AdminECManagement'; // Correct path to AdminECManagement component
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvent';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import CourseDetails from './pages/CourseDetails';
import EditCourse from './pages/EditCourse';
import UserContext from './contexts/UserContext';
import { MdEvent, MdSchool } from 'react-icons/md'; // Import icons for events and courses
import http from './http'; // Assuming this is your HTTP service for API calls

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        console.log('Fetched user:', res.data.user); // Add console log here
        setUser(res.data.user);
        setIsAdmin(res.data.user.isAdmin); // Set isAdmin state based on user role
      }).catch((error) => {
        console.error('Error fetching user:', error);
        // Handle error fetching user
      });
    }
  }, []);

  useEffect(() => {
    console.log('User:', user); // Check user state
    console.log('Is Admin:', isAdmin); // Check isAdmin state
  }, [user, isAdmin]);

  const logout = () => {
    localStorage.clear();
    setUser(null); // Clear user state
    setIsAdmin(false); // Reset isAdmin state
    window.location = "/"; // Redirect to home after logout
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const adminLinks = (
    <List>
      <ListItem button component={Link} to="/AdminECManagement">
        <ListItemIcon><MdEvent /></ListItemIcon>
        <ListItemText primary="Go to Admin Page" />
      </ListItem>
      <ListItem button component={Link} to="/addcourse">
        <ListItemIcon><MdSchool /></ListItemIcon>
        <ListItemText primary="something else" />
      </ListItem>
    </List>
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="fixed" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="h6" component="div">
                    Learning
                  </Typography>
                </Link>
                <Link to="/tutorials" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '1rem' }}>
                  <Typography>Tutorials</Typography>
                </Link>
                <Link to="/events" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '1rem' }}>
                  <Typography>Events</Typography>
                </Link>
                <Link to="/courses" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '1rem' }}>
                  <Typography>Courses</Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                {user ? ( // Check if user is logged in
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout} style={{ marginLeft: '1rem' }}>Logout</Button>
                    {isAdmin && ( // Show admin icons if user is admin
                      <>
                        <IconButton color="inherit" onClick={toggleDrawer(true)}>
                          <MdEvent />
                        </IconButton>
                        <IconButton component={Link} to="/addcourse" color="inherit">
                          <MdSchool />
                        </IconButton>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/register" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '1rem' }}>
                      <Typography>Register</Typography>
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '1rem' }}>
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: '240px', marginTop: '6rem' }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {adminLinks}
            </Box>
          </Drawer>

          <Container style={{ marginTop: '6rem', marginBottom: '2rem' }}>
            <Routes>
              <Route path="/" element={<Tutorials />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/addtutorial" element={<AddTutorial />} />
              <Route path="/edittutorial/:id" element={<EditTutorial />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/form" element={<MyForm />} />
              <Route path="/events" element={<Events />} />
              <Route path="/AdminECManagement" element={<AdminECManagement />} /> {/* Route for AdminECManagement component */}
              <Route path="/addevent" element={<AddEvent />} />
              <Route path="/event-details/:id" element={<EventDetails />} />
              <Route path="/edit-event/:id" element={<EditEvent />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/addcourse" element={<AddCourse />} />
              <Route path="/course-details/:id" element={<CourseDetails />} />
              <Route path="/edit-course/:id" element={<EditCourse />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
