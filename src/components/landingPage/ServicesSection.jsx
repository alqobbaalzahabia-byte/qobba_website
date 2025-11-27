'use client'

import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SkeletonCard  from '@/components/ui/SkeletonCard'
import Image from "next/image";
const ServicesSection = ({ t, lng }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (error) {
        console.error('Error fetching services:', error);
      } else {
        console.log('Services data:', data);
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <section className="services-section relative w-full ">
      <div className="container lg:max-w-[1190px] mx-auto px-6 md:px-4 mt-16">
        <h2 className="text-center font-bold text-[#572b0a] text-[32px] mb-8">
          {t('services.title')}
        </h2>
        {loading ? (
          <SkeletonCard  length={4} className="md:!min-w-[200px]"/>
        ) : services.length > 0 && (
          <div className="services-data grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4  sm:gap-6">
            {services.map((service) => (
              <div className="flex justify-center" key={service.id}>  
              <Card  className="service-card bg-white w-full sm:max-w-[198px] rounded-lg border border-[#e8e8e8] hover:shadow-lg transition-shadow overflow-hidden">
                {service.image && (
                  <Image
                    src={service.image} 
                    alt={service.title?.[lng] || 'Service'} 
                    width={198}
                    height={198}
                    quality={90}
                    className="w-full h-48 object-cover p-0" 
                  />
                )}
                <div className="">
                  <h3 className=" px-6 py-3 text-center text-xl font-bold text-[#572b0a] ">
                    {service.title?.[lng] || service.title}
                  </h3>
                  <p className=" px-4 pb-3 text-[12px]  text-center text-[#666666] leading-[16px]">
                    {service.description?.[lng] || service.description}
                  </p>
                </div>
              </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

