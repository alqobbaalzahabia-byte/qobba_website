import { useTranslation } from '../../i18n'
import { createServerClient } from '@/lib/supabase-server'
import ServiceForm from '@/app/[lng]/contact/ServiceForm'
import ProjectForm from '@/app/[lng]/contact/ProjectForm'
import LoginForm from '@/app/[lng]/contact/LoginForm'
import AboutUsForm from '@/app/[lng]/contact/AboutUsForm'
import PlansForm from '@/app/[lng]/contact/PlansForm'
import TestimonialsForm from '@/app/[lng]/contact/TestimonialsForm'
import BlogForm from '@/app/[lng]/contact/BlogForm'
export default async function ContactPage({ params }) {
  const { lng } = await params
  const { t } = await useTranslation(lng)

  const supabase = createServerClient()
  const { data: services } = await supabase.from('services').select('*')

  return (
    <div className="min-h-screen py-16 px-4 bg-[#fdfef9]">
      <h1 className="text-4xl font-bold text-[#572b0a] mb-8 text-center ">
        {t('contact.title')}
      </h1>

      <div className="max-w-4xl mx-auto">
        {/* <LoginForm lng={lng} /> */}
      </div>
      <div className="max-w-4xl mx-auto">
        {/* <ServiceForm lng={lng} /> */}
      </div>
      <div className="max-w-4xl mx-auto">
        {/* <ProjectForm lng={lng} /> */}
      </div>
      <div className="max-w-4xl mx-auto">
        {/* <AboutUsForm lng={lng} /> */}
      </div>
      <div className="max-w-4xl mx-auto">
        {/* <PlansForm lng={lng} /> */}
      </div>
      <div className="max-w-4xl mx-auto">
        {/* <TestimonialsForm lng={lng} /> */}
      </div>
      <div className="max-w-4xl mx-auto">
        <BlogForm lng={lng} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 hidden">
        {services?.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg border">
            {service.image && (
              <img src={service.image} alt="" className="w-full h-48 object-cover mb-4" />
            )}
            <h2 className="text-xl font-bold text-[#572b0a] mb-2 ">
              {service.title?.[lng] }
            </h2>
            <p className="text-[#666666] ">
              {service.description?.[lng]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

