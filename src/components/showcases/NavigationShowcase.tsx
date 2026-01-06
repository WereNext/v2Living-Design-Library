import { ShowcaseSection } from "../ShowcaseSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "../ui/menubar";
import { Card, CardContent } from "../ui-adapters/Card";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

export function NavigationShowcase() {
  const sections = [
    { id: "tabs", title: "Tabs" },
    { id: "breadcrumb", title: "Breadcrumb" },
    { id: "pagination", title: "Pagination" },
    { id: "accordion", title: "Accordion" },
    { id: "menubar", title: "Menubar" },
  ];

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection 
          id="tabs"
          title="Tabs" 
          description="Organize content in tabbed sections"
        >
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
            <TabsContent value="settings">
              <Card>
                <CardContent className="pt-6">
                  <p>General settings and preferences go here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ShowcaseSection>

        <ShowcaseSection 
          id="breadcrumb"
          title="Breadcrumb" 
          description="Show the current page's location in the navigation hierarchy"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); toast("Home clicked"); }}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); toast("Components clicked"); }}>
                  Components
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Navigation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ShowcaseSection>

        <ShowcaseSection 
          id="pagination"
          title="Pagination" 
          description="Navigate through pages of content"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); toast("Previous page"); }} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); toast("Page 1"); }}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); toast("Page 2"); }} isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); toast("Page 3"); }}>3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); toast("Next page"); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ShowcaseSection>

        <ShowcaseSection 
          id="accordion"
          title="Accordion" 
          description="Collapsible content sections"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern and follows accessibility best practices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other components' aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It's animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ShowcaseSection>

        <ShowcaseSection 
          id="menubar"
          title="Menubar" 
          description="Desktop-style menu bar navigation"
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
                <MenubarItem onClick={() => toast("Print")}>Print</MenubarItem>
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
                <MenubarItem onClick={() => toast("Cut")}>Cut</MenubarItem>
                <MenubarItem onClick={() => toast("Copy")}>Copy</MenubarItem>
                <MenubarItem onClick={() => toast("Paste")}>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => toast("Always Show Bookmarks Bar")}>
                  Always Show Bookmarks Bar
                </MenubarItem>
                <MenubarItem onClick={() => toast("Always Show Full URLs")}>
                  Always Show Full URLs
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}