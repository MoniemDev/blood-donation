'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { AuthService, DonorProfile, RecipientProfile, BloodType } from '@/lib/auth';
import Header from '@/components/layout/Header';

export default function ProfileSetupPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  // Donor form state
  const [donorForm, setDonorForm] = useState<DonorProfile>({
    fullName: '',
    age: 18,
    gender: 'male',
    bloodType: 'O+',
    phoneNumber: '',
    city: '',
    lastDonationDate: '',
    isAvailable: true,
    profileVisibility: 'public',
  });

  // Recipient form state
  const [recipientForm, setRecipientForm] = useState<RecipientProfile>({
    name: '',
    hospitalName: '',
    phoneNumber: '',
    city: '',
    organizationType: 'hospital',
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    
    // Pre-fill name if available
    if (currentUser.name) {
      if (currentUser.role === 'donor') {
        setDonorForm(prev => ({ ...prev, fullName: currentUser.name }));
      } else {
        setRecipientForm(prev => ({ ...prev, name: currentUser.name }));
      }
    }
  }, [currentUser, router]);

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      AuthService.updateProfile(donorForm);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      AuthService.updateProfile(recipientForm);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>
              Please provide the necessary information to complete your {currentUser.role} profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser.role === 'donor' ? (
              <form onSubmit={handleDonorSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('profile.personalInfo')}</Label>
                    <Input
                      id="fullName"
                      value={donorForm.fullName}
                      onChange={(e) => setDonorForm({ ...donorForm, fullName: e.target.value })}
                      required
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">{t('profile.age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="65"
                      value={donorForm.age}
                      onChange={(e) => setDonorForm({ ...donorForm, age: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">{t('profile.gender')}</Label>
                    <Select value={donorForm.gender} onValueChange={(value) => setDonorForm({ ...donorForm, gender: value as 'male' | 'female' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('profile.male')}</SelectItem>
                        <SelectItem value="female">{t('profile.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">{t('profile.bloodType')}</Label>
                    <Select value={donorForm.bloodType} onValueChange={(value) => setDonorForm({ ...donorForm, bloodType: value as BloodType })}>
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
                    <Label htmlFor="phoneNumber">{t('profile.phoneNumber')}</Label>
                    <Input
                      id="phoneNumber"
                      value={donorForm.phoneNumber}
                      onChange={(e) => setDonorForm({ ...donorForm, phoneNumber: e.target.value })}
                      required
                      placeholder="+1234567890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t('profile.city')}</Label>
                    <Input
                      id="city"
                      value={donorForm.city}
                      onChange={(e) => setDonorForm({ ...donorForm, city: e.target.value })}
                      required
                      placeholder="Your city"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastDonation">{t('profile.lastDonation')}</Label>
                    <Input
                      id="lastDonation"
                      type="date"
                      value={donorForm.lastDonationDate}
                      onChange={(e) => setDonorForm({ ...donorForm, lastDonationDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">{t('profile.visibility')}</Label>
                    <Select value={donorForm.profileVisibility} onValueChange={(value) => setDonorForm({ ...donorForm, profileVisibility: value as 'public' | 'private' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">{t('profile.public')}</SelectItem>
                        <SelectItem value="private">{t('profile.private')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="availability"
                    checked={donorForm.isAvailable}
                    onCheckedChange={(checked) => setDonorForm({ ...donorForm, isAvailable: checked })}
                  />
                  <Label htmlFor="availability">{t('profile.availability')}</Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.loading') : t('common.save')}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRecipientSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Name</Label>
                    <Input
                      id="name"
                      value={recipientForm.name}
                      onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                      required
                      placeholder="Contact person name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">{t('profile.hospitalName')}</Label>
                    <Input
                      id="hospitalName"
                      value={recipientForm.hospitalName}
                      onChange={(e) => setRecipientForm({ ...recipientForm, hospitalName: e.target.value })}
                      required
                      placeholder="Hospital or clinic name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{t('profile.phoneNumber')}</Label>
                    <Input
                      id="phoneNumber"
                      value={recipientForm.phoneNumber}
                      onChange={(e) => setRecipientForm({ ...recipientForm, phoneNumber: e.target.value })}
                      required
                      placeholder="+1234567890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t('profile.city')}</Label>
                    <Input
                      id="city"
                      value={recipientForm.city}
                      onChange={(e) => setRecipientForm({ ...recipientForm, city: e.target.value })}
                      required
                      placeholder="Your city"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="organizationType">{t('profile.organizationType')}</Label>
                    <Select value={recipientForm.organizationType} onValueChange={(value) => setRecipientForm({ ...recipientForm, organizationType: value as 'hospital' | 'clinic' | 'individual' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">{t('profile.hospital')}</SelectItem>
                        <SelectItem value="clinic">{t('profile.clinic')}</SelectItem>
                        <SelectItem value="individual">{t('profile.individual')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('common.loading') : t('common.save')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}