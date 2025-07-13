'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { AuthService } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await AuthService.login(formData.email, formData.password);
      if (user) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Header showAuth={false} />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('auth.loginTitle')}</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {/* Demo Accounts Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Demo Accounts</h3>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p><strong>Donors:</strong></p>
                  <p>• ahmed.donor@example.com (O+ Blood, Cairo)</p>
                  <p>• sara.donor@example.com (A+ Blood, Alexandria)</p>
                  <p>• omar.donor@example.com (B- Blood, Cairo)</p>
                  <p>• fatima.donor@example.com (AB+ Blood, Giza)</p>
                  <p className="mt-2"><strong>Recipients:</strong></p>
                  <p>• hospital.cairo@example.com (Cairo University Hospital)</p>
                  <p>• clinic.alex@example.com (Alexandria Medical Center)</p>
                  <p>• emergency.giza@example.com (Giza Emergency Hospital)</p>
                  <p className="mt-2 text-xs italic">Use any password for demo accounts</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('auth.login')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.noAccount')}{' '}
                <Link href="/auth/register" className="text-red-600 hover:text-red-500 font-medium">
                  {t('auth.register')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}