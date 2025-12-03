import AboutSection from "@/components/landingPage/AboutSection";
import ServicesSection from "@/components/landingPage/ServicesSection";
import { useTranslation } from '../../i18n/index'

export default async function AboutUsPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  
  return (
    <div className="about-us-page bg-[#fdfef9] overflow-hidden w-full relative min-h-screen pb-[120px]">
      <main className="pt-[50px] pb-16">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">
          <section className="relative mb-4">
            <h1 className="font-bold text-[#FAB000] text-[32px] sm:text-[40px]">
              {t('nav.about')}
            </h1>
          </section>
        </div>
      </main>
      <AboutSection /> 
      <ServicesSection  />
    </div>
  );
}
