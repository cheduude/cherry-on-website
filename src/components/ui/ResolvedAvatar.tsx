import type { ImgHTMLAttributes } from 'react';
import { isDefaultAvatar, resolveAvatarUrl } from '../../constants/auth';
import './ResolvedAvatar.css';

type ResolvedAvatarProps = {
  avatar?: string | null;
  alt?: string;
  className?: string;
  onError?: ImgHTMLAttributes<HTMLImageElement>['onError'];
};

/** Renders a theme-aware local default silhouette, or a remote/custom avatar image. */
export function ResolvedAvatar({
  avatar,
  alt = 'Аватар',
  className,
  onError,
}: ResolvedAvatarProps) {
  const url = resolveAvatarUrl(avatar);

  if (isDefaultAvatar(url)) {
    return (
      <svg
        className={['avatarThemeDefault', className].filter(Boolean).join(' ')}
        viewBox="0 0 128 128"
        role="img"
        aria-label={alt}
        focusable="false"
      >
        <circle cx="64" cy="46" r="26" fill="currentColor" />
        <path
          d="M16 118c6-28 24-44 48-44s42 16 48 44"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <img
      className={className}
      src={url}
      alt={alt}
      onError={onError}
    />
  );
}
