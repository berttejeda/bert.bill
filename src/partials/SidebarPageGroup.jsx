import React from 'react';
import SidebarLinkGroup from './SidebarLinkGroup';
import { NavLink } from 'react-router-dom';

export default function SidebarPageGroup({
  pathname,
  sectionName,
  sidebarExpanded,
  setSidebarExpanded,
  sectionLinks,
  sectionSVGPaths
}) {

  let sectionPath = sectionName.toLowerCase()
  return (

  <SidebarLinkGroup activecondition={pathname === '/' || pathname.includes({sectionPath})}>
    {(handleClick, open) => {
      return (
        <React.Fragment>
          <a
            href="#0"
            className={`block text-slate-200 truncate transition duration-150 ${
              pathname.includes({sectionPath}) ? 'hover:text-slate-200' : 'hover:text-white'
            }`}
            onClick={(e) => {
              e.preventDefault();
              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                

                  {
                    Object.entries(sectionSVGPaths).map(([svgPathDataKey, svgPathData]) => {
                      {
                       return ( 

                        <path key={svgPathData[1]['name']}
                          className={`fill-current ${
                            pathname.includes({sectionPath}) ? svgPathData[1]['classNameTernary']['true'] : svgPathData[1]['classNameTernary']['false']
                          }`}
                          d={svgPathData[1]['d']}
                        />


                        )
                      }
                    }
                    )
                  } 

                </svg>
                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  {sectionName}
                </span>
              </div>
              {/* Arrow Down Icon */}
              <div className="flex shrink-0 ml-2">
                <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
              </div>
            </div>
          </a>
          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
              {
                Object.entries(sectionLinks).map(([sectionDataKey, sectionData]) => {
                  {
                   return ( <li key={sectionData[1]['name']} className="mb-1 last:mb-0">
                      <NavLink
                        end
                        key={sectionData[1]['name']}
                        to={sectionData[1]['url']}
                        target={sectionData[1]['target']}
                        className={({ isActive }) =>
                          'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                        }
                      >
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          {sectionData[1]['name']}
                        </span>
                      </NavLink>
                    </li>
                    )
                  }
                }
                )
              } 
             
            </ul>
          </div>
        </React.Fragment>
      );
    }}
  </SidebarLinkGroup>

  );
}