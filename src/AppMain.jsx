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
import ProviderMainPage from './pages/provider/providerMainPage'
import CompanyPage from './pages/seeker/CompanyPage'
import ProjectApplication from './pages/seeker/ProjectApplication'
import UserProfile from './pages/seeker/UserProfile'
import ProviderProfile from './pages/provider/ProviderProfile'
import AllPostedJobs from './pages/provider/AllPostedJobs'

import ViewCandidate from './pages/provider/ViewCandidate'

import JobAppliedList from './pages/seeker/appliedList/JobAppliedList'
import AppSavedListPage from './pages/seeker/appliedList/AppSavedListPage'
import SearchFilterPage from './pages/seeker/SearchFilterPage'
import JobDetails from './pages/provider/JobDetails'
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import ScrollToTop from './components/ScrollToTop'
import NewsPage from './pages/NewsPage'
import ProviderMainWrapper from './pages/provider/components/ProviderMainWrapper'

const AppMain = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <JobProvider>
      <BrowserRouter>
        <Toaster/>
      <ScrollToTop />
        <Routes>
          <Route path = "/login" element={<Login />} />
          <Route path = "/signup" element={ <SignUp/> } />
          <Route path = "/forgotpassword" element={ <ForgotPassword/> } />
          <Route path = "/reset-password" element={ <SetNewPassword/> } />
          <Route path = "/select-role" element= { <OptionPage />} />
          <Route path="/user" element={<MainWrapper/>}>
              <Route index element={ <MainPage/> } /> 
              <Route path = "/user/job-post/:id" element={ <JobApplicatioWithSimilarApplication/> } />
              <Route path = "/user/project-apply" element={ <ProjectApplication/> } />
              <Route path = "/user/company/:id" element={ <CompanyPage/> } />
              <Route path='/user/profile' element={<UserProfile/>}/>
              <Route path='/user/applied-job-list' element={<JobAppliedList/>}/>
              <Route path='/user/saved-job-list' element={<AppSavedListPage/>}/>
              <Route path='/user/find-jobs' element={<SearchFilterPage/>}/>
              <Route  path='/user/news' element={<NewsPage/>}/>
          </Route>
          <Route path="/provider" element={<ProviderMainWrapper/>}>
              <Route index element={ <ProviderMainPage/> } />
              <Route path = "/provider/post-job" element={ <JobApplicationProviderView/> } />
              <Route path = "/provider/post-job/:id" element = { <JobDetails/> } />
              <Route path = "/provider/profile" element={ <ProviderProfile/> } />
              <Route path = '/provider/all-jobs' element = { <AllPostedJobs /> } />
              <Route path = '/provider/view-candidate/:user_id' element = { <ViewCandidate /> } />
          </Route> 
        </Routes> 
      </BrowserRouter>
      </JobProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </AuthProvider>
    </QueryClientProvider>
  ) 
}

export default AppMain
