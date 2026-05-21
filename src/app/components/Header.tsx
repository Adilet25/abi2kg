import { Link, useLocation } from "react-router";
import { GraduationCap, User, Menu, Globe } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { key: "discover", path: "/" },
    { key: "rankings", path: "/rankings" },
    { key: "saved", path: "/profile?tab=saved" },
    { key: "quiz", path: "/quiz" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Abi2KG</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path) && location.search === item.path.split("?")[1])
                    ? "text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1"
              >
                <Globe size={16} />
                <span className="uppercase">{language}</span>
              </button>
              
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                  <button
                    onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('ru'); setLangMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'ru' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Русский
                  </button>
                </div>
              )}
            </div>

            <Link to="/profile" className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-indigo-600">
              <User size={16} />
              <span>Jane Doe</span>
            </Link>
          </div>

          {/* Mobile Menu Button & Lang */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
              className="flex items-center gap-1 text-xs font-bold text-gray-600 uppercase"
            >
              <Globe size={16} />
              {language}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-2">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 mt-4 border-t border-gray-100 pt-4"
            >
              {t('myProfile')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}