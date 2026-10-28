export default {
    routes: {
        home: "/",
        
        aboutMe:"/about",
        aboutMeEducation:"/about#education",
        aboutMeHobby:"/about#hobby",
        aboutMeLanguages:"/about#languages",
        
        projects:"/projects",
        projectDetail:"/projects/:slug",
        
        experience:"/experience",
        experienceWorkHistory:"/experience/work-history",
        experienceAwards:"/experience/awards",
        experienceCertificates:"/experience/certificates",
        experienceUpcomingSkills:"/experience/upcoming-skills",

        services:"/services",
        // these "servicetype" params are based on the sequence in which service data is tored inside the services.json
        servicesBackend:"/services?servicetype=0",
        servicesFrontend:"/services?servicetype=1",
        servicesMachineLearning:"/services?servicetype=2",
        servicesMentorship:"/services?servicetype=3",
        servicesFaq:"/services#faq",
        
        lists:"/lists",
        listsBooks:"/lists/books",
        listsGames:"/lists/games",
        listsResources:"/lists/useful-dev-resources",
        listsBookmarks:"/lists/bookmarks",
        
        blog:"/blog",
        
        contacts:"/contacts",
        contactsFaq:"/contacts#faq",
    },
    common: {
        pageTitle: "M. Hammad Hassan"
    },
    navItems: {
        home: "Home",
        about: "About",
        projects: "Projects",
        contact: "Contact Me!"
    }
}