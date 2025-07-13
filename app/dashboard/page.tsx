'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { AuthService, BloodRequest, DonorProfile, RecipientProfile } from '@/lib/auth';
import { Heart, Users, Calendar, MapPin, Plus, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import BloodTypeBadge from '@/components/ui/blood-type-badge';
import UrgencyBadge from '@/components/ui/urgency-badge';

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    matchingRequests: 0,
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (!currentUser.profile) {
      router.push('/profile/setup');
      return;
    }

    // Load data based on user role
    const allRequests = AuthService.getBloodRequests();
    
    if (currentUser.role === 'donor') {
      const donorProfile = currentUser.profile as DonorProfile;
      const matchingRequests = AuthService.getMatchingRequests(donorProfile);
      setRequests(matchingRequests);
      setStats({
        totalRequests: allRequests.length,
        activeRequests: allRequests.filter(r => r.status === 'active').length,
        matchingRequests: matchingRequests.length,
      });
    } else if (currentUser.role === 'recipient') {
      const myRequests = allRequests.filter(r => r.recipientId === currentUser.id);
      setRequests(myRequests);
      setStats({
        totalRequests: myRequests.length,
        activeRequests: myRequests.filter(r => r.status === 'active').length,
        matchingRequests: 0,
      });
    }
  }, [currentUser, router]);

  const handleRespondToRequest = (requestId: string) => {
    if (currentUser) {
      AuthService.respondToRequest(requestId, currentUser.id);
      // Refresh the requests
      const allRequests = AuthService.getBloodRequests();
      const donorProfile = currentUser.profile as DonorProfile;
      const matchingRequests = AuthService.getMatchingRequests(donorProfile);
      setRequests(matchingRequests);
    }
  };

  if (!currentUser || !currentUser.profile) {
    return null;
  }

  const isDonor = currentUser.role === 'donor';
  const donorProfile = isDonor ? currentUser.profile as DonorProfile : null;
  const recipientProfile = !isDonor ? currentUser.profile as RecipientProfile : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.welcome')}, {currentUser.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isDonor ? t('dashboard.donor.title') : t('dashboard.recipient.title')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isDonor ? t('dashboard.matchingRequests') : t('dashboard.myActiveRequests')}
              </CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isDonor ? stats.matchingRequests : stats.activeRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.activeRequests')}</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isDonor ? t('dashboard.lastDonation') : t('dashboard.totalDonations')}
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isDonor 
                  ? (donorProfile?.lastDonationDate ? new Date(donorProfile.lastDonationDate).toLocaleDateString() : 'Never')
                  : stats.totalRequests
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.quickActions')}
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => router.push('/profile')}>
              <Users className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('profile.editProfile')}
            </Button>
            
            {!isDonor && (
              <Button onClick={() => router.push('/requests/create')}>
                <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('requests.create')}
              </Button>
            )}
            
            <Button variant="outline" onClick={() => router.push('/requests')}>
              <Heart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('requests.title')}
            </Button>
          </div>
        </div>

        {/* Requests Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isDonor ? t('requests.availableRequests') : t('requests.myRequests')}
            </h2>
            {!isDonor && (
              <Button onClick={() => router.push('/requests/create')}>
                <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('requests.createNew')}
              </Button>
            )}
          </div>

          {requests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('requests.noRequests')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isDonor 
                    ? 'No matching blood requests found in your area.'
                    : 'You haven\'t created any blood requests yet.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => {
                const hasResponded = request.interestedDonors.some(d => d.donorId === currentUser?.id);
                
                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <BloodTypeBadge bloodType={request.bloodType} />
                          <UrgencyBadge urgency={request.urgencyLevel} />
                        </div>
                        <div className="text-right rtl:text-left">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.unitsNeeded} units
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          {request.city} - {request.hospital}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>

                        {request.notes && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {request.notes}
                          </p>
                        )}

                        {!isDonor && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t('requests.interestedDonors')}: {request.interestedDonors.length}
                            </p>
                          </div>
                        )}

                        {isDonor && (
                          <div className="mt-4">
                            {hasResponded ? (
                              <Button variant="outline" disabled className="w-full">
                                {t('requests.contacted')}
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handleRespondToRequest(request.id)}
                                className="w-full"
                              >
                                {t('requests.respond')}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}