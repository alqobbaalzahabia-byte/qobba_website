'use client'

import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import OverlayRight from '@/../public/assets/about-overlay.png'
import Image from 'next/image'
import { useTranslation } from '@/app/i18n/client'
import { useParams } from 'next/navigation'

const AboutSection = () => {
  const params = useParams()
  const lng = params?.lng || 'en'
  const { t } = useTranslation(lng)
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from('about_us')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
                
        if (error) {
          console.error('Error fetching about data:', error);
        } else if (data && data.length > 0) {
          setAboutData(data[0]);
        } else {
          console.log('No about data found');
          setAboutData(null);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const data = Array.isArray(aboutData) ? aboutData[0] : aboutData;

  const title = data?.title?.[lng] ||  t('about.title');
  const description = data?.description?.[lng] ;
  const readMore =  t('about.readMore');
  const globeImage =  data?.image ;

  // Split title to highlight last two words
  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const words = titleText.trim().split(/\s+/);
    if (words.length < 2) {
      return <span className="text-[#572b0a]">{titleText}</span>;
    }
    const lastTwoWords = words.slice(-2).join(' ');
    const restOfTitle = words.slice(0, -2).join(' ');
    
    return (
      <>
        {restOfTitle && <span className="text-[#572b0a]">{restOfTitle} </span>}
        <span className="text-[#f0a647]">{lastTwoWords}</span>
      </>
    );
  };
  // skeleton loading for about section
  if (loading) {
    return (
      <section className="about-section relative w-full py-16 px-4 overflow-hidden">
        <div className="about-overlay absolute top-0 left-0 w-full h-full">
          <Image src={OverlayRight} alt="Overlay right" className="w-full h-[800px] r" />
        </div>
        <div className="container lg:max-w-[1000px] mx-auto">
          <div className="relative rounded-3xl p-6 md:p-8">
            <div className={`relative grid grid-cols-1 sm:grid-cols-5 gap-8 items-center min-h-[500px] ${lng === 'ar' ? 'lg:grid-flow-col-dense ' : ''}`}>
               <div className={`sm:col-span-3  sm:min-w-[550px] lg:min-w-[660px] flex flex-col gap-6 md:gap-10 sm:p-4 lg:p-0 ${lng === 'ar' ? 'items-end text-right lg:order-1' : 'items-start text-left md:-order-2'}`}>
                <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>

                {/* Paragraphs Skeleton */}
                <div className="space-y-4 w-full">
                  <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-5/6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4/5 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Button Skeleton */}
                <div className={`flex w-full ${lng === 'ar' ? 'justify-start' : 'justify-start'}`}>
                  <div className="h-12 w-[199px] bg-gray-200 rounded-2xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="about-section relative w-full py-16 px-4 overflow-hidden " id="about-section">
        <div className="about-overlay absolute top-0 left-0 w-full h-full">
          <Image src={OverlayRight} alt="Overlay right" className="w-full h-[800px] r" />
        </div>
     <div className="container lg:max-w-[1000px] mx-auto">
        <div className="relative rounded-3xl  md:px-2 md:py-5">
          <div className={`relative grid grid-cols-1 sm:grid-cols-5 gap-8 items-center min-h-[500px] ${lng === 'ar' ? 'lg:grid-flow-col-dense ' : ''}`}>
            {/* Left box - Globe Image */}
            <div className={`hidden md:flex items-center ${lng === 'ar' ? 'lg:justify-end sm:order-2 sm:col-span-2' : 'lg:justify-start  md:col-span-2'} p-4 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]`}>
              <div className={`relative top-[-100px]  lg:top-[-30px] -left-90  sm:-left-40  xl:top-0 w-full h-auto overflow-visible ${lng === 'ar' ? 'md:top-[-50px]  md:-left-60  lg:-left-90' : 'md:top-18 md:left-22  lg:left-40 rotate-180'}`}>
                <Image  
                  src={globeImage}
                  alt="Vibrant digital globe represents innovation technology"
                  className="h-auto scale-[2] md:scale-[1.5] lg:scale-[1.8] xl:scale-[1.5] object-contain origin-center"
                  width={160}
                  height={160}
                  style={{ width: 'auto' }}
                />
              </div>
            </div>

            {/* Right box - Content */}
            <div className={`sm:col-span-3  sm:min-w-[550px] lg:min-w-[660px] flex flex-col gap-6 md:gap-10 sm:p-4 lg:p-0 ${lng === 'ar' ? 'items-end text-right lg:order-1' : 'items-start text-left md:-order-2'} translate-y-4 animate-fade-in opacity-0 [--animation-delay:400ms]`}>
              <h2 className=" w-full font-bold text-[32px] md:text-[40px] leading-[1.2] tracking-[0]">
                {renderTitle(title)}
              </h2>

              <div className=" space-y-4">
                <p className="font-medium text-[#666666] text-base md:text-lg leading-7 tracking-[0]">
                {/* this way just as test only not will be like this code */}
                        {description.substring(0, 115)}
                        </p>
          
                  <p className="font-medium text-[#666666] text-base md:text-lg leading-7 tracking-[0]">
                    {description.substring(115, 255)}
                  </p>
              
                  <p className="font-medium text-[#666666] text-base md:text-lg leading-7 tracking-[0]">
                  {description.substring(255, 345)}
                  </p>

                  <p className="font-medium text-[#666666] text-base md:text-lg leading-7 tracking-[0]">
                  {description.substring(345, 485)}
                  </p>
            
              </div>
             <div className={`flex w-full ${lng === 'ar' ? 'justify-start' : 'justify-start'}`}>
              <Button className=" cursor-pointer h-auto w-auto min-w-[199px] px-6 py-3 rounded-2xl bg-gradient-button hover:opacity-90 transition-opacity">
                <span className=" font-bold text-white text-lg md:text-xl">
                  {readMore}
                </span>
              </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

