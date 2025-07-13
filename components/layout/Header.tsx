'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { useTheme } from '@/components/contexts/ThemeContext';
import { AuthService } from '@/lib/auth';
import { Sun, Moon, Languages, LogOut, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
  };

  const navigation = currentUser ? [
    { name: t('nav.dashboard'), href: '/dashboard' },
    { name: t('nav.profile'), href: '/profile' },
    { name: t('nav.requests'), href: '/requests' },
  ] : [];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('app.title')}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 rtl:space-x-reverse">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex"
            >
              <Languages className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === 'en' ? 'عربي' : 'English'}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* User Actions */}
            {showAuth && currentUser ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
                  {currentUser.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : showAuth ? (
              <div className="hidden sm:flex space-x-2 rtl:space-x-reverse">
                <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>
                  {t('auth.login')}
                </Button>
                <Button size="sm" onClick={() => router.push('/auth/register')}>
                  {t('auth.register')}
                </Button>
              </div>
            ) : null}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"}>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  <div className="border-t pt-4 space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                      className="w-full justify-start"
                    >
                      <Languages className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {language === 'en' ? 'عربي' : 'English'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="w-full justify-start"
                    >
                      {theme === 'light' ? (
                        <Moon className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      ) : (
                        <Sun className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      )}
                      {t('nav.theme')}
                    </Button>
                    
                    {showAuth && currentUser ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t('nav.logout')}
                      </Button>
                    ) : showAuth ? (
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.push('/auth/login')}
                          className="w-full"
                        >
                          {t('auth.login')}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => router.push('/auth/register')}
                          className="w-full"
                        >
                          {t('auth.register')}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}