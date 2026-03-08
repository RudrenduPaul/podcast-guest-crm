import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-600 text-white',
        secondary: 'border-transparent bg-slate-100 text-slate-800',
        destructive: 'border-transparent bg-red-100 text-red-700',
        outline: 'text-slate-700 border-slate-200',
        discover: 'border-transparent bg-slate-100 text-slate-700',
        outreach: 'border-transparent bg-amber-100 text-amber-700',
        scheduled: 'border-transparent bg-blue-100 text-blue-700',
        recorded: 'border-transparent bg-violet-100 text-violet-700',
        published: 'border-transparent bg-emerald-100 text-emerald-700',
        follow_up: 'border-transparent bg-pink-100 text-pink-700',
        high: 'border-transparent bg-red-100 text-red-700',
        medium: 'border-transparent bg-amber-100 text-amber-700',
        low: 'border-transparent bg-slate-100 text-slate-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
