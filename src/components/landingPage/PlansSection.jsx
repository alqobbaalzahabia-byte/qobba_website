'use client'

import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase'
import Button from '../ui/Button'
import Card from '../ui/Card'
import SkeletonCard from '../ui/SkeletonCard'
import { FaCheck } from "react-icons/fa6";
import plansOverlay1 from '@/../public/assets/plans-overlay1.png'
import plansOverlay2 from '@/../public/assets/plans-overlay2.png'
import Image from "next/image";
const PlansSection = ({ t, lng }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
      } else {
        setPlans(data || []);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  const calculateDiscountPrice = (price, discount) => {
    if (!discount || discount === 0) return price;
    return price * (1 - discount / 100);
  };

  return (
    <section className="plans-section relative w-full py-6  ">
      <div className="container mx-auto max-w-[800px] relative z-9 px-4">
        <h2 className="text-center font-bold text-[#585858] text-[40px] mb-4 sticky z-5">
          {t('pricing.title') || 'Pricing Plans'}
        </h2>
        <p className="text-center font-medium text-[#878787] text-xl mb-6 max-w-[530px] mx-auto sticky z-5">
          {t('pricing.subtitle') || 'Choose the perfect plan for your needs'}
        </p>

        <div className="flex items-center justify-center mb-12 sticky z-5">
          <div className="relative w-[229px] h-11">
            <div className="font-medium text-[#a6a6a6] text-xl text-center p-2 bg-white rounded-[20px] shadow-[0px_1px_8px_#00000014]">
              {t('pricing.serviceType')}
            </div>
          </div>
        </div>
        <Image src={plansOverlay1} alt="Plans overlay" className=" absolute z-0 -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[600px]" />

        {loading ? (
          <div className="flex justify-center gap-[42px] flex-wrap ">
            <SkeletonCard length={2} />
          </div>
        ) : plans.length > 0 ? (
          <div className="flex justify-center gap-6 lg:gap-11 flex-wrap sm:flex-nowrap">
            {plans.map((plan, planIndex) => {
              const currency = plan.currency?.[lng] || 'AED';
              const discountedPrice = calculateDiscountPrice(plan.price, plan.discount);
              const features = plan.features?.[lng] || [];
              const title = plan.title?.[lng] || '';

              const buttonVariant = plan.type === 'premium' ? 'gradient' : 'outline';

              return (
                <article
                  key={plan.id}
                  className={` px-2 pb-4 shadow-md hover:shadow-lg transition-shadow duration-300  w-[90%] sm:w-[300px] md:w-[350px]  lg:w-[379px] h-auto  relative opacity-0 -translate-y-4 animate-fade-in bg-white rounded-[18px] ${plan.type === 'premium' ? 'order-8' : ''}`}
                  style={{
                    "--animation-delay": `${planIndex * 200}ms`,
                  }}
                >
                  <Card className="lg:w-[363px] pb-3 px-2  mx-auto mt-2 rounded-[18px] bg-[linear-gradient(90deg,#FFF8EC_0%,#FFEDD1_100%)] border-0 shadow-none">
                    <div className="relative  px-2">
                      <h3 className=" font-bold pt-2 text-[#585858] md:text-[18px] lg:text-[24px] leading-[normal] tracking-[0]">
                        {title}
                      </h3>

                      <div className="plan-price flex justify-center gap-4">
                        <div className={` flex items-center gap-0 ${lng === 'ar' ? 'order-5' : ''} `}>
                          <span className="font-bold text-[#f0a647]  text-[30px] sm:text-[48px] lg:text-[60px]  whitespace-nowrap">
                            {discountedPrice.toFixed(0)}
                          </span>
                          <span className="font-bold text-[18px] lg:text-[38px] text-[#f0a647]">
                            {currency}
                          </span>
                        </div>

                        {plan.discount > 0 && (
                          <div className=" flex items-center before:block before:w-[109%] before:h-1 before:bg-[#A6A6A6] relative  before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:rounded-full ">
                            <span className="font-bold text-[22px] lg:text-[38px] text-[#a6a6a6]  tracking-[0] leading-[normal] whitespace-nowrap">
                              {plan.price.toFixed(0)}
                            </span>
                            <span className="font-bold text-[16px] lg:text-[22px] pb-1.5 text-[#a6a6a6]  leading-[normal] whitespace-nowrap tracking-[0]">
                              {currency}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button
                        className={`cursor-pointer w-full sm:w-[90%] md:w-full lg:w-[331px] rounded-[18px] h-auto transition-transform hover:scale-105 ${buttonVariant === "gradient"
                            ? "bg-gradient-button text-white border-0"
                            : "bg-transparent text-[#f0a647] border border-[#f0a647] hover:bg-[#f0a647]/10"
                          }`}
                      >
                        <span className="font-bold text-[22px]  sm:text-[24px] md:text-[28px] leading-[normal] whitespace-nowrap tracking-[0]">
                          {plan.type === 'premium' ? t('pricing.premium.select') : t('pricing.basic.select')}
                        </span>
                      </Button>
                    </div>
                  </Card>

                  <ul className="w-full space-y-2 pt-3 ">
                    {features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-center  gap-1 px-2 sm:px-5`}
                      >
                        <span className=" flex items-center gap-1 font-medium text-[#585858] md:text-xl leading-[normal] tracking-[0]">
                          <FaCheck className={` ${plan.type === 'premium' ? " text-green-500 " : "text-[#FECF85]"} relative top-1  w-6 h-6 shrink-0`} />
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-[#666666] text-lg">
            {t('pricing.noPlans') || 'No plans available now.'}
          </div>
        )}

      </div>
      <Image src={plansOverlay2} alt="Plans overlay" className="hidden sm:block w-full xl:h-[300px] absolute z-0 sm:top-[49%] left-1/2 -translate-x-1/2" />
    </section>
  );
};

export default PlansSection;

