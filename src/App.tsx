import React,{useEffect,useState} from 'react';

import Sidebar from './partials/Sidebar';
import Header from './partials/Header';
import Banner from './partials/Banner';

import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './styles/style.css';

// Main style
import './index.scss'

// Knowledgebase
import Knowledgebase from 'components/Knowledgebase/Knowledgebase'
import MyNotes from 'components/MyNotes/MyNotes'

// Import pages
import Dashboard from 'components/Dashboard/Dashboard';
import LessonPage  from 'components/LessonPage/LessonPage';

if (window.performance) {
  if (performance.navigation.type == 1) {
    console.log( "Application restarted" );
  } else {
    console.log( "Application start" );
  }
}

export default function App () {

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change 

  return (
    <>
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/knowledgebase" element={<Knowledgebase />} />
            {/*<Route path="/knowledgebase/:lessonID" element={<div>This is a lesson!!</div>} />*/}
            <Route path="/knowledgebase/:topicName/:lessonName/*" element={<LessonPage />} />
            <Route path="/notes" element={<MyNotes />} />
          </Routes>


          <Banner />

        </div>
      </div>
    </>
  );

}