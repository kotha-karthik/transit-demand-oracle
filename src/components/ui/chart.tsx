
import * as React from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  color?: string
  className?: string
  strokeWidth?: number
  showTooltip?: boolean
  aspectRatio?: "auto" | "square" | "portrait" | "video"
  minYValue?: number
  showXAxis?: boolean
  showYAxis?: boolean
  yAxisWidth?: number
  xAxisHeight?: number
  grid?: boolean
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
}

const Chart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config?: ChartConfig
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()

  const aspectRatio = config?.aspectRatio || "square"

  return (
    <div
      id={id || uniqueId}
      ref={ref}
      className={cn(
        "overflow-hidden",
        aspectRatio === "auto" && "aspect-auto",
        aspectRatio === "portrait" && "aspect-[3/4]",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "video" && "aspect-video",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child)
        }
        return child
      })}
    </div>
  )
})
Chart.displayName = "Chart"

export { Chart }
