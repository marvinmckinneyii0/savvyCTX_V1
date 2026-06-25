import { cn } from '@/lib/utils';
import type { RunStatus, AlertStatus } from '@/lib/mock-data';

type AnyStatus = RunStatus | AlertStatus;

const statusConfig: Record<AnyStatus, { label: string; bg: string; text: string }> = {
  success: { label: 'Success', bg: 'bg-[rgba(39,174,96,0.15)]', text: 'text-[#27AE60]' },
  failed: { label: 'Failed', bg: 'bg-[rgba(192,57,43,0.15)]', text: 'text-[#C0392B]' },
  halted: { label: 'Halted', bg: 'bg-[rgba(241,196,15,0.15)]', text: 'text-[#F1C40F]' },
  running: { label: 'Running', bg: 'bg-[rgba(52,152,219,0.15)]', text: 'text-[#3498DB]' },
  active: { label: 'Active', bg: 'bg-[rgba(192,57,43,0.15)]', text: 'text-[#C0392B]' },
  acknowledged: { label: 'Acknowledged', bg: 'bg-[rgba(241,196,15,0.15)]', text: 'text-[#F1C40F]' },
  resolved: { label: 'Resolved', bg: 'bg-[rgba(39,174,96,0.15)]', text: 'text-[#27AE60]' },
};

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  const config = statusConfig[status] || statusConfig.failed;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wide',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}
