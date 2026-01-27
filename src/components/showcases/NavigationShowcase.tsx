import { ShowcaseSection } from "../ShowcaseSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "../ui/menubar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuShortcut } from "../ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { Card, CardContent } from "../ui-adapters/Card";
import { Button } from "../ui-adapters/Button";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { CodePlayground } from "../CodePlayground";
import { ChevronDown, User, Settings, LogOut, CreditCard, HelpCircle, Home, FileText, Users, BarChart3, Mail } from "lucide-react";

export function NavigationShowcase() {
  const sections = [
    { id: "tabs", title: "Tabs" },
    { id: "breadcrumb", title: "Breadcrumb" },
    { id: "pagination", title: "Pagination" },
    { id: "accordion", title: "Accordion" },
    { id: "dropdown-menu", title: "Dropdown Menu" },
    { id: "navigation-menu", title: "Navigation Menu" },
    { id: "menubar", title: "Menubar" },
  ];

  const tabsCode = `import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent } from "./components/ui/card";

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardContent className="pt-6">
            <p>Account settings and information go here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardContent className="pt-6">
            <p>Password change options go here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}`;

  const breadcrumbCode = `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./components/ui/breadcrumb";

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Navigation</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}`;

  const paginationCode = `import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./components/ui/pagination";

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}`;

  const accordionCode = `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

  const dropdownMenuCode = `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`;

  const navigationMenuCode = `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./components/ui/navigation-menu";

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <li><NavigationMenuLink href="#">Introduction</NavigationMenuLink></li>
              <li><NavigationMenuLink href="#">Installation</NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <li><NavigationMenuLink href="#">Button</NavigationMenuLink></li>
              <li><NavigationMenuLink href="#">Card</NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}`;

  const menubarCode = `import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "./components/ui/menubar";

