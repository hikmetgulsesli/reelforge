import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Inbox, Music, LucideIcon } from "lucide-react"

export interface EmptyStateProps {
  icon?: "inbox" | "music" | LucideIcon
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  inbox: Inbox,
  music: Music,
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon = "inbox", title, message, actionLabel, onAction, className }, ref) => {
    const IconComponent = typeof icon === "string" ? iconMap[icon] : icon

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          {IconComponent && <IconComponent className="w-8 h-8 text-muted-foreground" />}
        </div>
        {title && (
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        )}
        <p className="text-muted-foreground max-w-sm mb-4">{message}</p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
