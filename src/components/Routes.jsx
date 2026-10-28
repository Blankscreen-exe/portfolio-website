import React from 'react'
import PropTypes from 'prop-types'
import { Route, Routes, Navigate } from 'react-router-dom'

// Constants
import appConstants from '../constants/appConstants'

// Components
import PageTitle from './common/PageTitle'
import Home from './home'
// import About from './about' //REF: replaced by AboutPage (redesign)
// import Services from './services' //REF: replaced by ServicesPage (redesign)
import Error404 from './common/404'
// import WorkExperience from './workHistory' //REF: retired in the redesign; awards moved to AboutPage #awards
import BookList from './booksList'
import GameList from './gameList'
import BookmarksList from './bookmarksList'
import DevResourceList from './devResourceList'
import TargetSkillSet from './targetSkillSet'
import Certificates from './certificates'
// import Blog from './blog' //REF: replaced by WritingPage (redesign)
// import Project from './projects' //REF: replaced by WorkPage + ProjectDetail (redesign)

// Spec-sheet redesign pages
import AboutPage from './about/sheet/AboutPage'
import ServicesPage from './services/sheet/ServicesPage'
import WorkPage from './projects/sheet/WorkPage'
import ProjectDetail from './projects/sheet/ProjectDetail'
import WritingPage from './blog/sheet/WritingPage'
import ContactPage from './contact/sheet/ContactPage'

function RoutesList(props) {
  return (
    <Routes>
        <Route path={appConstants.routes.home} element={<Home/>}/>
        <Route path={appConstants.routes.aboutMe} element={<AboutPage/>}/>
        <Route path={appConstants.routes.blog} element={<WritingPage/>}/>

        {/* <Route path={appConstants.routes.experience} element={<WorkExperience/>}/> */}
        {/* Old experience & awards page: awards now live on the About page */}
        <Route path={appConstants.routes.experienceWorkHistory} element={<Navigate to={`${appConstants.routes.aboutMe}#awards`} replace/>}/>
        {/* <Route path={appConstants.routes.experienceAwards} element={<PageTitle title="Work Experience Award"/>}/> */}
        <Route path={appConstants.routes.experienceCertificates} element={<Certificates/>}/>
        <Route path={appConstants.routes.experienceUpcomingSkills} element={<TargetSkillSet/>}/>

        {/* <Route path={appConstants.routes.faq} element={<PageTitle title="FAQ"/>}/> */}

        {/* <Route path={appConstants.routes.lists} element={<PageTitle title="List"/>}/> */}
        <Route path={appConstants.routes.listsGames} element={<GameList/>}/>
        <Route path={appConstants.routes.listsBooks} element={<BookList/>}/>
        <Route path={appConstants.routes.listsResources} element={<DevResourceList/>}/>
        <Route path={appConstants.routes.listsBookmarks} element={<BookmarksList/>}/>

        {/* Old ?servicetype=N links are handled inside ServicesPage */}
        <Route path={appConstants.routes.services} element={<ServicesPage/>}/>

        <Route path={appConstants.routes.projects} element={<WorkPage/>}/>
        <Route path={appConstants.routes.projectDetail} element={<ProjectDetail/>}/>
        <Route path="/work" element={<Navigate to={appConstants.routes.projects} replace/>}/>

        <Route path={appConstants.routes.contacts} element={<ContactPage/>}/>
        <Route path="/contact" element={<Navigate to={appConstants.routes.contacts} replace/>}/>

        <Route path={"*"} element={<Error404/>}/>
    </Routes>
  )
}

RoutesList.propTypes = {}

export default RoutesList
