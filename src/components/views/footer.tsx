import React, { memo } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Heart } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer = memo(({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`w-full bg-background border-t border-border/40 mt-auto ${className}`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span>Made with</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="inline-flex items-center text-red-500 cursor-pointer gap-2"
                  role="img"
                  aria-label="love"
                >
                  <Heart className="w-4 h-4 animate-pulse fill-current" />
                  Team - 41
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Crafted with care & Tailwind</p>
              </TooltipContent>
            </Tooltip>
            <span className="hidden sm:inline">•</span>
            <span>© {currentYear}</span>
          </span>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
