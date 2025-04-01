'use client';

import * as React from "react";
import { Avatar as BaseAvatar } from "@/components/Avatar";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <BaseAvatar src={src} size={40} alt={alt} />
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={className}
        src={src || undefined}
        alt={alt}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback }; 