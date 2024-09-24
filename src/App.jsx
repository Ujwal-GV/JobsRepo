import './App.css'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import forgotPassword from './pages/forgotPassword';
import setNewPassword from './pages/setNewPassword';
import mainPage from './pages/mainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/login" Component={ Login } />
        <Route path = "/signup" Component={ SignUp } />
        <Route path = "/forgotpassword" Component={ forgotPassword } />
        <Route path = "/resetpassword" Component={ setNewPassword } />
        <Route path = "/" Component={ mainPage } />
      </Routes>
    </Router>
  );
}

export default App;
