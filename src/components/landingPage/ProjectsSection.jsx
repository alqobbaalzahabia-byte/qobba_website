'use client'
import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import { HiArrowNarrowUp } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
const ProjectsSection = ({ t, lng }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // get allprojects from supabase
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) {
        console.log('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <section className="projects-section relative w-full py-16 px-0" id="projects-section">
      <div className="container lg:max-w-[1150px]  mx-auto p-6 bg-[linear-gradient(0deg,rgba(252,252,252,0)_0%,rgba(251,207,104,0.05)_51%,rgba(250,176,0,0.08)_100%)] rounded-[20px]">
        {/* Title */}
        <h2 className="relative text-center font-bold text-[#5e2900] text-[32px] mb-12">
          {t('projects.title')}
        </h2>

        {loading ? (
          <div className="custom-skeleton-cards">
            {/* Row1: 3 card grid style */}
            <div className="projects-row-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-6">
              {/* two cards  */}
              <div className="relative lg:max-w-[522px] flex flex-col gap-6 mb-6  ">
                {[1, 2].map((index) => (
                  <div key={index} className="relative group overflow-hidden rounded-[20px] animate-pulse">
                    <div className="relative w-full lg:h-[263px] overflow-hidden bg-gray-200 rounded-[20px]">
                      <div className="p-6 absolute bottom-0 left-0 w-full">
                        <div className="flex items-center gap-3">
                          <div className={`w-[50px] h-[50px] sm:w-[50px] sm:h-[50px] ${lng === 'ar' ? 'order-2' : ''} bg-gray-300 rounded-full shrink-0`}></div>
                          <div className="h-10 bg-gray-300 w-full md:min-w-[412px] rounded-[10px]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/*  1 card large  */}
              <div className={` ${lng === 'ar' ? '-order-5' : '-order-5'}  relative flex justify-end sm:mb-6`}>
                <div className="w-full lg:max-w-[522px]">
                  <div className="relative  group overflow-hidden rounded-[20px] animate-pulse">
                    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden bg-gray-200 rounded-[20px]">
                      <div className="p-6 absolute bottom-0 left-0 w-full">
                        <div className="flex items-center gap-3">
                          <div className={`w-[50px] h-[50px] ${lng === 'ar' ? 'order-2' : ''} bg-gray-300 rounded-full shrink-0`}></div>
                          <div className="h-10 bg-gray-300 w-full  md:min-w-[416px] rounded-[10px]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row2: Four Smaller Cards */}
            <div className="relative grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-0 mb-8">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="relative flex justify-center group overflow-hidden rounded-[20px] animate-pulse">
                  <div className="relative w-full sm:w-[247px] md:h-[180px] lg:h-[250px] overflow-hidden bg-gray-200 rounded-[20px]">
                    <div className="p-6 absolute bottom-0 left-0 w-full">
                      <div className="flex items-center gap-3">
                        <div className={`w-[35px] h-[35px] ${lng === 'ar' ? 'order-2' : ''} bg-gray-300 rounded-full shrink-0`}></div>
                        <div className="h-8 bg-gray-300 w-full sm:max-w-[212px] rounded-[10px]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : projects.length > 0 ? (
          <div className="projects-data">
            {/* Row1: 3 card grid style */}
            <div className="hidden projects-row-1  grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-6">
              {/* two cards */}
              {projects.length >= 2 && (
                <div className="relative lg:max-w-[522px] flex flex-col gap-6 mb-6  ">
                  {projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="relative group overflow-hidden rounded-[20px] ">
                      {project.image && (
                        <div className="relative w-full lg:h-[263px] overflow-hidden">
                          <Image
                            className="w-full h-[258px] sm:h-full object-cover"
                            alt={project.title?.[lng] || 'Project'}
                            src={project.image}
                            width={522}
                            height={263}
                          />

                          <div className="p-6 absolute bottom-0 left-0 w-full">
                            <div className="flex items-center gap-3">
                              <div className={`w-[50px] h-[50px] sm:w-[50px] sm:h-[50px] ${lng === 'ar' ? 'order-2' : ''} bg-white rounded-full shadow-[0px_2px_8px_#0000001a] flex items-center justify-center shrink-0`}>
                                <HiArrowNarrowUp className="text-sm md:text-xl -rotate-45 text-gray-500" />

                              </div>
                              <h3 className="font-bold px-4 bg-white w-full md:min-w-[216px] lg:min-w-[412px] rounded-[10px] p-2 text-[16px] sm:text-[14px] text-[#7c7c7c] text-xl leading-[normal]">
                                {project.title?.[lng]}
                              </h3>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
              {/*  1 card large*/}
              {projects.length >= 2 && (
                <div className={` ${lng === 'ar' ? '-order-5' : '-order-5'}  relative flex justify-end sm:mb-6`}>
                  <div className="w-full lg:max-w-[522px]">
                    <div className="relative  group overflow-hidden rounded-[20px]">
                      {projects[2].image && (
                        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden">
                          <Image
                            className="w-full h-full object-cover"
                            alt={projects[2].title?.[lng] || 'Project'}
                            src={projects[2].image}
                            width={522}
                            height={550}
                          />
                          <div className="p-6 absolute bottom-0 left-0 w-full">
                            <div className="flex items-center gap-3">
                              <div className={`w-[50px] h-[50px] ${lng === 'ar' ? 'order-2' : ''} bg-white rounded-full shadow-[0px_2px_8px_#0000001a] flex items-center justify-center shrink-0`}>
                              <HiArrowNarrowUp className="text-sm md:text-xl -rotate-45 text-gray-500" />
                              </div>
                              <h3 className="font-bold px-4 bg-white w-full  md:min-w-[216px] lg:min-w-[416px] rounded-[10px] p-2 text-[#7c7c7c] text-[16px] md:text-[16px] text-xl leading-[normal]">
                                {projects[2].title?.[lng]}
                              </h3>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Row2: Four Smaller Cards */}
            {projects.length >= 4 && (
              <Link href={`/${lng}/projects`}>
              <div className="relative grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-0 mb-8">
                {projects.slice(3, 7).map((project) => (
                  <div key={project.id} className="relative flex justify-center group overflow-hidden rounded-[20px]">
                    {project.image && (
                      <div className="relative w-full sm:w-[247px] md:h-[180px] lg:h-[250px] overflow-hidden">
                        <Image
                          className="w-full h-[258px] sm:h-full sm:object-cover"
                          alt={project.title?.[lng] || 'Project'}
                          src={project.image}
                          width={247}
                          height={250}
                        />
                        <div className=" p-6 smp-2 md:p-6 absolute bottom-0 left-0 w-full">
                          <div className="flex items-center md:gap-3 gap-2">
                            <div className={` w-[50px] h-[50px] sm:w-[25px] sm:h-[25px]  md:w-[35px] md:h-[35px]  ${lng === 'ar' ? 'order-2' : ''} bg-white rounded-full  flex items-center justify-center shrink-0`}>
                              <HiArrowNarrowUp className="text-[12px] md:text-xl -rotate-45 text-gray-500" />
                            </div>
                            <h3 className=" font-bold px-4 md:px-4  bg-white w-[80%] sm:max-w-[212px] rounded-[10px] py-1.5 text-[#7c7c7c] sm:text-[11px] md:text-[14px] lg:text-[16px] leading-[normal]">
                              {project.title?.[lng]}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
              </Link>
            )}

            {/* view all button */}
            <div className="relative flex justify-center">
              <Button className="cursor-pointer w-[342px] h-16 rounded-[18px] bg-gradient-button hover:opacity-90 transition-opacity">
                <div className="font-bold text-white text-2xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  <Link href={`${lng}/projects`}>
                     {t('projects.viewAll')}
                  </Link>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative text-center py-12">
            <p className="text-[#666666] text-lg">No projects available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;

