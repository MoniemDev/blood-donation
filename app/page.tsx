'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { AuthService } from '@/lib/auth';
import { Heart, Users, MapPin, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    AuthService.initializeData();
    
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const features = [
    {
      icon: Heart,
      title: 'Easy Donation Process',
      description: 'Simple and quick registration for blood donors with profile management.',
    },
    {
      icon: Users,
      title: 'Connect with Recipients',
      description: 'Direct connection between donors and recipients or hospitals in need.',
    },
    {
      icon: MapPin,
      title: 'Location-Based Matching',
      description: 'Find blood requests in your city with intelligent matching algorithms.',
    },
    {
      icon: Clock,
      title: 'Urgent Request Alerts',
      description: 'Get notified about critical blood requests that match your profile.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Header showAuth={true} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('app.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('app.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => router.push('/auth/register')}
              >
                <Heart className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('auth.register')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/auth/login')}
              >
                {t('auth.login')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How BloodConnect Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform makes it easy to connect blood donors with recipients through a simple, 
              secure, and efficient process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of donors and recipients already using BloodConnect to make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={() => router.push('/auth/register')}
            >
              Get Started Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600"
              onClick={() => router.push('/auth/login')}
            >
              Try Demo Accounts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}