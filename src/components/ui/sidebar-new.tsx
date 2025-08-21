"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ScrollArea } from "./scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { PanelLeft, X } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SidebarContext = React.createContext<{
  isOpen: boolean
  isMobile: boolean
  toggleOpen: () => void
} | null>(null)

export function Sidebar({ 
  children, 
  className, 
  defaultOpen = true, 
  open: openProp, 
  onOpenChange,
  ...props 
}: SidebarProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : open

  const toggleOpen = React.useCallback(() => {
    if (isControlled && onOpenChange) {
      onOpenChange(!isOpen)
    } else {
      setOpen(!isOpen)
    }
  }, [isControlled, isOpen, onOpenChange])

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      isMobile,
      toggleOpen,
    }),
    [isOpen, isMobile, toggleOpen]
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={toggleOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-4 z-50">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="h-full overflow-hidden">
            <div className="flex h-14 items-center px-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-2"
                onClick={toggleOpen}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
              <div className="font-semibold">FoamPilot</div>
            </div>
            <ScrollArea className="h-[calc(100%-3.5rem)] p-4">
              {children}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          "hidden md:flex flex-col h-full w-64 border-r transition-all duration-300",
          !isOpen && "w-16",
          className
        )}
        {...props}
      >
        <div className="flex h-14 items-center px-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-2"
            onClick={toggleOpen}
          >
            <PanelLeft className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          {isOpen && <div className="font-semibold">FoamPilot</div>}
        </div>
        <ScrollArea className="flex-1 p-4">
          {children}
        </ScrollArea>
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 px-4 py-2", className)}
      {...props}
    />
  )
}

SidebarHeader.displayName = "SidebarHeader"

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props} />
  )
}

SidebarContent.displayName = "SidebarContent"

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between p-4 pt-0", className)}
      {...props}
    />
  )
}

SidebarFooter.displayName = "SidebarFooter"

export function SidebarItem({
  className,
  icon: Icon,
  children,
  isActive,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center p-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </div>
  )
}

SidebarItem.displayName = "SidebarItem"

export function SidebarSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-[1px] bg-border my-2", className)}
      {...props}
    />
  )
}

SidebarSeparator.displayName = "SidebarSeparator"

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar component")
  }
  return context
}
