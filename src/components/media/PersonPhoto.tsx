import { cn } from '@/lib/utils';
import type { PersonPhoto as PersonPhotoData } from '@/data/people';

/**
 * A plain `<img>` rather than `next/image`: every photograph is already
 * pre-cropped at its display size by the CDN, so the optimiser would only add a
 * second cache layer (and a `sharp` dependency) without changing the bytes on
 * the wire. Width and height are always set so nothing shifts while loading.
 */
export function PersonPhoto({
  photo,
  className,
  imgClassName,
  priority = false,
  sizes,
}: {
  photo: PersonPhotoData;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-sand', className)}>
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
}
