"use client";

import React, { use, useState } from "react";
import { FiMail, FiPhone, FiSend } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import mainLogo from "@/../public/assets/main-logo.svg";
import { useTranslation } from "@/app/i18n/client";

const Screen = ({ params }) => {
  const { lng } = use(params);
  const { t } = useTranslation(lng, 'common');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validationRules = {
    name: { required: true, maxLength: 100 },
    email: { required: true, maxLength: 254, pattern:/^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/},
    phone: { required: false, maxLength: 20, pattern: /^[+\d\s()-]+$/ },
    subject: { required: true, maxLength: 150 },
    message: { required: true, maxLength: 500 },
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    value = value.trim();
    
    if (rules.required && !value.trim()) {
      return t('contactUs.fieldRequired');
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      return t('contactUs.maxCharacters', { count: rules.maxLength });
    }

    if (name === "email" && value && !rules.pattern.test(value)) {
      return t('contactUs.validEmail');
    }

    if (name === "phone" && value && !rules.pattern.test(value)) {
      return t('contactUs.validPhone');
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      // Don't set any top message for validation errors
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("submission_error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (submitStatus) {
      case "success":
        return {
          type: "success",
          text: t('contactUs.successMessage')
        };
      case "submission_error":
        return {
          type: "error",
          text: t('contactUs.submissionError')
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  const agents = [
    {
      country: t('contactUs.agents.dubai.country'),
      agentName: t('contactUs.agents.dubai.name'),
      description: t('contactUs.agents.dubai.description'),
      email: "info@alqoba.ae",
      phone: "+971 50 123 4567",
    },
    {
      country: t('contactUs.agents.abudhabi.country'),
      agentName: t('contactUs.agents.abudhabi.name'),
      description: t('contactUs.agents.abudhabi.description'),
      email: "support@alqoba.ae",
      phone: "+971 52 987 6543",
    },
    {
      country: t('contactUs.agents.sharjah.country'),
      agentName: t('contactUs.agents.sharjah.name'),
      description: t('contactUs.agents.sharjah.description'),
      email: "contact@alqoba.ae",
      phone: "+971 55 778 3344",
    },
  ];

  return (
    <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative">
      <main className="pt-[50px] pb-20">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">
          <div className="mb-12">
            <h1 className="font-bold text-[#172436] text-3xl sm:text-[32px] leading-normal tracking-[0]">
              {t('contactUs.title')}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <section className="relative -translate-y-4 animate-fade-in opacity-0 [--animation-delay:200ms]">
              <div className="mb-12">
                <h2 className="font-semibold text-[#f0a647] text-xl sm:text-2xl leading-normal tracking-[0] mb-4">
                  {t('contactUs.contactWithUs')}
                </h2>
                <p className="font-normal text-[#585858] text-base sm:text-lg leading-7 tracking-[0] max-w-[500px]">
                  {t('contactUs.contactDescription')}
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-[#172436] text-lg sm:text-xl mb-3">
                    {t('contactUs.contactWithPhone')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-[#f0a647]" />
                    <a
                      href="tel:+971509714136"
                      className="text-[#172436] hover:text-[#f0a647] transition-colors text-base sm:text-lg font-medium"
                      dir="ltr"
                    >
                      +971 50 97 14136
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#172436] text-lg sm:text-xl mb-3">
                    {t('contactUs.contactWithWhatsApp')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#25D366]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <a
                      href="https://wa.me/971509714136"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#172436] hover:text-[#25D366] transition-colors text-base sm:text-lg font-medium"
                      dir="ltr"
                    >
                      +971 50 97 14136
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#172436] text-lg sm:text-xl mb-3">
                    {t('contactUs.contactWithEmail')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-[#f0a647]" />
                    <a
                      href="mailto:alqobaalzahabia@gmail.com"
                      className="text-[#172436] hover:text-[#f0a647] transition-colors text-base sm:text-lg font-medium wrap-break-word"
                      dir="ltr"
                    >
                      alqobaalzahabia@gmail.com
                    </a>
                  </div>
                </div>

                <div className="relative bg-white rounded-xl border border-solid border-[#e5e5e5] shadow-cards overflow-hidden h-[300px] sm:h-[350px] mt-8">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d225.5225117051732!2d55.32891211295984!3d25.25846619764613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cdbc56cbec1%3A0x92f489fc28aa3fff!2sHorizon%20Building!5e0!3m2!1sen!2sae!4v1764406448359!5m2!1sen!2sae"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Company Location"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#172436] px-3 py-2 rounded-lg shadow-md font-semibold text-sm">
                    Office 42
                  </div>
                </div>
              </div>
            </section>

            <section className="relative -translate-y-4 animate-fade-in opacity-0 [--animation-delay:400ms]">
              <div className="bg-[#fef9f0] rounded-xl border border-[#d3d3d3]/30 shadow-lg p-6 sm:p-8">
                <h2 className="font-bold text-[#f0a647] text-xl sm:text-2xl mb-6">
                  {t('contactUs.sendMessage')}
                </h2>

                {statusMessage && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      statusMessage.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p
                      className={`font-medium text-sm ${
                        statusMessage.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {statusMessage.text}
                    </p>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {t('contactUs.fullName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      maxLength={validationRules.name.maxLength}
                      className={`w-full px-4 py-3 border-0 rounded-2xl focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436] bg-white ${
                        errors.name ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder={t('contactUs.namePlaceholder')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {t('contactUs.emailAddress')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      maxLength={validationRules.email.maxLength}
                      className={`w-full px-4 py-3 border-0 rounded-2xl focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436] bg-white ${
                        errors.email ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {t('contactUs.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      maxLength={validationRules.phone.maxLength}
                      className={`w-full px-4 py-3 border-0 rounded-2xl focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436] bg-white ${
                        errors.phone ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="+971 XX XXX XXXX"
                      dir="ltr"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {t('contactUs.subject')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      maxLength={validationRules.subject.maxLength}
                      className={`w-full px-4 py-3 border-0 rounded-2xl focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436] bg-white ${
                        errors.subject ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder={t('contactUs.subjectPlaceholder')}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {t('contactUs.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      maxLength={validationRules.message.maxLength}
                      rows="5"
                      className={`w-full px-4 py-3 border-0 rounded-2xl focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-[#172436] bg-white ${
                        errors.message ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder={t('contactUs.messagePlaceholder')}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message ? (
                        <p className="text-sm text-red-600">{errors.message}</p>
                      ) : (
                        <span></span>
                      )}
                      <p className="text-xs text-gray-500">
                        {formData.message.length}/{validationRules.message.maxLength}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#f0a647] hover:bg-[#e09537] text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span>{t('contactUs.sending')}</span>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>{t('contactUs.sendMessageButton')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-16 pt-12">
            <h2 className="font-bold text-[#172436] text-2xl sm:text-3xl text-center mb-12">
              {t('contactUs.ourAgents')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-16">
              {agents.map((agent, index) => (
                <div
                  key={index}
                  className="bg-linear-to-r from-[#fffbf5] via-[#fff4e4] to-[#ffeccc] rounded-2xl shadow-lg p-6 pt-12 flex flex-col items-center text-center hover:shadow-xl transition-shadow relative"
                >
                  <div className="absolute -top-10 left-6 w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-[#d3d3d3]/30 overflow-hidden">
                    <Image
                      className="w-16 h-16 object-contain"
                      alt="Al qoba"
                      src={mainLogo}
                      width={64}
                      height={64}
                    />
                  </div>

                  <div className="w-full flex items-center justify-between mb-4 px-2 mt-2">
                    <h3 className="text-[#f0a647] font-bold text-lg">
                      {agent.agentName}
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      <svg
                        className="w-4 h-4 rounded-sm"
                        viewBox="0 0 640 480"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path fill="#00732f" d="M0 0h640v160H0z" />
                          <path fill="#ffffff" d="M0 160h640v160H0z" />
                          <path fill="#000000" d="M0 320h640v160H0z" />
                          <path fill="#ce1126" d="M0 0h240v480H0z" />
                        </g>
                      </svg>
                      {agent.country}
                    </div>
                  </div>

                  <p
                    className="text-[#585858] text-sm leading-relaxed mb-6"
                    style={{ direction: lng === "ar" ? "rtl" : "ltr" }}
                  >
                    {agent.description}
                  </p>

                  <div className="w-full flex items-center justify-between pt-4 border-t border-gray-200 gap-4">
                    <div className="flex items-center gap-2 text-[#172436] text-xs">
                      <FiMail className="w-4 h-4 text-[#f0a647] shrink-0" />
                      <span className="truncate" dir="ltr">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#172436] text-xs">
                      <FiPhone className="w-4 h-4 text-[#f0a647] shrink-0" />
                      <span className="whitespace-nowrap" dir="ltr">{agent.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Screen;