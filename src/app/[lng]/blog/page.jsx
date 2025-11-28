'use client'

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import React, { use, useEffect, useState } from "react";
import Button from '../../../components/ui/Button'
import { Card } from "../../../components/ui/Card";
import { supabase } from '@/lib/supabase'

const paginationDots = [
  { active: false },
  { active: false },
  { active: false },
  { active: true },
];

 const Screen = ({ params }) => {
  const { lng } = use(params);
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          setFeaturedBlog(data[0]);
          setBlogs(data.slice(1));
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  
  // Helper function to get localized text
  const getLocalizedText = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    return obj[lng] || obj.ar || obj.en || fallback;
  };

  if (loading) {
    return (
      <div className="bg-[#fdfef9] overflow-hidden w-full min-h-[1584px] relative">
        <main className="pt-[50px]">
          <div className="container mx-auto lg:max-w-[1150px]">
            {/* Featured Blog Skeleton */}
            <section className="relative px-6">
              <div className="w-full">
                {/* Title Skeleton */}
                <div className="h-[60px] mb-6">
                  <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                
                <div className="content flex md:gap-10 lg:gap-20">
                  {/* Right Box Skeleton */}
                  <div className="box-right flex-1">
                    <div className="pb-8 gap-4">
                      <div className="h-[104px] mb-4">
                        <div className="h-6 w-full bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Left Box Skeleton */}
                  <div className="box-left flex-1">
                    <div className="h-24 w-full bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Main Blog Image Skeleton */}
              <div className="main-blog mt-6">
                <div className="w-full h-[508px] bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Pagination Dots Skeleton */}
              <div className="w-[116px] h-4 flex gap-3 pt-3 px-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`${i === 4 ? "w-8" : "w-4"} h-4 bg-gray-200 rounded-lg animate-pulse`}
                  />
                ))}
              </div>
            </section>

            {/* Popular Articles Skeleton */}
            <section className="relative mt-[80px] px-4 sm:px-6 lg:px-8">
              {/* Heading Skeleton */}
              <div className="mb-8">
                <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Article Cards Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="w-full h-auto bg-[#ffffff1f] rounded-xl border border-solid border-white shadow-cards overflow-hidden"
                  >
                    <div className="p-0">
                      {/* Image Skeleton */}
                      <div className="w-full h-[200px] sm:h-[220px] lg:h-[246px] bg-gray-200 rounded-[11px_12px_0px_0px] animate-pulse"></div>
                      <div className="p-4">
                        {/* Title Skeleton */}
                        <div className="h-6 w-full bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-3"></div>
                        {/* Description Skeleton */}
                        <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-4 w-5/6 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons Skeleton */}
              <div className="flex gap-4 mt-8">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#fdfef9] overflow-hidden w-full  min-h-[1584px] relative"
      data-model-id="58:1871"
    >
      <main className="pt-[50px]">
        <div className="container mx-auto lg:max-w-[1150px]">
        <section className="relative animate-fade-in opacity-0 [--animation-delay:200ms]">
          {featuredBlog && (
            <>
              <div className="w-full px-6">
                <h1 className=" h-[60px]  font-bold text-[#172436] text-[32px] leading-[normal] tracking-[0] ">
                  {lng === 'ar' ? 'المدونة' : 'Blog'}
                </h1>
                <div className="content  flex  md:gap-10  lg:gap-20">
                <div className="box-right">
                <div className="pb-8 gap-4">
                

                <p className="h-[104px]  font-normal text-transparent text-[28px] tracking-[0] leading-7 ">
                  <span className="font-medium text-[#4b4b4b]">
                    {getLocalizedText(featuredBlog.title)}
                  </span>
                </p>
              </div>

                </div>
            
                <div className="box-left">
              <p className="w-[567px]  font-normal text-[#585858] text-xl leading-7 tracking-[0] ">
                {getLocalizedText(featuredBlog.description)}
              </p>

              <Button
                variant="ghost"
                className="h-auto flex items-center justify-end gap-2.5 rounded-lg hover:bg-transparent transition-colors group"
              >
                <FiChevronLeft className="w-7 h-7 text-[#f0a647] transition-transform" />
                <span className="font-cairo-med-20 font-[number:var(--cairo-med-20-font-weight)] text-[#f0a647] text-[length:var(--cairo-med-20-font-size)] leading-[var(--cairo-med-20-line-height)] tracking-[var(--cairo-med-20-letter-spacing)]  [font-style:var(--cairo-med-20-font-style)]">
                  {lng === 'ar' ? 'عرض المزيد' : 'Read More'}
                </span>
              </Button>
              </div>
            </div>
              </div>
              <div className="main-blog">
                
                <img
                className="w-[1152px] h-[508px] rounded-lg object-cover"
                alt={getLocalizedText(featuredBlog.title)}
                src={featuredBlog.image || "https://c.animaapp.com/mihru5swI146K5/img/rectangle-18673.png"}
              />
              </div>          

              <div className="w-[116px] h-4 flex gap-3 pt-3 px-2">
                {paginationDots.map((dot, index) => (
                  <div
                    key={index}
                    className={`${dot.active ? "w-8 bg-[#fecf85]" : "w-4 bg-[#d9d9d999]"} h-4 rounded-lg transition-all cursor-pointer hover:opacity-80`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="relative mt-[80px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms] px-4 sm:px-6 lg:px-8">
          <h2 className=" mb-8  font-bold text-[#172436] text-2xl sm:text-3xl lg:text-[40px] leading-[normal] tracking-[0] ">
            {lng === 'ar' ? 'المقالات الشائعة' : 'Popular Articles'}
          </h2>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {blogs.map((blog, index) => (
                <Card
                  key={blog.id || index}
                  className="w-full h-auto bg-[#ffffff1f] rounded-xl border border-solid border-white shadow-cards overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                >
                  <div className="p-0">
                    <img
                      className="w-full h-[200px] sm:h-[220px] lg:h-[246px] rounded-[11px_12px_0px_0px] object-cover"
                      alt={getLocalizedText(blog.title)}
                      src={blog.image || "https://c.animaapp.com/mihru5swI146K5/img/rectangle-18679.png"}
                    />
                    <div className="p-4">
                      <h3 className="min-h-[26px] flex items-center justify-center  font-normal text-transparent text-sm leading-[normal] tracking-[0]  mb-2">
                        <span className="font-bold text-[#4b4b4b]">
                          {getLocalizedText(blog.title)}
                        </span>
                      </h3>
                      <p className=" font-normal text-[#585858] text-sm leading-[normal] tracking-[0] ">
                        {getLocalizedText(blog.description)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#585858] text-lg">
                {lng === 'ar' ? 'لا توجد مقالات متاحة حالياً' : 'No articles available at the moment'}
              </p>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer w-12 h-12 rounded-full bg-[#f0a647]  transition-colors"
            >
              <FiChevronLeft className="w-6 h-6 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer w-12 h-12 rounded-full bg-[#f0a647]  transition-colors"
            >
              <FiChevronRight className="w-6 h-6 text-white" />
            </Button>
          </div>
        </section>
        </div>
      </main>

    </div>
  );
};

export default Screen;