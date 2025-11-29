"use client";

import React, { use, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

const Screen = ({ params }) => {
  const { lng } = use(params);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus("invalid_email");
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([
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

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("submission_error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: lng === "ar" ? "البريد الإلكتروني" : "Email",
      value: "alqobaalzahabia@gmail.com",
      link: "mailto:alqobaalzahabia@gmail.com",
    },
    {
      icon: FiPhone,
      title: lng === "ar" ? "الهاتف" : "Phone",
      value: "+971 50 97 14136",
      link: "tel:+971509714136",
    },
    {
      icon: FiMapPin,
      title: lng === "ar" ? "العنوان" : "Address",
      value:
        lng === "ar"
          ? "دبي، الإمارات العربية المتحدة"
          : "Deira, Dubai, United Arab Emirates",
      link: null,
    },
  ];

  const getStatusMessage = () => {
    switch (submitStatus) {
      case "success":
        return {
          type: "success",
          text:
            lng === "ar"
              ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً."
              : "Message sent successfully! We'll get back to you soon.",
        };
      case "error":
        return {
          type: "error",
          text:
            lng === "ar"
              ? "يرجى ملء جميع الحقول المطلوبة"
              : "Please fill in all required fields",
        };
      case "invalid_email":
        return {
          type: "error",
          text:
            lng === "ar"
              ? "يرجى إدخال عنوان بريد إلكتروني صالح"
              : "Please enter a valid email address",
        };
      case "submission_error":
        return {
          type: "error",
          text:
            lng === "ar"
              ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
              : "An error occurred while sending the message. Please try again.",
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative">
      <main className="pt-[50px] pb-20">
        <div className="container mx-auto lg:max-w-[1150px] px-4 sm:px-6">
          <section className="relative animate-fade-in opacity-0 [--animation-delay:200ms] mb-12">
            <h1 className="font-bold text-[#172436] text-3xl sm:text-[32px] leading-normal tracking-[0] mb-4">
              {lng === "ar" ? "تواصل معنا" : "Contact Us"}
            </h1>
            <p className="font-normal text-[#585858] text-lg sm:text-xl leading-7 tracking-[0] max-w-[600px]">
              {lng === "ar"
                ? "نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت ممكن."
                : "We're here to help. Get in touch with us and we'll respond as soon as possible."}
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <section className="relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
              <div className="bg-white rounded-xl border border-solid border-[#e5e5e5] shadow-cards p-6 sm:p-8">
                <h2 className="font-bold text-[#172436] text-xl sm:text-2xl mb-6">
                  {lng === "ar" ? "أرسل لنا رسالة" : "Send us a Message"}
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
                      {lng === "ar" ? "الاسم الكامل" : "Full Name"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9d9d9] focus:border-[#f0a647] focus:outline-none focus:ring-2 focus:ring-[#f0a647]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436]"
                      placeholder={
                        lng === "ar"
                          ? "أدخل اسمك الكامل"
                          : "Enter your full name"
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {lng === "ar" ? "البريد الإلكتروني" : "Email Address"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9d9d9] focus:border-[#f0a647] focus:outline-none focus:ring-2 focus:ring-[#f0a647]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436]"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {lng === "ar" ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9d9d9] focus:border-[#f0a647] focus:outline-none focus:ring-2 focus:ring-[#f0a647]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436]"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {lng === "ar" ? "الموضوع" : "Subject"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-[#d9d9d9] focus:border-[#f0a647] focus:outline-none focus:ring-2 focus:ring-[#f0a647]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#172436]"
                      placeholder={
                        lng === "ar"
                          ? "كيف يمكننا مساعدتك؟"
                          : "How can we help you?"
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[#172436] font-medium mb-2 text-sm">
                      {lng === "ar" ? "الرسالة" : "Message"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={loading}
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg border border-[#d9d9d9] focus:border-[#f0a647] focus:outline-none focus:ring-2 focus:ring-[#f0a647]/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-[#172436]"
                      placeholder={
                        lng === "ar"
                          ? "اكتب رسالتك هنا..."
                          : "Write your message here..."
                      }
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#f0a647] hover:bg-[#e09537] text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span>
                        {lng === "ar" ? "جاري الإرسال..." : "Sending..."}
                      </span>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>
                          {lng === "ar" ? "إرسال الرسالة" : "Send Message"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            <section className="relative translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
              <div className="space-y-6">
                <h2 className="font-bold text-[#172436] text-xl sm:text-2xl mb-8">
                  {lng === "ar" ? "معلومات الاتصال" : "Contact Information"}
                </h2>

                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-solid border-[#e5e5e5] shadow-cards p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f0a647]/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-[#f0a647]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#172436] text-base sm:text-lg mb-2">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-[#585858] hover:text-[#f0a647] transition-colors text-sm sm:text-base break-words"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-[#585858] text-sm sm:text-base">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="relative bg-white rounded-xl border border-solid border-[#e5e5e5] shadow-cards overflow-hidden h-[250px] sm:h-[300px]">
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

                <div className="bg-white rounded-xl border border-solid border-[#e5e5e5] shadow-cards p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#f0a647]/10 flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-[#f0a647]" />
                    </div>
                    <h3 className="font-bold text-[#172436] text-base sm:text-lg">
                      {lng === "ar" ? "ساعات العمل" : "Business Hours"}
                    </h3>
                  </div>
                  <div className="space-y-3 text-[#585858] text-sm sm:text-base">
                    <div className="flex justify-between items-center py-2 border-b border-[#e5e5e5] last:border-b-0">
                      <span className="font-medium">
                        {lng === "ar" ? "الاثنين - السبت" : "Monday - Saturday"}
                      </span>
                      <span className="text-[#172436] font-semibold">
                        9:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">
                        {lng === "ar" ? "الأحد" : "Sunday"}
                      </span>
                      <span className="text-red-500 font-semibold">
                        {lng === "ar" ? "مغلق" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Screen;