import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
// import OptionPage from './pages/optionPage'
import ForgotPassword from './pages/forgotPassword'
import SetNewPassword from './pages/setNewPassword'
import JobApplicatioWithSimilarApplication from './pages/seeker/JobApplicatioWithSimilarApplication'
import JobApplicationProviderView from './pages/provider/JobApplicationProviderView'
import MainWrapper from './components/MainWrapper'
import MainPage from './pages/mainPage'
import ProviderMainPage from './pages/provider/ProviderMainPage'
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
import ListOfCompanies from './pages/seeker/ListOfCompanies'
import BusinessPost from './pages/provider/BusinessPost'
import SomethingWentWrong from './components/SomethingWentWrong'
import JobPostedByCompany from './pages/provider/JobPostedByCompany'
import FollowingCompanies from './pages/seeker/appliedList/FollowingCompanies'
import FreelancerMainWrapper from './pages/freelancer/components/FreelancerWrapper'
import MainPageFreelancer from './pages/freelancer/MainPageFreelancer'
import ProjectApplicationPost from './pages/freelancer/ProjectApplicationPost'
import UserSignUp from './pages/UserSignUp'
import UserLogin from './pages/UserLogin'
import FreelancerProfile from './pages/freelancer/FreelancerProfile'
import ProjectsPostedByFreelancer from './pages/freelancer/ProjectsPostedByFreelancer'
import ProjectDetails from './pages/freelancer/ProjectDetails'
import ListOfProjects from './pages/seeker/ListOfProjects'
import ViewProjectCandidate from './pages/freelancer/ViewProjectCandidate'
import Loading from './pages/Loading'
import ProviderForgotPassword from './pages/provider/components/ProviderForgotPassword'
import FreelancerForgotPassword from './pages/freelancer/components/FreelancerForgotPassword'
import ProviderSetNewPassword from './pages/provider/components/ProviderSetNewPassword'
import FreelancerSetNewPassword from './pages/freelancer/components/FreelancerSetNewPassword'
import ShortlistedCandidates from './pages/provider/ShortlistedCandidates'
import AdminWrapper from './pages/admin/components/AdminWrapper'
import AdminDashboardPanel from './pages/admin/AdminDashboardPanel'
import AdminLogin from './pages/admin/AdminLogin'
import AdminUserManagementPanel from './pages/admin/AdminUserManagement'
import AdminUserControlPanel from './pages/admin/AdminUserControlPanel'
import AdminSettingsPanel from './pages/admin/AdminSettingsPanel'
import AdminStatisticsPage from './pages/admin/AdminStatisticsPage'
import SeekerProfileAdmin from './pages/admin/components/SeekerProfileAdmin'
import ProviderProfileAdmin from './pages/admin/components/ProviderProfileAdmin'
import VerificationPending from './pages/admin/components/VerificationPending'
import ReportTablePage from './pages/admin/components/ReportTablePage'

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

          <Route path = "/user/login" element={<UserLogin />} />
          <Route path = "/user/signup" element={<UserSignUp />} />

          <Route path = "/forgotpassword" element={ <ForgotPassword/> } />
          <Route path = "/reset-password/:token" element={ <SetNewPassword/> } />

          <Route path = '/provider/forgot-password' element = { < ProviderForgotPassword /> } />
          <Route path = '/freelancer/forgot-password' element = { < FreelancerForgotPassword /> } />

          <Route path = '/provider/reset-password/:token' element = { < ProviderSetNewPassword /> } />
          <Route path = '/freelancer/reset-password/:token' element = { < FreelancerSetNewPassword /> } />

          <Route path = "/admin/login" element={<AdminLogin />} />

          {/* <Route path = "/select-role" element= { <OptionPage />} /> */}
          <Route path="/" element={<MainWrapper/>}>
              <Route index element={ <MainPage/> } /> 
              <Route path = "/user/job-post/:id/:applied?" element={ <JobApplicatioWithSimilarApplication/> } />
              <Route path = "/user/project-apply/:id" element={ <ProjectApplication /> } />
              <Route path = "/user/company/:id" element={ <CompanyPage/> } />
              <Route path='/user/profile' element={<UserProfile/>}/>
              <Route path='/user/applied-job-list' element={<JobAppliedList/>}/>
              <Route path='/user/saved-job-list' element={<AppSavedListPage/>}/>
              <Route path='/user/company/following' element={<FollowingCompanies/>}/>
              <Route path='/user/find-jobs/:q?' element={<SearchFilterPage/>}/>
              <Route  path='/user/news' element={<NewsPage/>}/>
              <Route path='/user/companies' element={<ListOfCompanies/>}/>
              <Route path='/user/projects' element={<ListOfProjects/>}/> 
              
          </Route>
          <Route path="/provider" element={<ProviderMainWrapper/>}>
              <Route index element={ <ProviderMainPage/> } />
              <Route path = "/provider/post-job" element={ <JobApplicationProviderView/> } />
              <Route path = "/provider/post-job/:id" element = { <JobDetails/> } />
              <Route path = "/provider/profile" element={ <ProviderProfile/> } />
              <Route path = '/provider/all-jobs/:id' element = { <AllPostedJobs /> } />
              <Route path = '/provider/view-candidate/:job_id/:user_id' element = { <ViewCandidate /> } />
              <Route path = "/provider/business-post" element = { <BusinessPost /> } />
              <Route path = '/provider/jobs-posted/:company_id' element = { <JobPostedByCompany /> } />
              <Route path = "/provider/shortlist/:postId" element = { <ShortlistedCandidates /> } />
          </Route> 
          <Route path="/freelancer" element={<FreelancerMainWrapper />}>
            <Route index element={ <MainPageFreelancer /> } />
            <Route path = "/freelancer/profile" element={ <FreelancerProfile /> } />
            <Route path = "/freelancer/project/:id" element={ <ProjectDetails /> } />
            <Route path = '/freelancer/projects-posted/:freelancer_id' element = { <ProjectsPostedByFreelancer /> } />
            <Route path = "/freelancer/post-project" element={ <ProjectApplicationPost/> } />
            <Route path = '/freelancer/view-candidate/:project_id/:user_id' element = { <ViewProjectCandidate /> } />
          </Route>

          <Route path="/admin" element={<AdminWrapper/>}>
              <Route index element={ <AdminDashboardPanel /> } />  
              <Route path="/admin/user-management" element={ <AdminUserManagementPanel /> } />
              <Route path="/admin/user-control" element={ <AdminUserControlPanel /> } />
              <Route path="/admin/settings" element={ <AdminSettingsPanel /> } />
              <Route path="/admin/statistics" element={ <AdminStatisticsPage /> } />
              <Route path="/admin/user/:user_id" element={ <SeekerProfileAdmin /> } />
              <Route path="/admin/provider/:company_id" element={ <ProviderProfileAdmin /> } />              <Route path="/admin/verification-pending" element={ <VerificationPending /> } />
              <Route path="/admin/reports" element={ <ReportTablePage /> } />




          </Route>

          <Route path='*' element={<SomethingWentWrong title='Page Not Found' subTitle='Unable to Find Page'/>}/>
        </Routes> 
      </BrowserRouter>
      </JobProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthProvider>
    </QueryClientProvider>
  ) 
}

export default AppMain