import { ShowcaseSection } from "../ShowcaseSection";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui-adapters/Button";
import { Input } from "../ui-adapters/Input";
import { Label } from "../ui/label";
import { toast } from "sonner@2.0.3";
import { CalendarDays } from "lucide-react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function OverlaysShowcase() {
  const sections = [
    { id: "dialog", title: "Dialog" },
    { id: "alert-dialog", title: "Alert Dialog" },
    { id: "sheet", title: "Sheet" },
    { id: "popover", title: "Popover" },
    { id: "tooltip", title: "Tooltip" },
    { id: "hover-card", title: "Hover Card" },
    { id: "toast", title: "Toast Notifications" },
  ];

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection 
          id="dialog"
          title="Dialog" 
          description="Modal dialog for important interactions"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
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
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="@username" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast.success("Profile saved!")}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ShowcaseSection>

        <ShowcaseSection 
          id="alert-dialog"
          title="Alert Dialog" 
          description="Confirmation dialog for destructive actions"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
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
        </ShowcaseSection>

        <ShowcaseSection 
          id="sheet"
          title="Sheet" 
          description="Slide-out panel for secondary content"
        >
          <div className="flex gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Right Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Title</SheetTitle>
                  <SheetDescription>
                    This is a sheet that slides in from the side. Great for filters, settings, or additional content.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="sheet-input">Input Field</Label>
                    <Input id="sheet-input" placeholder="Enter something" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Left Sheet</Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Left Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet slides in from the left side.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </ShowcaseSection>

        <ShowcaseSection 
          id="popover"
          title="Popover" 
          description="Floating content container"
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4>Popover Title</h4>
                <p className="text-sm text-muted-foreground">
                  Popovers are great for displaying additional information or quick actions.
                </p>
                <div className="grid gap-2">
                  <Label htmlFor="popover-input">Quick Input</Label>
                  <Input id="popover-input" placeholder="Type here" />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ShowcaseSection>

        <ShowcaseSection 
          id="tooltip"
          title="Tooltip" 
          description="Contextual information on hover"
        >
          <TooltipProvider>
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a helpful tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>Another tooltip</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltips can appear on different sides</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </ShowcaseSection>

        <ShowcaseSection 
          id="hover-card"
          title="Hover Card" 
          description="Rich content preview on hover"
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@nextjs</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4>@nextjs</h4>
                  <p className="text-sm">
                    The React Framework – created and maintained by @vercel.
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      Joined December 2021
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </ShowcaseSection>

        <ShowcaseSection 
          id="toast"
          title="Toast Notifications" 
          description="Temporary notification messages"
        >
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => toast("Default toast message")}>
              Default Toast
            </Button>
            <Button onClick={() => toast.success("Success! Operation completed")}>
              Success Toast
            </Button>
            <Button onClick={() => toast.error("Error! Something went wrong")}>
              Error Toast
            </Button>
            <Button onClick={() => toast.info("Info: Here's some information")}>
              Info Toast
            </Button>
            <Button onClick={() => toast.warning("Warning! Please be careful")}>
              Warning Toast
            </Button>
          </div>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}