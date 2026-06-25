import { cn } from '@/lib/utils';

interface ScxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  variant?: 'default' | 'light' | 'dark';
}

export function ScxLogo({ size = 'md', className, showTagline = false, variant = 'default' }: ScxLogoProps) {
  const sizes = {
    sm: { mark: 'w-6 h-6 text-xs', text: 'text-base', tagline: 'text-[10px]' },
    md: { mark: 'w-8 h-8 text-sm', text: 'text-xl', tagline: 'text-[11px]' },
    lg: { mark: 'w-10 h-10 text-base', text: 'text-2xl', tagline: 'text-xs' },
    xl: { mark: 'w-14 h-14 text-xl', text: 'text-4xl', tagline: 'text-sm' },
  };
  const s = sizes[size];
  const textColor = variant === 'light' ? 'text-white' : variant === 'dark' ? 'text-[#1A1A1A]' : 'text-white';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn(
        'flex items-center justify-center rounded-lg font-bold flex-shrink-0',
        'bg-[#D4A843] text-black',
        s.mark
      )}>
        S
      </div>
      <div>
        <div className={cn('font-display font-bold tracking-tight leading-none', s.text, textColor)}>
          SavvyCortex
        </div>
        {showTagline && (
          <div className={cn('font-sans opacity-60 mt-0.5', s.tagline, textColor)}>
            Operational intelligence infrastructure
          </div>
        )}
      </div>
    </div>
  );
}
