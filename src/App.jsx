import './App.css'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import SignUp from './components/SignUp';
import forgotPassword from './components/forgotPassword';
import setNewPassword from './components/setNewPassword';
import mainPage from './components/mainPage';

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
