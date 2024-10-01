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
import ProjectApplication from './pages/seeker/ProjectApplication'
import UserProfile from './pages/seeker/UserProfile'
import JobAppliedList from './pages/seeker/appliedList/JobAppliedList'
import AppSavedListPage from './pages/seeker/appliedList/AppSavedListPage'
import SearchFilterPage from './pages/seeker/SearchFilterPage'


const AppMain = () => {
  return (
    <BrowserRouter>
       <Routes>
        <Route path = "/login" element={<Login/>} />
        <Route path = "/signup" element={ <SignUp/> } />
        <Route path = "/forgotpassword" element={ <ForgotPassword/> } />
        <Route path = "/reset-password" element={ <SetNewPassword/> } />
        <Route path="/user" element={<MainWrapper/>}>
             <Route index element={ <MainPage/> } />
             <Route path = "/user/job-apply" element={ <JobApplicatioWithSimilarApplication/> } />
             <Route path = "/user/project-apply" element={ <ProjectApplication/> } />
             <Route path = "/user/post-job" element={ <JobApplicationProviderView/> } />
             <Route path = "/user/company" element={ <CompanyPage/> } />
             <Route path='/user/profile' element={<UserProfile/>}/>
             <Route path='/user/applied-job-list' element={<JobAppliedList/>}/>
             <Route path='/user/saved-job-list' element={<AppSavedListPage/>}/>
             <Route path='/user/find-jobs' element={<SearchFilterPage/>}/>
        </Route>
      </Routes> 
    </BrowserRouter>
  ) 
}

export default AppMain
