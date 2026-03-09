'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ icon: Icon, title, description, action, size = 'md' }: EmptyStateProps) {
  const sizeConfig = {
    sm: { iconWrap: 'h-10 w-10', icon: 'h-5 w-5', title: 'text-sm font-medium', desc: 'text-xs' },
    md: { iconWrap: 'h-12 w-12', icon: 'h-6 w-6', title: 'text-base font-semibold', desc: 'text-sm' },
    lg: { iconWrap: 'h-16 w-16', icon: 'h-8 w-8', title: 'text-lg font-semibold', desc: 'text-sm' },
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 p-8 text-center"
    >
      <div
        className={`${sizeConfig.iconWrap} flex items-center justify-center rounded-full bg-slate-100`}
      >
        <Icon className={`${sizeConfig.icon} text-slate-400`} />
      </div>
      <div>
        <p className={`${sizeConfig.title} text-slate-700`}>{title}</p>
        <p className={`${sizeConfig.desc} mt-1 text-slate-500 max-w-xs`}>{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} size="sm" className="mt-1">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
