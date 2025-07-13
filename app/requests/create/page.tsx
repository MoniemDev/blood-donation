'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { AuthService, BloodType, RecipientProfile } from '@/lib/auth';
import Header from '@/components/layout/Header';

export default function CreateRequestPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: 'O+' as BloodType,
    unitsNeeded: 1,
    city: '',
    hospital: '',
    urgencyLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    notes: '',
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (currentUser.role !== 'recipient') {
      router.push('/dashboard');
      return;
    }

    if (!currentUser.profile) {
      router.push('/profile/setup');
      return;
    }

    // Pre-fill with recipient profile data
    const recipientProfile = currentUser.profile as RecipientProfile;
    setFormData(prev => ({
      ...prev,
      city: recipientProfile.city,
      hospital: recipientProfile.hospitalName,
    }));
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      AuthService.createBloodRequest({
        recipientId: currentUser!.id,
        bloodType: formData.bloodType,
        unitsNeeded: formData.unitsNeeded,
        city: formData.city,
        hospital: formData.hospital,
        urgencyLevel: formData.urgencyLevel,
        notes: formData.notes,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'recipient') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t('requests.createNew')}</CardTitle>
            <CardDescription>
              Create a new blood request to connect with potential donors in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">{t('profile.bloodType')}</Label>
                  <Select 
                    value={formData.bloodType} 
                    onValueChange={(value) => setFormData({ ...formData, bloodType: value as BloodType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitsNeeded">{t('requests.unitsNeeded')}</Label>
                  <Input
                    id="unitsNeeded"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t('profile.city')}</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="City where blood is needed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">{t('requests.hospital')}</Label>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    required
                    placeholder="Hospital or location"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="urgencyLevel">{t('requests.urgency')}</Label>
                  <Select 
                    value={formData.urgencyLevel} 
                    onValueChange={(value) => setFormData({ ...formData, urgencyLevel: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center">
                          <span className="mr-2 rtl:mr-0 rtl:ml-2">🟢</span>
                          {t('requests.urgency.low')}
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center">
                          <span className="mr-2 rtl:mr-0 rtl:ml-2">🟡</span>
                          {t('requests.urgency.medium')}
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center">
                          <span className="mr-2 rtl:mr-0 rtl:ml-2">🟠</span>
                          {t('requests.urgency.high')}
                        </div>
                      </SelectItem>
                      <SelectItem value="critical">
                        <div className="flex items-center">
                          <span className="mr-2 rtl:mr-0 rtl:ml-2">🔴</span>
                          {t('requests.urgency.critical')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">{t('requests.notes')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional information or special requirements"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-4 rtl:space-x-reverse">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? t('common.loading') : t('requests.create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}