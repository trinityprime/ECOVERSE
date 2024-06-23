import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import UserContext from './contexts/UserContext';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [user, setUser] = useState(null);

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
          <AppBar position="static" className="AppBar">
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
                <Link to="/tutorials" style={{ marginLeft: 'auto' }}>
                  <Typography>Tutorials</Typography>
                </Link>
                <Link to="/events" style={{ marginLeft: '15px' }}>
                  <Typography>Events</Typography>
                </Link>
                <Link to="/courses" style={{ marginLeft: '15px' }}>
                  <Typography>Courses</Typography>
                </Link>
                <Link to="/incident_report" style={{ marginLeft: '15px' }}>
                  <Typography>Incident Report</Typography>
                </Link>
                <Link to="/about_us" style={{ marginLeft: '15px' }}>
                  <Typography>About Us</Typography>
                </Link>
                <Link to="/contact_us" style={{ marginLeft: '15px' }}>
                  <Typography>Contact Us</Typography>
                </Link>
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
              <Route path={"/"} element={<Tutorials />} />
              <Route path="/s3cr3t-4dm1n-l0g1n" element={<AdminLogin />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              <Route path={"/form"} element={<MyForm />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/profile"} element={<Profile />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
