'use client'
import React, { useState, useEffect, useRef } from "react";
import { supabase } from '@/lib/supabase'
import SkeletonCard from '@/components/ui/SkeletonCard'
import Image from "next/image";
import { useParams } from 'next/navigation'
import { useTranslation } from '@/app/i18n/client'

const TeamSection = () => {
  const params = useParams()
  const lng = params?.lng || 'en'
  const { t } = useTranslation(lng)
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }
    return 4;
  };

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
      setStartIndex(0);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching team:', error);
      } else {
        setTeam(data || []);
      }
      setLoading(false);
    };

    fetchTeam();
  }, []);

  const renderTitle = (title) => {
    if (!title) return null;
    const words = title.trim().split(/\s+/);
    const n = lng === 'ar' ? 1 : 2;
    return (
      <>
        <span className="text-[#E19F00]">{words.slice(0, n).join(' ')} </span>
        <span className="text-[#572b0a]">{words.slice(n).join(' ')}</span>
      </>
    );
  };

  const ITEMS_TO_SHOW = visibleCount;   

  const handleNext = () => {
    if (isTransitioning || startIndex + ITEMS_TO_SHOW >= team.length) return;
    
    setIsTransitioning(true);
    setStartIndex(prev => prev + 1);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isTransitioning || startIndex <= 0) return;
    
    setIsTransitioning(true);
    setStartIndex(prev => prev - 1);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const showArrows = team.length > visibleCount;

  const visibleTeam = team.slice(startIndex, startIndex + ITEMS_TO_SHOW);

  const canGoNext = startIndex + ITEMS_TO_SHOW < team.length;
  const canGoPrev = startIndex > 0;

  return (
    <section className="team-section relative w-full py-16" id="team-section">
      <div className="container lg:max-w-[1190px] mx-auto px-6 md:px-4">
        <h2 className="text-center font-bold text-[32px] mb-4">
          {renderTitle(t('team.title') || 'Our Team')}
        </h2>
        <p className="text-center text-[#666666] mb-12 max-w-2xl mx-auto">
          {t('team.description') || 'فريقنا يعمل بكل احترافية لضمان تقديم أفضل مستوى من الدعم والخدمة في أي وقت تحتاج فيه المساعدة'}
        </p>

        {loading ? (
          <SkeletonCard length={4} className="md:min-w-[250px]!" />
        ) : team.length > 0 ? (
          <div className="relative overflow-hidden">
            <div 
              ref={containerRef}
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300 ease-in-out ${
                isTransitioning ? 'opacity-95 scale-[0.995]' : 'opacity-100 scale-100'
              }`}
            >
              {visibleTeam.map((member, index) => (
                <div 
                  key={member.id} 
                  className={`flex justify-center transition-all duration-300 ease-in-out transform ${
                    isTransitioning 
                      ? index === 0 && startIndex > 0 
                        ? 'translate-x-[-20px] opacity-0' 
                        : index === ITEMS_TO_SHOW - 1 && canGoNext
                        ? 'translate-x-[20px] opacity-0'
                        : 'opacity-95'
                      : 'translate-x-0 opacity-100'
                  }`}
                  style={{
                    transitionDelay: isTransitioning ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="team-card bg-white w-full max-w-[280px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    {member.image && (
                      <div className="relative w-full h-[280px]">
                        <Image
                          src={member.image}
                          alt={member.name?.[lng] || member.name || 'Team Member'}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4 text-center bg-white">
                      <h3 className="text-xl font-bold text-[#572b0a] mb-1 transition-colors duration-300">
                        {member.name?.[lng] || member.name}
                      </h3>
                      <p className="text-[14px] text-[#999999] transition-colors duration-300">
                        {member.position?.[lng] || member.position}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showArrows && (
              <div className="flex justify-start gap-4 mt-8 relative z-50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePrev();
                  }}
                  disabled={!canGoPrev || isTransitioning}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    !canGoPrev || isTransitioning
                      ? 'bg-[#f5f5f5] text-[#cccccc] cursor-not-allowed'
                      : 'bg-[#FFE8B8] text-[#E19F00] hover:bg-[#E19F00] hover:text-white hover:scale-110 active:scale-95 cursor-pointer'
                  }`}
                  aria-label="Previous"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ${
                      !canGoPrev || isTransitioning ? '' : 'hover:-translate-x-1'
                    }`}
                  >
                    <polyline points={lng === 'ar' ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={!canGoNext || isTransitioning}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    !canGoNext || isTransitioning
                      ? 'bg-[#f5f5f5] text-[#cccccc] cursor-not-allowed'
                      : 'bg-[#FFE8B8] text-[#E19F00] hover:bg-[#E19F00] hover:text-white hover:scale-110 active:scale-95 cursor-pointer'
                  }`}
                  aria-label="Next"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ${
                      !canGoNext || isTransitioning ? '' : 'hover:translate-x-1'
                    }`}
                  >
                    <polyline points={lng === 'ar' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-[#666666]">
            {t('team.no_members') || 'No team members available'}
          </p>
        )}
      </div>
    </section>
  );
};

export default TeamSection;