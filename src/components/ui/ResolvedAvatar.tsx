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
      <span
        role="img"
        aria-label={alt}
        className={['avatarThemeDefault', className].filter(Boolean).join(' ')}
      />
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
