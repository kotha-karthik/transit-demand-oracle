
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
      {children}
    </div>
  )
})
Chart.displayName = "Chart"

// Add ChartContainer component
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config?: Record<string, any>
  }
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("h-full w-full", className)} {...props}>
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

// Add ChartTooltip component
interface ChartTooltipProps extends React.ComponentProps<typeof Tooltip> {}

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  ChartTooltipProps
>(({ content, ...props }, ref) => {
  return <Tooltip content={content} {...props} />
})
ChartTooltip.displayName = "ChartTooltip"

// Add ChartTooltipContent component
const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold">
              {payload[0].value}
            </span>
          </div>
          {payload.length > 1 && (
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {payload[1].name}
              </span>
              <span className="font-bold">
                {payload[1].value}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent }
