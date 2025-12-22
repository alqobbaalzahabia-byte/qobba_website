"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { TiThMenu } from "react-icons/ti";
import { IoCloseSharp } from "react-icons/io5";
import {
  FaTools,
  FaFolder,
  FaBlog,
  FaInfoCircle,
  FaSignOutAlt,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import AuthMiddleware from "@/components/auth/AuthMiddleware";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/app/i18n/client";

export default function DashboardLayout({ children, params }) {
  const { lng } = use(params);
  const { t } = useTranslation(lng);
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isActive = (path) => {
    return pathname === `/${lng}/dashboard${path}`;
  };

  const navItems = [
    { label: t('dashboard.sidebar.services'), href: "/services", icon: <FaTools /> },
    { label: t('dashboard.sidebar.projects'), href: "/projects", icon: <FaFolder /> },
    // { label: t('dashboard.sidebar.blogs'), href: "/blogs", icon: <FaBlog /> },
    { label: t('dashboard.sidebar.aboutUs'), href: "/about-us", icon: <FaInfoCircle /> },
    { label: t('dashboard.sidebar.team'), href: "/team", icon: <FaUsers /> },
    { label: t('dashboard.sidebar.reviews'), href: "/reviews", icon: <FaStar /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminId");
    router.push(`/${lng}/login`);
  };

  const isRTL = lng === 'ar';

  return (
    <AuthMiddleware lng={lng}>
      <div className="min-h-screen bg-[#fdfef9]">
        {/* Sidebar */}
        <aside
          className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 h-full bg-white ${isRTL ? 'border-l' : 'border-r'} border-gray-200 shadow-sm z-40 ${
            isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <div className={`p-6 ${isSidebarOpen ? "block" : "hidden"}`}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-[#FAB000]">{t('dashboard.sidebar.title')}</h1>
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={`/${lng}/dashboard${item.href}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-gradient-button text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher lng={lng} />

            <button
              onClick={handleLogout}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt />
              <span className="font-medium">{t('dashboard.sidebar.logout')}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`p-8 ${isSidebarOpen ? (isRTL ? "mr-64" : "ml-64") : ""}`}>
          <button
            onClick={toggleSidebar}
            className={`cursor-pointer fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors`}
            aria-label="Open sidebar"          >
            {isSidebarOpen ? (
              <IoCloseSharp className="text-2xl" />
            ) : (
              <TiThMenu className="text-2xl" />
            )}
          </button>

          {children}
        </main>
      </div>
    </AuthMiddleware>
  );
}
