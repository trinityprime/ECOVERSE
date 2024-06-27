import './App.css';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Reports from './pages/Reports';
import AddReport from './pages/AddReport';
import EditReport from './pages/EditReport';
import MyForm from './pages/MyForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  Ecoverse
                </Typography>
              </Link>
              <Link to="/reports"><Typography>Reports</Typography></Link>
              <Box sx={{ flexGrow: 1 }}></Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} element={<Reports />} />
            <Route path={"/reports"} element={<Reports />} />
            <Route path={"/addreport"} element={<AddReport />} />
            <Route path={"/editreport/:id"} element={<EditReport />} />
            <Route path={"/form"} element={<MyForm />} />
          </Routes>
        </Container>
        <ToastContainer />
      </ThemeProvider>
    </Router>
  );
}

export default App;