import { cn } from '@/lib/utils';
import type { Severity } from '@/lib/mock-data';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md';
}

const severityConfig: Record<Severity, { label: string; bg: string; text: string; dot: string }> = {
  CRITICAL: { label: 'Critical', bg: 'bg-[rgba(192,57,43,0.15)]', text: 'text-[#C0392B]', dot: 'bg-[#C0392B]' },
  HIGH: { label: 'High', bg: 'bg-[rgba(230,126,34,0.15)]', text: 'text-[#E67E22]', dot: 'bg-[#E67E22]' },
  MEDIUM: { label: 'Medium', bg: 'bg-[rgba(241,196,15,0.15)]', text: 'text-[#F1C40F]', dot: 'bg-[#F1C40F]' },
  LOW: { label: 'Low', bg: 'bg-[rgba(39,174,96,0.15)]', text: 'text-[#27AE60]', dot: 'bg-[#27AE60]' },
  NONE: { label: 'None', bg: 'bg-[rgba(107,107,107,0.15)]', text: 'text-[#6B6B6B]', dot: 'bg-[#6B6B6B]' },
  INFO: { label: 'Info', bg: 'bg-[rgba(52,152,219,0.15)]', text: 'text-[#3498DB]', dot: 'bg-[#3498DB]' },
};

export function SeverityBadge({ severity, className, size = 'sm' }: SeverityBadgeProps) {
  const config = severityConfig[severity] || severityConfig.NONE;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-mono font-medium uppercase tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('rounded-full flex-shrink-0', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', config.dot)} />
      {config.label}
    </span>
  );
}