export function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}`;

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection
          id="tabs"
          title="Tabs"
          description="Organize content in tabbed sections for easy navigation"
        >
          <CodePlayground
            code={tabsCode}
            title="Tabs Component"
            description="Tabs allow users to switch between different views within the same context"
          >
            <div className="space-y-md">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <Card>
                    <CardContent className="pt-lg">
                      <div className="space-y-sm">
                        <h3 className="font-semibold">Account Information</h3>
                        <p className="text-muted-foreground">Manage your account details and preferences.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="password">
                  <Card>
                    <CardContent className="pt-lg">
                      <div className="space-y-sm">
                        <h3 className="font-semibold">Password Settings</h3>
                        <p className="text-muted-foreground">Update your password and security settings.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings">
                  <Card>
                    <CardContent className="pt-lg">
                      <div className="space-y-sm">
                        <h3 className="font-semibold">General Settings</h3>
                        <p className="text-muted-foreground">Configure your general preferences.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-md border rounded-md mt-sm">
                  Dashboard overview content
                </TabsContent>
                <TabsContent value="analytics" className="p-md border rounded-md mt-sm">
                  Analytics and metrics
                </TabsContent>
                <TabsContent value="reports" className="p-md border rounded-md mt-sm">
                  Generated reports
                </TabsContent>
                <TabsContent value="notifications" className="p-md border rounded-md mt-sm">
                  Notification settings
                </TabsContent>
              </Tabs>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="breadcrumb"
          title="Breadcrumb"
          description="Show the current page's location in the navigation hierarchy"
        >
          <CodePlayground
            code={breadcrumbCode}
            title="Breadcrumb Component"
            description="Breadcrumbs help users understand their location and navigate back"
          >
            <div className="space-y-md">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); toast("Home"); }}>
                      <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); toast("Components"); }}>
                      Components
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Navigation</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); toast("Dashboard"); }}>
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); toast("Projects"); }}>
                      Projects
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); toast("Design System"); }}>
                      Design System
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Tokens</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="pagination"
          title="Pagination"
          description="Navigate through pages of content"
        >
          <CodePlayground
            code={paginationCode}
            title="Pagination Component"
            description="Pagination allows users to navigate through large sets of data"
          >
            <div className="space-y-md">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); toast("Previous"); }} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); toast("Page 1"); }}>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); toast("Page 2"); }} isActive>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); toast("Page 3"); }}>3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); toast("Page 10"); }}>10</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); toast("Next"); }} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing 11-20 of 97 results</span>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="accordion"
          title="Accordion"
          description="Collapsible content sections for FAQs and organized information"
        >
          <CodePlayground
            code={accordionCode}
            title="Accordion Component"
            description="Accordions organize content into collapsible sections"
          >
            <div className="space-y-md">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a design system?</AccordionTrigger>
                  <AccordionContent>
                    A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build applications. It includes design tokens, components, patterns, and documentation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do design tokens work?</AccordionTrigger>
                  <AccordionContent>
                    Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They're used in place of hard-coded values to maintain consistency.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I customize the components?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All components use design tokens that can be customized through the theme editor. You can modify colors, spacing, typography, and more to match your brand.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="features">
                  <AccordionTrigger>Features</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Design token management</li>
                      <li>Component library</li>
                      <li>Theme customization</li>
                      <li>Code export</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pricing">
                  <AccordionTrigger>Pricing</AccordionTrigger>
                  <AccordionContent>
                    Our pricing is simple and transparent. Start free, upgrade when you need more.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="support">
                  <AccordionTrigger>Support</AccordionTrigger>
                  <AccordionContent>
                    We offer email support for all users and priority support for premium plans.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="dropdown-menu"
          title="Dropdown Menu"
          description="Contextual menu triggered by a button"
        >
          <CodePlayground
            code={dropdownMenuCode}
            title="Dropdown Menu Component"
            description="Dropdown menus display a list of actions or options"
          >
            <div className="flex flex-wrap gap-md">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Account
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => toast("Profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast("Settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast("Billing")}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast("Help")}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast("Logged out")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    Actions
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => toast("Edit")}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Duplicate")}>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Archive")}>Archive</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast("Deleted")} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="navigation-menu"
          title="Navigation Menu"
          description="Full-featured navigation menu for website headers"
        >
          <CodePlayground
            code={navigationMenuCode}
            title="Navigation Menu Component"
            description="Navigation menus are ideal for main site navigation with rich content"
          >
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="#"
                            onClick={(e) => { e.preventDefault(); toast("Introduction"); }}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Living Design Library
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              A complete design system builder for modern applications.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" onClick={(e) => { e.preventDefault(); toast("Installation"); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Installation</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Get started with the design system in minutes.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" onClick={(e) => { e.preventDefault(); toast("Typography"); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Typography</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Styles and utilities for text content.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Buttons", icon: FileText, desc: "Interactive button components" },
                        { title: "Cards", icon: FileText, desc: "Content container components" },
                        { title: "Forms", icon: FileText, desc: "Form input components" },
                        { title: "Navigation", icon: FileText, desc: "Navigation components" },
                      ].map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a href="#" onClick={(e) => { e.preventDefault(); toast(item.title); }} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.desc}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    href="#"
                    onClick={(e) => { e.preventDefault(); toast("Documentation"); }}
                  >
                    Documentation
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="menubar"
          title="Menubar"
          description="Desktop-style menu bar navigation for applications"
        >
          <CodePlayground
            code={menubarCode}
            title="Menubar Component"
            description="Menubars provide application-level navigation similar to desktop apps"
          >
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => toast("New Tab")}>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => toast("New Window")}>
                    New Window <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => toast("Share")}>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => toast("Print")}>
                    Print <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => toast("Undo")}>
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => toast("Redo")}>
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => toast("Cut")}>
                    Cut <MenubarShortcut>⌘X</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => toast("Copy")}>
                    Copy <MenubarShortcut>⌘C</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => toast("Paste")}>
                    Paste <MenubarShortcut>⌘V</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => toast("Zoom In")}>
                    Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => toast("Zoom Out")}>
                    Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => toast("Full Screen")}>
                    Full Screen <MenubarShortcut>⌘⇧F</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Help</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => toast("Documentation")}>Documentation</MenubarItem>
                  <MenubarItem onClick={() => toast("Support")}>Support</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => toast("About")}>About</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </CodePlayground>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}
