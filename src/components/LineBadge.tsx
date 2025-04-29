
import React from 'react';
import { londonUndergroundLines } from '@/data/cityData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LineBadgeProps {
  lineId: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  small?: boolean; // Added small property for backward compatibility
}

const LineBadge: React.FC<LineBadgeProps> = ({ lineId, className, showName = true, size = 'md', small = false }) => {
  const line = londonUndergroundLines.find(l => l.id === lineId);
  
  if (!line) {
    return null;
  }
  
  // If small prop is provided, use sm size (for backward compatibility)
  const actualSize = small ? 'sm' : size;
  
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };
  
  // For dark colored lines (like Northern line), use white text
  const isDarkColor = ['northern', 'piccadilly', 'victoria', 'jubilee', 'bakerloo', 'metropolitan'].includes(lineId);
  
  return (
    <Badge 
      className={cn(
        "gap-1.5 font-normal",
        isDarkColor ? "text-white" : "text-black",
        className
      )}
      style={{ 
        backgroundColor: line.color,
        borderColor: isDarkColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
      }}
    >
      <div className={cn("rounded-full", sizeClasses[actualSize])}></div>
      {showName && line.name}
    </Badge>
  );
};

export default LineBadge;
