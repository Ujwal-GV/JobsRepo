import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/forgotPassword'
import SetNewPassword from './pages/setNewPassword'
import JobApplicatioWithSimilarApplication from './pages/seeker/JobApplicatioWithSimilarApplication'
import JobApplicationProviderView from './pages/provider/JobApplicationProviderView'
import MainWrapper from './components/MainWrapper'
import MainPage from './pages/mainPage'
import CompanyPage from './pages/seeker/CompanyPage'

const AppMain = () => {
  return (
    <BrowserRouter>
       <Routes>
        <Route path = "/login" element={<Login/>} />
        <Route path = "/signup" Component={ SignUp } />
        <Route path = "/forgotpassword" Component={ ForgotPassword } />
        <Route path = "/reset-password" Component={ SetNewPassword } />
        <Route path="/" element={<MainWrapper/>}>
             <Route index Component={ MainPage } />
             <Route path = "/job-apply" element={ <JobApplicatioWithSimilarApplication/> } />
             <Route path = "/post-job" element={ <JobApplicationProviderView/> } />
             <Route path = "/company" element={ <CompanyPage/> } />
        </Route>
      </Routes> 
    </BrowserRouter>
  )
}

export default AppMain
