import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100
    
    return (
      <div className="relative w-full">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
          <div 
            className="absolute h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          ref={ref}
          max={max}
          min={min}
          step={step}
          value={value[0]}
          onChange={(e) => onValueChange?.([Number(e.target.value)])}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 opacity-0 cursor-pointer z-10",
            className
          )}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
