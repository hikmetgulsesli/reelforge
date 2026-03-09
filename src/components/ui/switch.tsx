import * as React from "react"
import { cn } from "@/lib/utils"

export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer",
            "peer-checked:after:translate-x-full peer-checked:after:border-white",
            "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
            "after:bg-white after:border-slate-300 after:border after:rounded-full",
            "after:h-5 after:w-5 after:transition-all peer-checked:bg-primary",
            className
          )}
        />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
