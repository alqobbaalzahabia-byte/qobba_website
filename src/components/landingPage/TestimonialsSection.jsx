'use client'

import React, { useState, useEffect, useRef } from "react";
import { supabase } from '@/lib/supabase'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Arrow from '@/../public/assets/arrow.png'
import plansOverlay1 from '@/../public/assets/plans-overlay1.png'
import Image from 'next/image'

const TestimonialsSection = ({ t, lng }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else {
        setTestimonials(data || []);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="testimonials-section relative w-full pt-16 pb-18 md:px-12 px-5">
      <div className="container mx-auto  md:max-w-[1000px]">
        <h2 className="text-center font-bold text-[#e19e00] text-[40px] mb-12  z-9 sticky">
          {t('testimonials.title')}
        </h2>
        <Image src={plansOverlay1} alt="Plans overlay" className=" absolute z-0 -top-55 left-1/2 -translate-x-1/2 w-[500px] h-[600px]" />

        {loading ? (
          <div className="flex justify-center">
            <SkeletonCard  length={2} className="max-h-[203px]"/>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative">

            <div className="custom-swiper-navigation">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className=" cursor-pointer hidden md:flex items-center justify-center absolute -left-5 top-[35%] -translate-y-1/2 z-10 bg-[#fbfbfb] rounded-[30px] w-[60px] h-[60px]  transition-colors shadow-lg"
                aria-label="Previous testimonial"
              >
                <Image src={Arrow} alt="Previous arrow" className="w-auto h-auto rotate-180" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className=" cursor-pointer hidden md:flex items-center justify-center absolute -right-5 top-[42%] -translate-y-1/2 z-10 bg-[#fbfbfb] rounded-[30px] w-[60px] h-[60px]  transition-colors shadow-lg"
                aria-label="Next testimonial"
              >
                <Image src={Arrow} alt="Next arrow" className="w-auto h-auto" />
              </button>
            </div>

            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={testimonials.length > 2}
              className="testimonials-swiper px-16"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id} className="pb-9">
                  <div className="relative bg-[#fef6e8] rounded-3xl p-8 hover:shadow-lg transition-shadow  min-h-[203px]">
                    {/* Gradient overlays */}
                    <div className="absolute top-0 left-0 w-[185px] rounded-3xl bg-[linear-gradient(299deg,rgba(255,246,233,0)_0%,rgba(240,166,71,0.26)_100%)]" />
                    <div className="absolute top-0 right-0 w-[185px]  rounded-3xl bg-[linear-gradient(299deg,rgba(255,246,233,0)_0%,rgba(240,166,71,0.26)_100%)] rotate-180" />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Avatar and name */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            < div className="flex items-center gap-4">
                              <Image
                                src={testimonial.image}
                                alt={testimonial.name?.[lng] || 'Testimonial'}
                                className="w-20 h-20 rounded-full object-contain"
                                width={80}
                                height={80}
                              />
                              <h3 className="font-bold text-[#585858] text-xl mb-4 text-center">
                                {testimonial.name?.[lng] || 'Customer'}
                              </h3>
                            </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      <p className="font-semibold text-[#636363]  text-lg leading-[26px] line-clamp-2 text-center ">
                        {testimonial.feedback?.[lng] || ''}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#666666] text-lg">{t('testimonials.noTestimonials') || 'No testimonials available yet.'}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;

