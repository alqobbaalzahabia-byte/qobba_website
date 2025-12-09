'use client'

import React from "react";
import Link from 'next/link'
import { useTranslation } from '../i18n/client'
import Header from '../../components/common/Header'
import ServicesSection from '@/components/landingPage/ServicesSection'
import ProjectsSection from '@/components/landingPage/ProjectsSection'
import AboutSection from '@/components/landingPage/AboutSection'
import HeroSection from '@/components/landingPage/HeroSection'
import PlansSection from '@/components/landingPage/PlansSection'
import TeamSection from "@/components/landingPage/TeamSection";
import TestimonialsSection from '@/components/landingPage/TestimonialsSection'
import { use } from 'react';
import Footer from '@/components/common/Footer'
import ChatBot from '@/components/common/ChatBot'

const App = ({ params }) => {
  const { lng } = use(params)
  const { t } = useTranslation(lng)

  return (
    <div className="bg-[#fdfef9] overflow-hidden w-full  relative"
      data-model-id="52:1826"
    >

      {/* Hero Section */}
      <HeroSection t={t} lng={lng} />

      {/* Services Section */}
      <ServicesSection/>

      {/* Projects Section */}
      <ProjectsSection t={t} lng={lng} />

      {/* About Section */}
      <AboutSection />


      {/* Team Section */}
      <TeamSection />

      {/* Plans Section */}
      <PlansSection t={t} lng={lng} />


      {/* Testimonials Section */}
      <TestimonialsSection t={t} lng={lng} />

      {/* ChatBot Component */}
      {/* <ChatBot lng={lng} /> */}

    </div>
  );
};

export default App
