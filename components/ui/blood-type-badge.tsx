'use client';

import React from 'react';
import { BloodType } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';

interface BloodTypeBadgeProps {
  bloodType: BloodType;
  size?: 'sm' | 'md' | 'lg';
}

const bloodTypeColors: Record<BloodType, string> = {
  'O-': 'bg-red-600 text-white',
  'O+': 'bg-red-500 text-white',
  'A-': 'bg-blue-600 text-white',
  'A+': 'bg-blue-500 text-white',
  'B-': 'bg-green-600 text-white',
  'B+': 'bg-green-500 text-white',
  'AB-': 'bg-purple-600 text-white',
  'AB+': 'bg-purple-500 text-white',
};

export default function BloodTypeBadge({ bloodType, size = 'md' }: BloodTypeBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      className={`${bloodTypeColors[bloodType]} ${sizeClasses[size]} font-bold rounded-full`}
    >
      {bloodType}
    </Badge>
  );
}