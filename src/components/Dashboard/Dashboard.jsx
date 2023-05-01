import React, { useEffect, useState } from 'react';

import WelcomeBanner from '../../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../../partials/dashboard/DashboardAvatars';
import FilterButton from '../../partials/actions/FilterButton';
import Datepicker from '../../partials/actions/Datepicker';
import DashboardCard from '../../partials/dashboard/DashboardCard';
import DashboardCard01 from '../../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../../partials/dashboard/DashboardCard13';
import { hashString } from 'utils/Utils'

export default function Dashboard({
  }
  ) {

  const [dashboardSettings, setDashboardSettings] = useState({});
  const [dashboardCards, setDashboardCards] = useState({});

  useEffect(() => {

    console.log('Retrieving Dashboard Settings')

    try {
      fetch(`${process.env.REACT_APP_API_HOST}/api/getDashboardSettings`).then(res => res.json()).then(obj => {
        setDashboardSettings(obj.settings);
      });
    } catch (e) {
      console.log(e)
    }

  }, []); 

  useEffect(() => {

    console.log('Building Dashboard Cards')

    let cardKeys = (dashboardSettings.dashboard?.cards || [])
    let cards = []
    for (var key in dashboardSettings) {
      for i in dashboardSettings[key].cards{
        cards = [...cards, [i, dashboardSettings[key].cards[i]]]
      }
    }    
    setDashboardCards(cards)

  }, [dashboardSettings]);  

  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Welcome banner */}
        <WelcomeBanner />
        {/* Cards */}
        <div className="grid grid-cols-12 gap-6">
        <DashboardCard01 />
        {
          Object.keys(dashboardCards).length > 0 
          ? 
            Object.entries(dashboardCards).map((cardObj)=> {
              {let cardID = hashString(cardObj[1][0])}
              {let cardTitle = cardObj[1][1].title}
              {let cardData = cardObj[1][1].data}
              return <DashboardCard 
                key={cardID} 
                cardTitle={cardTitle} 
                cardData={cardData} 
              />
            }
            )
          : 
            null
        }
        </div>
      </div>
    </main>
  );
}