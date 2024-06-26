import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import MyForm from './pages/MyForm';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import AdminECManagement from './pages/AdminECManagement';
import EventDetails from './pages/EventDetails';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import CourseDetails from './pages/CourseDetails';
import EditCourse from './pages/EditCourse';
import { MdEvent } from 'react-icons/md'; // Import icon for events

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const adminLink = (
    <List>
      <ListItem button component={Link} to="/AdminECManagement">
        <ListItemIcon><MdEvent /></ListItemIcon>
        <ListItemText primary="Go to Admin Page" />
      </ListItem>
    </List>
  );

  return (
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

        

              <Link to="/events" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '1rem' }}>
                <Typography>Events</Typography>
              </Link>

              <Link to="/courses" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '1rem' }}>
                <Typography>Courses</Typography>
              </Link>

              <Box sx={{ flexGrow: 1 }} />

              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MdEvent />
              </IconButton>
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
            {adminLink}
          </Box>
        </Drawer>

        <Container style={{ marginTop: '6rem', marginBottom: '2rem' }}>
          <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/form" element={<MyForm />} />
            <Route path="/events" element={<Events />} />
            <Route path="/addevent" element={<AddEvent />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/AdminECManagement" element={<AdminECManagement />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/addcourse" element={<AddCourse />} />
            <Route path="/course-details/:id" element={<CourseDetails />} />
            <Route path="/edit-course/:id" element={<EditCourse />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
