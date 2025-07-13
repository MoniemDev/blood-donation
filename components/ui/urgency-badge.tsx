'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface UrgencyBadgeProps {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
}

const urgencyConfig = {
  low: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: '🟢' },
  medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: '🟡' },
  high: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300', icon: '🟠' },
  critical: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: '🔴' },
};

export default function UrgencyBadge({ urgency, size = 'md' }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} font-medium rounded-full`}>
      <span className="mr-1 rtl:mr-0 rtl:ml-1">{config.icon}</span>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </Badge>
  );
}