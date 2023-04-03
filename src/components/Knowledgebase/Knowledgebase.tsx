// React core
import React,{useEffect, useState} from 'react';

import LessonCard from '../../partials/lesson/LessonCard';

export default function Knowledgebase(props) {

  // For receiving the list of topics
  // from the python process
  const [topics, setTopics] = useState([])    

  const [apiPing, setApiPing] = useState(null);

  useEffect(() => {

    fetch(process.env.REACT_APP_API_URI_GET_TOPICS).then(res => res.json()).then(data => {
      setTopics(data.topics);
    });

  }, []);

  useEffect(() => {

      try {
        fetch(process.env.REACT_APP_API_URI_PING).then(res => res.json()).then(data => {
          setApiPing(data.message);
        });
      } catch (e) {
        console.log(e)
      }

  }, []);    

    console.log('Rendering Knowledgebase') 

    // { 
    //   Object.keys(topics).forEach(topicName =>
    //     topics[topicName]['lessons'].forEach(lessonObj =>
    //       console.log(lessonObj)
    //     )
    //   ) 
    // }    
    return (
      <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>

             <div className="grid grid-cols-12 gap-6">
              {
                Object.keys(topics).map((topicName)=> {
                  {
                    return Object.entries(topics[topicName].lessons).map(([lessonDataKey, lessonData]) =>

                      <LessonCard 
                        key={topicName + '_' + lessonData['name']} 
                        topicName={topicName} 
                        lessonDuration={lessonData['duration']} 
                        lessonName={lessonData['name']} 
                        lessonUrl={lessonData['url']} 
                        lessonDataKey={lessonDataKey} 
                        lessonData={lessonData}
                      />
                    )
                  }
                }
                )
              }
            </div>



        { (!apiPing) ?

          <div>Couldn't ping API at {process.env.REACT_APP_API_URI_PING}<br />
          You can start your api locally via docker with:<br />
          <code>docker run -it --rm --name bill --network=host berttejeda/bill --api-only</code><br />
          Make sure to refresh this page once your API is running.
          Read more at <a href="https://github.com/berttejeda/bert.bill">https://github.com/berttejeda/bert.bill</a></div> 
          : null
        }
      </div>
    )
