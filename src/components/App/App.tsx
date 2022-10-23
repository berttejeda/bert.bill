import React,{useEffect,useState} from 'react';

// Main style
import '../../index.scss'

// Lesson Loader
import LessonLoader from '../LessonLoader/LessonLoader'

if (window.performance) {
  if (performance.navigation.type == 1) {
    console.log( "Application restarted" );
  } else {
    console.log( "Application start" );
  }
}

export default function App () {

  return (
    <>
      <LessonLoader/>

    </>
    );

}