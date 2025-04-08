
import * as React from "react"

import { cn } from "@/lib/utils"

const Code = React.forwardRef<
  HTMLPreElement,
  React.HTMLAttributes<HTMLPreElement>
>(({ className, ...props }, ref) => (
  <pre
    ref={ref}
    className={cn(
      "rounded-md p-4 overflow-x-auto text-sm font-mono text-card-foreground bg-muted",
      className
    )}
    {...props}
  />
))
Code.displayName = "Code"

export { Code }
