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
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Силуэт с полями внутри viewBox — без CSS-padding, чтобы не ломать мобильные размеры */}
        <circle cx="64" cy="48" r="22" fill="currentColor" />
        <path
          d="M30 112c5-22 18-34 34-34s29 12 34 34"
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
