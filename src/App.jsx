import { useState, useEffect } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'

// TODO: redux check. remove when done
import { increment, decrement } from './redux/reducers/commonSlice'

import "tw-elements-react/dist/css/tw-elements-react.min.css";

import { useLocation } from 'react-router-dom'

// Components
// import NavBar from './components/common/Navbar' //REF: replaced by SheetHeader (redesign)
// import Footer from './components/common/Footer'; //REF: replaced by SheetFooter (redesign)
import SheetHeader from './components/sheet/SheetHeader'
import SheetFooter from './components/sheet/SheetFooter'
// import CalFloatingButton from './components/common/CalFloatingButton'; //REF: disabled for now
// import ChatWidget from './components/common/ChatWidget'; //REF: not needed anymore

//data
import RoutesList from './components/Routes.jsx';
import appConstants from './constants/appConstants'
import { useSheetMotion } from './helpers/sheetMotion'

// Pages not yet rebuilt in the spec-sheet layout keep their old centred container
// (.ss-legacy); everything else renders full width.
const LEGACY_ROUTES = [
  appConstants.routes.experienceCertificates,
  appConstants.routes.experienceUpcomingSkills,
  appConstants.routes.listsGames,
  appConstants.routes.listsBooks,
  appConstants.routes.listsResources,
  appConstants.routes.listsBookmarks,
]

function App() {
  const location = useLocation()
  const isLegacy = LEGACY_ROUTES.includes(location.pathname)
  useSheetMotion()

  // On navigation: scroll to the #hash target if there is one, otherwise to the top.
  // Query-string-only changes (e.g. Work page tabs) keep the scroll position.
  useEffect(() => {
    if (location.hash) {
      // small delay so layout/images settle before scrolling
      const id = setTimeout(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(id)
    }
    window.scrollTo(0, 0)
    // location.key re-runs the hash scroll when the same #link is clicked again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash, location.hash ? location.key : null])

  const count = useSelector((state) => {
    // console.log(state)
    return state.persistedReducer.common.myValue
  })

  const posts = useSelector((state) => {
    return state.persistedReducer.post
  })

  const dispatch = useDispatch()

  return (
    <>
    <div className="ss-sheet">
      <SheetHeader/>
      <main className={isLegacy ? 'ss-legacy' : ''}>
        <RoutesList/>
      </main>
      <SheetFooter/>
    </div>
    {/* <CalFloatingButton/> //REF: disabled for now */}
    {/* <ChatWidget/> //REF: not needed  */}

    {/* TODO: Redux check. remove when done */}
    {/* <button
      aria-label="Increment value"
      onClick={() => dispatch(increment())}
      className='bg-slate-100 hover:bg-slate-400 p-2 border-l-neutral-400 hover:border-neutral-600 border-2'
    >
      Increment
    </button>

    <span className='text-sky-500 hover:text-sky-600'>{count}</span>
    
    <button
      aria-label="Decrement value"
      onClick={() => dispatch(decrement())}
      className='bg-slate-100 hover:bg-slate-400 p-2 border-l-neutral-400 hover:border-neutral-600 border-2'
    >
      Decrement
    </button> */}

    {/* <div class="grid grid-cols-5 gap-4">
      <div className='col-span-4'>
        <div class="flex flex-row flex-wrap gap-5 justify-around">
            {posts.map((item) => (
              <BlogCard
                cardTitle={item.title}
                cardDescription={item.description}
                tags={item.tags}
                date={item.date}
                imgUrl={item.imageUrl}
                postLink={item.postLink}
              />)
            )}
        </div>
      </div>
      <div className='col-span-1'>asd</div>
    </div> */}

    </>
  )
}

export default App
