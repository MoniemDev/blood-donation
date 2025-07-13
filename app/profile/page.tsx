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
import { User, Edit, Save, X } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

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

    if (!currentUser.profile) {
      router.push('/profile/setup');
      return;
    }

    // Initialize forms with current profile data
    if (currentUser.role === 'donor') {
      setDonorForm(currentUser.profile as DonorProfile);
    } else {
      setRecipientForm(currentUser.profile as RecipientProfile);
    }
  }, [currentUser, router]);

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      AuthService.updateProfile(donorForm);
      setCurrentUser(AuthService.getCurrentUser());
      setEditing(false);
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
      setCurrentUser(AuthService.getCurrentUser());
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset forms to current profile data
    if (currentUser?.profile) {
      if (currentUser.role === 'donor') {
        setDonorForm(currentUser.profile as DonorProfile);
      } else {
        setRecipientForm(currentUser.profile as RecipientProfile);
      }
    }
    setEditing(false);
  };

  if (!currentUser || !currentUser.profile) {
    return null;
  }

  const isDonor = currentUser.role === 'donor';
  const profile = currentUser.profile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <User className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('profile.title')}
                </CardTitle>
                <CardDescription>
                  {isDonor ? 'Manage your donor profile and availability' : 'Manage your recipient organization profile'}
                </CardDescription>
              </div>
              <Button
                onClick={() => setEditing(!editing)}
                variant={editing ? "outline" : "default"}
              >
                {editing ? (
                  <>
                    <X className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t('common.cancel')}
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t('profile.editProfile')}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isDonor ? (
              editing ? (
                <form onSubmit={handleDonorSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('profile.personalInfo')}</Label>
                      <Input
                        id="fullName"
                        value={donorForm.fullName}
                        onChange={(e) => setDonorForm({ ...donorForm, fullName: e.target.value })}
                        required
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t('profile.city')}</Label>
                      <Input
                        id="city"
                        value={donorForm.city}
                        onChange={(e) => setDonorForm({ ...donorForm, city: e.target.value })}
                        required
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

                  <div className="flex space-x-4 rtl:space-x-reverse">
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      <Save className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {loading ? t('common.loading') : t('common.save')}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.personalInfo')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as DonorProfile).fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.age')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as DonorProfile).age} years</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.gender')}
                      </Label>
                      <p className="text-lg font-medium">
                        {(profile as DonorProfile).gender === 'male' ? t('profile.male') : t('profile.female')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.bloodType')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as DonorProfile).bloodType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.phoneNumber')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as DonorProfile).phoneNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.city')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as DonorProfile).city}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.lastDonation')}
                      </Label>
                      <p className="text-lg font-medium">
                        {(profile as DonorProfile).lastDonationDate 
                          ? new Date((profile as DonorProfile).lastDonationDate!).toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.availability')}
                      </Label>
                      <p className="text-lg font-medium">
                        {(profile as DonorProfile).isAvailable ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              editing ? (
                <form onSubmit={handleRecipientSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Contact Name</Label>
                      <Input
                        id="name"
                        value={recipientForm.name}
                        onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">{t('profile.hospitalName')}</Label>
                      <Input
                        id="hospitalName"
                        value={recipientForm.hospitalName}
                        onChange={(e) => setRecipientForm({ ...recipientForm, hospitalName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t('profile.phoneNumber')}</Label>
                      <Input
                        id="phoneNumber"
                        value={recipientForm.phoneNumber}
                        onChange={(e) => setRecipientForm({ ...recipientForm, phoneNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t('profile.city')}</Label>
                      <Input
                        id="city"
                        value={recipientForm.city}
                        onChange={(e) => setRecipientForm({ ...recipientForm, city: e.target.value })}
                        required
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

                  <div className="flex space-x-4 rtl:space-x-reverse">
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      <Save className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {loading ? t('common.loading') : t('common.save')}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Contact Name
                      </Label>
                      <p className="text-lg font-medium">{(profile as RecipientProfile).name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.hospitalName')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as RecipientProfile).hospitalName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.phoneNumber')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as RecipientProfile).phoneNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.city')}
                      </Label>
                      <p className="text-lg font-medium">{(profile as RecipientProfile).city}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('profile.organizationType')}
                      </Label>
                      <p className="text-lg font-medium">
                        {(profile as RecipientProfile).organizationType === 'hospital' 
                          ? t('profile.hospital')
                          : (profile as RecipientProfile).organizationType === 'clinic'
                          ? t('profile.clinic')
                          : t('profile.individual')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}