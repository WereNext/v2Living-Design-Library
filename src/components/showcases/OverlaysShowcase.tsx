import { ShowcaseSection } from "../ShowcaseSection";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "../ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui-adapters/Button";
import { Input } from "../ui-adapters/Input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { CalendarDays, Settings, User, Bell, Trash2, Info, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { CodePlayground } from "../CodePlayground";

export function OverlaysShowcase() {
  const sections = [
    { id: "dialog", title: "Dialog" },
    { id: "alert-dialog", title: "Alert Dialog" },
    { id: "sheet", title: "Sheet" },
    { id: "drawer", title: "Drawer" },
    { id: "popover", title: "Popover" },
    { id: "tooltip", title: "Tooltip" },
    { id: "hover-card", title: "Hover Card" },
    { id: "toast", title: "Toast Notifications" },
  ];

  const dialogCode = `import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

export function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="john@example.com" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;

  const alertDialogCode = `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./components/ui/alert-dialog";
import { Button } from "./components/ui/button";

export function DeleteConfirmation() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`;

  const sheetCode = `import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

export function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your preferences here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`;

  const drawerCode = `import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./components/ui/drawer";
import { Button } from "./components/ui/button";

export function MobileDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Mobile Menu</DrawerTitle>
          <DrawerDescription>
            Drawers work great for mobile navigation.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer content here</p>
        </div>
        <DrawerFooter>
          <Button>Action</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}`;

  const popoverCode = `import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}`;

  const tooltipCode = `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { Button } from "./components/ui/button";

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a helpful tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`;

  const hoverCardCode = `import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card";
import { Button } from "./components/ui/button";
import { CalendarDays } from "lucide-react";

export function UserHoverCard() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@username</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@username</h4>
            <p className="text-sm">User bio and description goes here.</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined January 2024
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`;

  const toastCode = `import { toast } from "sonner";
import { Button } from "./components/ui/button";

