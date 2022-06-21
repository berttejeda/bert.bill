// React core
import React,{useEffect, useState} from 'react';

// For base64 decode/encode
import { Buffer } from 'buffer'

// Componnet Styling
import './LessonLoader.scss'

// Top Navigation Bar component
import TopNavBar from '../TopNavBar/TopNavBar'

// Footer Component
import Footer from '../Footer/Footer'

// Auto-generated Table of Contents
import * as tocbot from 'tocbot';
@use 'tocbot/src/scss/tocbot';

// // Input component
import Input from '../Input/Input'

// Collapsible Component
import CollapsibleSection from '../CollapsibleSection/CollapsibleSection'

// Clipboard Access - for copy on-select
import Clippy from '../Clippy/Clippy'

export default function LessonLoader(props) {

  // For receiving the lesson data
  // from the python process
  const [lesson, loadLesson] = useState('')

  // For interaction between TopNavBar and CollapsibleSection
  const [isCollapsed, setIsCollapsed] = useState(props.collapsed);

  const tocVisible = {
    visibility: "visible",
  };

  const tocHidden = {
    visibility: "hidden",
  };

  const style = {
    collapsed: {
      display: 'none'
    },
    expanded: {
      display: 'block'
    }
  };

  useEffect(() => {
      tocbot.init({
          // Where to render the table of contents.
          tocSelector: '.js-toc',
          // Where to grab the headings to build the table of contents.
          contentSelector: 'main',
          // Which headings to grab inside of the contentSelector element.
          headingSelector: 'h1, h2, h3, h4, h5, h6',
          // For headings inside relative or absolute positioned containers within content.
          hasInnerContainers: true,
          // Main class to add to lists.
          linkClass: 'toc-link',
          // Class that gets added when a list should be collapsed.
          isCollapsedClass: 'is-collapsed',
          // Smooth scrolling enabled.
          scrollSmooth: true,
          // Smooth scroll duration.
          scrollSmoothDuration: 420,
          headingsOffset: 40,
          collapseDepth: 0,
      });  

  }, [lesson])  

  try {
    console.log('Loading lesson view')
    return (
      <div className='lesson-container'>
        <div className='lesson-container-title'>
          <Clippy/>
          <TopNavBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} loadLesson={loadLesson} />
          <CollapsibleSection style={style} isCollapsed={isCollapsed}>
            <em>To render a lesson, enter the web address for <br />
            its lesson definition and click the Load button:</em>
            <Input/>
          </CollapsibleSection>        
        </div>
        { (lesson) ?
          <nav className="js-toc" style={tocVisible}></nav>
          :
          <nav className="js-toc" style={tocHidden}></nav>
        }
        {/*The incoming lesson content is a base64-encoded string*/}
        <main className='lesson-content-container' dangerouslySetInnerHTML={{ __html: Buffer.from(lesson, 'base64').toString('ascii'); }} />
        <Footer lesson={lesson} />
      </div>
    )
  } catch(e){
    console.log('Error in rendering lesson view: ', e)
    return (
      <div className='lesson-container'>
        <div className='lesson-container-title'>
        <TopNavBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} loadLesson={loadLesson} />
        </div>
        Error in rendering lesson view. 
        Check console for error message.
      </div>
    )
  }
}
