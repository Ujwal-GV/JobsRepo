import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import OptionPage from './pages/optionPage'
import ForgotPassword from './pages/forgotPassword'
import SetNewPassword from './pages/setNewPassword'
import JobApplicatioWithSimilarApplication from './pages/seeker/JobApplicatioWithSimilarApplication'
import JobApplicationProviderView from './pages/provider/JobApplicationProviderView'
import MainWrapper from './components/MainWrapper'
import MainPage from './pages/mainPage'
import CompanyPage from './pages/seeker/CompanyPage'
import ProjectApplication from './pages/seeker/ProjectApplication'
import UserProfile from './pages/seeker/UserProfile'
import ProviderProfile from './pages/provider/ProviderProfile'

import JobAppliedList from './pages/seeker/appliedList/JobAppliedList'
import AppSavedListPage from './pages/seeker/appliedList/AppSavedListPage'
import SearchFilterPage from './pages/seeker/SearchFilterPage'
import JobDetails from './pages/provider/JobDetails'

import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';


const AppMain = () => {
  return (
    <AuthProvider>
      <JobProvider>
      <BrowserRouter>
        <Routes>
          <Route path = "/login" element={<Login/>} />
          <Route path = "/signup" element={ <SignUp/> } />
          <Route path = "/forgotpassword" element={ <ForgotPassword/> } />
          <Route path = "/reset-password" element={ <SetNewPassword/> } />
          <Route path = "/select-role" element= { <OptionPage />} />
          <Route path="/user" element={<MainWrapper/>}>
              <Route index element={ <MainPage/> } />
              <Route path = "/user/job-apply" element={ <JobApplicatioWithSimilarApplication/> } />
              <Route path = "/user/project-apply" element={ <ProjectApplication/> } />
              <Route path = "/user/company" element={ <CompanyPage/> } />
              <Route path='/user/profile' element={<UserProfile/>}/>
              <Route path='/user/applied-job-list' element={<JobAppliedList/>}/>
              <Route path='/user/saved-job-list' element={<AppSavedListPage/>}/>
              <Route path='/user/find-jobs' element={<SearchFilterPage/>}/>
          </Route>
          <Route path="/provider" element={<MainWrapper/>}>
              <Route index element={ <MainPage/> } />
              <Route path = "/provider/post-job" element={ <JobApplicationProviderView/> } />
              <Route path = "/provider/post-job/:id" element = { <JobDetails/> } />
              <Route path = "/provider/profile" element={ <ProviderProfile/> } />
          </Route>
        </Routes> 
      </BrowserRouter>
      </JobProvider>
    </AuthProvider>
  ) 
}

export default AppMain