export function ToastExamples() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast("Default notification")}>
        Default
      </Button>
      <Button onClick={() => toast.success("Success!")}>
        Success
      </Button>
      <Button onClick={() => toast.error("Error!")}>
        Error
      </Button>
      <Button onClick={() => toast.info("Info message")}>
        Info
      </Button>
      <Button onClick={() => toast.warning("Warning!")}>
        Warning
      </Button>
    </div>
  );
}`;

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection
          id="dialog"
          title="Dialog"
          description="Modal dialog for important interactions that require user attention"
        >
          <CodePlayground
            code={dialogCode}
            title="Dialog Component"
            description="Use dialogs for focused tasks like editing, creating, or confirming actions"
          >
            <div className="flex flex-wrap gap-md">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-md py-md">
                    <div className="grid gap-xs">
                      <Label htmlFor="dialog-name">Name</Label>
                      <Input id="dialog-name" defaultValue="John Doe" />
                    </div>
                    <div className="grid gap-xs">
                      <Label htmlFor="dialog-email">Email</Label>
                      <Input id="dialog-email" defaultValue="john@example.com" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => toast.success("Profile saved!")}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                      Configure your notification preferences.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-md py-md">
                    <div className="flex items-center justify-between">
                      <Label>Email notifications</Label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Push notifications</Label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => toast.success("Settings saved!")}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="alert-dialog"
          title="Alert Dialog"
          description="Confirmation dialog for destructive or important actions"
        >
          <CodePlayground
            code={alertDialogCode}
            title="Alert Dialog Component"
            description="Use alert dialogs for actions that need explicit confirmation"
          >
            <div className="flex flex-wrap gap-md">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.error("Account deleted")}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Discard Changes</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to discard them?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep editing</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast("Changes discarded")}>
                      Discard
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="sheet"
          title="Sheet"
          description="Slide-out panel for secondary content or actions"
        >
          <CodePlayground
            code={sheetCode}
            title="Sheet Component"
            description="Sheets slide in from the edge of the screen for filters, settings, or navigation"
          >
            <div className="flex flex-wrap gap-md">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Right Sheet
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>
                      Configure your preferences here.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-md space-y-md">
                    <div className="grid gap-xs">
                      <Label htmlFor="sheet-name">Display Name</Label>
                      <Input id="sheet-name" placeholder="Your name" />
                    </div>
                    <div className="grid gap-xs">
                      <Label htmlFor="sheet-bio">Bio</Label>
                      <Input id="sheet-bio" placeholder="Tell us about yourself" />
                    </div>
                  </div>
                  <SheetFooter className="mt-md">
                    <Button onClick={() => toast.success("Settings saved!")}>Save changes</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Left Sheet</Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>
                      Quick access to different sections.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-md space-y-sm">
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                    <Button variant="ghost" className="w-full justify-start">Settings</Button>
                    <Button variant="ghost" className="w-full justify-start">Help</Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>
                      You have 3 unread notifications.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-md space-y-md">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">New message</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">New follower</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="drawer"
          title="Drawer"
          description="Bottom drawer ideal for mobile interfaces"
        >
          <CodePlayground
            code={drawerCode}
            title="Drawer Component"
            description="Drawers slide up from the bottom, perfect for mobile-first experiences"
          >
            <div className="flex flex-wrap gap-md">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Mobile Menu</DrawerTitle>
                    <DrawerDescription>
                      Drawers work great for mobile navigation and actions.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">Home</Button>
                    <Button variant="ghost" className="w-full justify-start">Search</Button>
                    <Button variant="ghost" className="w-full justify-start">Favorites</Button>
                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                  </div>
                  <DrawerFooter>
                    <Button onClick={() => toast.success("Action completed!")}>Continue</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="popover"
          title="Popover"
          description="Floating content container triggered by click"
        >
          <CodePlayground
            code={popoverCode}
            title="Popover Component"
            description="Popovers display rich content in a floating container"
          >
            <div className="flex flex-wrap gap-md">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-md">
                    <h4 className="font-medium">Dimensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the dimensions for the layer.
                    </p>
                    <div className="grid gap-xs">
                      <Label htmlFor="pop-width">Width</Label>
                      <Input id="pop-width" defaultValue="100%" />
                    </div>
                    <div className="grid gap-xs">
                      <Label htmlFor="pop-height">Height</Label>
                      <Input id="pop-height" defaultValue="auto" />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-sm">
                    <p className="text-sm font-medium">john@example.com</p>
                    <div className="h-px bg-border" />
                    <Button variant="ghost" size="sm" className="w-full justify-start">Profile</Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">Settings</Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">Sign out</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="tooltip"
          title="Tooltip"
          description="Contextual information displayed on hover"
        >
          <CodePlayground
            code={tooltipCode}
            title="Tooltip Component"
            description="Tooltips provide brief, helpful information on hover"
          >
            <TooltipProvider>
              <div className="flex flex-wrap gap-md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Top (default)</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tooltip on top</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Bottom</Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Tooltip on bottom</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Left</Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Tooltip on left</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Right</Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Tooltip on right</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More information about this feature</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="hover-card"
          title="Hover Card"
          description="Rich content preview displayed on hover"
        >
          <CodePlayground
            code={hoverCardCode}
            title="Hover Card Component"
            description="Hover cards show detailed information when hovering over a trigger"
          >
            <div className="flex flex-wrap gap-md items-center">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-base">@johndoe</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-md">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-semibold">@johndoe</h4>
                      <p className="text-sm text-muted-foreground">
                        Software developer and open source enthusiast.
                      </p>
                      <div className="flex items-center pt-xs">
                        <CalendarDays className="mr-xs h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          Joined January 2024
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-base">@nextjs</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-md">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                      <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-semibold">@nextjs</h4>
                      <p className="text-sm text-muted-foreground">
                        The React Framework – created and maintained by @vercel.
                      </p>
                      <div className="flex items-center pt-xs">
                        <CalendarDays className="mr-xs h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          Joined December 2021
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="toast"
          title="Toast Notifications"
          description="Temporary notification messages for feedback"
        >
          <CodePlayground
            code={toastCode}
            title="Toast Notifications"
            description="Toasts provide brief, non-blocking feedback messages"
          >
            <div className="flex flex-wrap gap-md">
              <Button variant="outline" onClick={() => toast("Default toast message")}>
                Default
              </Button>
              <Button onClick={() => toast.success("Success! Operation completed successfully.")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Success
              </Button>
              <Button variant="destructive" onClick={() => toast.error("Error! Something went wrong.")}>
                <XCircle className="mr-2 h-4 w-4" />
                Error
              </Button>
              <Button variant="outline" onClick={() => toast.info("Here's some useful information.")}>
                <Info className="mr-2 h-4 w-4" />
                Info
              </Button>
              <Button variant="outline" onClick={() => toast.warning("Warning! Please review this.")}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Warning
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                      label: "Undo",
                      onClick: () => toast.success("Undone!"),
                    },
                  })
                }
              >
                With Action
              </Button>
            </div>
          </CodePlayground>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}
