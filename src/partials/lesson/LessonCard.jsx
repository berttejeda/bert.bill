import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../EditMenu';
import { useNavigate } from 'react-router-dom';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

export default function LessonCard({
  topicName,
  lessonName,
  lessonUrl,
  lessonDuration,
  lessonDataKey,
  lessonData
}) {

  console.log(`Topic name is ${topicName}`)
  console.log(`Lesson name is ${lessonName}`)
  // console.log(`Lesson url is ${lessonUrl}`)
  // console.log(`Lesson Data is ${lessonData}`)

  // { 
  //   Object.keys(lessonData).forEach(lessonDataObjKey =>
  //     console.log(lessonData['name'])
  //   ) 
  // }
  var topic_slug = encodeURIComponent(topicName);
  var lesson_slug = encodeURIComponent(lessonName)
  const slug = `${topic_slug}/${lesson_slug}`;
  const navigate = useNavigate();
  console.log(`slug is ${slug}`)
  
  const handleOnClick = (url) => {
    console.log(`Navigating to ${url}`)
    navigate(url);
  }

  return (
    <div onClick={() => {handleOnClick(slug)} } className="hover:-translate-y-1 hover:scale-110 flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="hover:-translate-y-1 hover:scale-110 flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
        <div className="px-5 pt-5">
          <header className="flex justify-between items-start mb-2">
            {/* Icon */}
            <img src={Icon} width="32" height="32" alt="Icon 01" />
            {/* Menu button */}
            <EditMenu className="relative inline-flex">
              <li>
                <Link className="font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3" to="#0">Preview</Link>
              </li>
            </EditMenu>
          </header>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">{topicName} - {lessonName}</h2>
          <div className="flex items-start">
            <div className="text-sm font-bold text-slate-800 mr-2">{lessonDuration} Minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}