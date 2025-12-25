"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'indigo';
  trend?: {
    value: number;
    type: 'up' | 'down';
  };
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  className = '',
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      trend: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      trend: 'text-green-600',
    },
    red: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      trend: 'text-red-600',
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
      trend: 'text-purple-600',
    },
    yellow: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      trend: 'text-yellow-600',
    },
    indigo: {
      bg: 'bg-indigo-100',
      icon: 'text-indigo-600',
      trend: 'text-indigo-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl border border-zinc-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 md:w-12 md:h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={colors.icon} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${colors.trend}`}>
            <span className="font-medium">
              {trend.type === 'up' ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl md:text-3xl font-bold text-zinc-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wide">
          {title}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
