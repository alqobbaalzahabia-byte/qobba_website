'use client'
import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase'
import SkeletonCard from '@/components/ui/SkeletonCard'
import Image from "next/image";
import { useParams } from 'next/navigation'
import { useTranslation } from '@/app/i18n/client'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const gradients = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-cyan-500 via-blue-600 to-purple-600",
  "from-pink-500 via-red-500 to-orange-500",
  "from-blue-500 via-teal-500 to-cyan-400",
  "from-green-500 via-emerald-500 to-teal-500",
  "from-yellow-500 via-orange-500 to-red-500",
  "from-purple-500 via-pink-500 to-rose-500",
  "from-blue-600 via-indigo-600 to-purple-600"
];

const TeamSection = () => {
  const params = useParams()
  const lng = params?.lng || 'en'
  const { t } = useTranslation(lng)
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) {
        console.error('Error fetching team:', error);
      } else {
        setTeam(data || []);
      }
      setLoading(false);
    };

    fetchTeam();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeIndex, team.length]);

  const renderTitle = (title) => {
    if (!title) return null;
    return (
      <span>{title}</span>
    );
  };

  const handleNext = () => {
    if (team.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % team.length);
  };

  const handlePrev = () => {
    if (team.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches?.[0]?.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.pageX || e.touches?.[0]?.pageX;
    const diff = currentX - startX;
    setCurrentTranslate(diff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(currentTranslate) > 50) {
      if (currentTranslate > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    setCurrentTranslate(0);
  };

  const getSlideStyle = (index) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    if (absDiff === 0) {
      return {
        transform: `translateX(${currentTranslate}px) translateZ(0px) rotateY(0deg) scale(1)`,
        opacity: 1,
        zIndex: 50,
      };
    } else if (absDiff === 1) {
      const direction = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 400 + currentTranslate}px) translateZ(-200px) rotateY(${-direction * 35}deg) scale(0.85)`,
        opacity: 0.7,
        zIndex: 40,
      };
    } else if (absDiff === 2) {
      const direction = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 700 + currentTranslate}px) translateZ(-400px) rotateY(${-direction * 50}deg) scale(0.7)`,
        opacity: 0.4,
        zIndex: 30,
      };
    } else {
      return {
        transform: `translateX(${diff > 0 ? 1000 : -1000}px) translateZ(-600px) scale(0.5)`,
        opacity: 0,
        zIndex: 0,
      };
    }
  };

  const getGradient = (index) => {
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <section className="team-section relative w-full py-16" id="team-section">
        <div className="container lg:max-w-[1190px] mx-auto px-6 md:px-4">
          <h2 className="text-center font-bold text-[32px] mb-4">
            {renderTitle(t('team.title') || 'Our Team')}
          </h2>
          <SkeletonCard length={4} className="md:min-w-[250px]!" />
        </div>
      </section>
    );
  }

  if (team.length === 0) {
    return (
      <section className="team-section relative w-full py-16" id="team-section">
        <div className="container lg:max-w-[1190px] mx-auto px-6 md:px-4">
          <h2 className="text-center font-bold text-[32px] mb-4">
            {renderTitle(t('team.title') || 'Our Team')}
          </h2>
          <p className="text-center text-[#666666] select-none">
            {t('team.no_members') || 'No team members available'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className=" relative w-full py-16" id="team-section">
      <div className="container lg:max-w-[1190px] mx-auto px-6 md:px-4 mb-8">
        <h2 className="text-center text-[#E19F00] font-bold text-[32px] mb-4">
          {renderTitle(t('team.title') || 'Our Team')}
        </h2>
        <p className="text-center md:text-xl text-[#676767] mb-12 max-w-2xl mx-auto">
          {t('team.description') || 'فريقنا يعمل بكل احترافية لضمان تقديم أفضل مستوى من الدعم والخدمة في أي وقت تحتاج فيه المساعدة'}
        </p>
      </div>

      <div className="team-section container lg:max-w-[1190px] mx-auto px-6 md:px-4 relative w-full h-[570px] lg:overflow-hidden">
        {/* 3D Container */}
        <div 
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: '900px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {team.map((member, index) => {
            const style = getSlideStyle(index);
            
            return (
              <div
                key={member.id}
                className="absolute w-full sm:w-[400px] h-[400px] transition-all duration-700 ease-out"
                style={{
                  ...style,
                  transformStyle: 'preserve-3d',
                  pointerEvents: index === activeIndex ? 'auto' : 'none',
                }}
              >
                <div className="relative w-full h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hid77den">
                  {/* Shine Effect */}
                  <div 
                    className="absolute inset-0 opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                      backgroundSize: '200% 200%',
                      animation: 'shine 4s ease-in-out infinite',
                    }}
                  />

                

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center px-12">
                    {/* Team Member Image */}
                    {member.image && (
                      <div 
                        className="relative w-50 sm:w-64 h-50 sm:h-64 mb-8 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl"
                      >
                        <Image
                          src={member.image}
                          alt={member.name?.[lng] || member.name || 'Team Member'}
                          fill
                          className="object-cover select-none"
                          draggable={false}
                        />
                      </div>
                    )}
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-[#676767] mb-4 tracking-tight text-center select-none">
                      {member.name?.[lng] || member.name}
                    </h2>
                    <p className="text-lg sm:text-xl text-[#676767] text-center select-none">
                      {member.position?.[lng] || member.position}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        {team.length > 1 && (
          <>
          <div className="arrows hidden md:block">
            <button
              onClick={handlePrev}
              className="cursor-pointer absolute -left-5 lg:left-8 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 rounded-full bg-[#E19F00]/60 backdrop-blur-md border border-[#E19F00]/30 flex items-center justify-center text-white hover:bg-[#E19F00]/90 hover:scale-110 transition-all"
            >
              {lng === 'ar' ? (
                <FaChevronRight className="text-2xl" />
              ) : (
                <FaChevronLeft className="text-2xl" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="cursor-pointer absolute right-8 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 rounded-full bg-[#E19F00]/60 backdrop-blur-md border border-[#E19F00]/30 flex items-center justify-center text-white hover:bg-[#E19F00]/90 hover:scale-110 transition-all"
            >
              {lng === 'ar' ? (
                <FaChevronLeft className="text-2xl" />
              ) : (
                <FaChevronRight className="text-2xl" />
              )}
            </button>
            </div>
            {/* Pagination Dots */}
            <div className="cursor-pointer absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] flex gap-3">
              {team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`cursor-pointer h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-12 bg-[#E19F00]'
                      : 'w-3 bg-[#E19F00]/40 hover:bg-[#E19F00]/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </section>
  );
};

export default TeamSection;