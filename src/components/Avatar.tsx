'use client';
import Image from 'next/image';
import { FC, useState } from 'react';
import { CircleUserRoundIcon } from 'lucide-react';

export type AvatarProps = {
  size: number;
  src: string | null;
  alt?: string;
};

export const Avatar: FC<AvatarProps> = ({ src, size, alt = '' }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="relative rounded-full overflow-hidden inline-block"
      style={{ width: size, height: size }}
    >
      <CircleUserRoundIcon size={size} className="absolute inset-0" />
      {src && !hasError && (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-cover object-top absolute inset-0"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};
