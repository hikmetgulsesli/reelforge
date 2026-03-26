import * as React from "react"
import { cn } from "@/lib/utils"

export interface AlbumCoverProps {
  src?: string | null
  alt: string
  size?: "sm" | "lg"
  className?: string
}

const AlbumCover = React.forwardRef<HTMLDivElement, AlbumCoverProps>(
  ({ src, alt, size = "sm", className }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    const [imageLoaded, setImageLoaded] = React.useState(false)

    const showImage = src && !imageError

    const sizeClasses = {
      sm: "w-12 h-12 rounded-lg",
      lg: "w-80 h-80 rounded-xl shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)]",
    }

    const gradientFallback = (
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary to-secondary",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
    )

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden flex-shrink-0",
          sizeClasses[size],
          className
        )}
        data-testid="album-cover"
        role={!showImage ? "img" : undefined}
        aria-label={!showImage ? alt : undefined}
      >
        {!showImage && gradientFallback}
        {showImage && (
          <>
            {!imageLoaded && gradientFallback}
            <img
              src={src}
              alt={alt}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}
      </div>
    )
  }
)
AlbumCover.displayName = "AlbumCover"

export { AlbumCover }
