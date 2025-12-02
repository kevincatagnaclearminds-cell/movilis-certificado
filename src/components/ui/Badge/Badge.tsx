import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          styles.badge,
          styles[variant],
          styles[size],
          dot && styles.dot,
          className
        )}
        {...props}
      >
        {dot && <span className={styles.dotIndicator} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

