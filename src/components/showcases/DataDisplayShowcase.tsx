import { ShowcaseSection } from "../ShowcaseSection";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui-adapters/Badge";
import { Button } from "../ui-adapters/Button";
import { Terminal, AlertCircle, Info, CheckCircle2, XCircle, MoreHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { CodePlayground } from "../CodePlayground";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const invoices = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
  { id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
];

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "Active" },
];

export function DataDisplayShowcase() {
  const [progress, setProgress] = useState(13);

  const sections = [
    { id: "table", title: "Table" },
    { id: "avatar", title: "Avatar" },
    { id: "progress", title: "Progress" },
    { id: "skeleton", title: "Skeleton" },
    { id: "alerts", title: "Alerts" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tableCode = `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";

const invoices = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
];

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`;

  const avatarCode = `import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

export function AvatarDemo() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  );
}`;

  const progressCode = `import { Progress } from "./components/ui/progress";
import { useState, useEffect } from "react";

export function ProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <Progress value={progress} />;
}`;

  const skeletonCode = `import { Skeleton } from "./components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`;

  const alertCode = `import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Terminal, AlertCircle } from "lucide-react";

export function AlertDemo() {
  return (
    <div className="space-y-4">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components using the CLI.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong.
        </AlertDescription>
      </Alert>
    </div>
  );
}`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
      case "Active":
        return <Badge variant="default" className="bg-green-500">{status}</Badge>;
      case "Pending":
        return <Badge variant="secondary">{status}</Badge>;
      case "Unpaid":
      case "Inactive":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection
          id="table"
          title="Table"
          description="Display data in tabular format with sorting and actions"
        >
          <CodePlayground
            code={tableCode}
            title="Table Component"
            description="Tables organize and display data in rows and columns"
          >
            <div className="space-y-lg">
              {/* Simple Table */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">Simple Table</h4>
                <div className="border rounded-md">
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>{invoice.method}</TableCell>
                          <TableCell className="text-right">{invoice.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Table with Actions */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">Table with Actions</h4>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" size="sm" className="h-8 p-0">
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="avatar"
          title="Avatar"
          description="User profile images with fallbacks"
        >
          <CodePlayground
            code={avatarCode}
            title="Avatar Component"
            description="Avatars represent users with images or initials"
          >
            <div className="space-y-md">
              {/* Sizes */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">Sizes</h4>
                <div className="flex gap-md items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback className="text-xs">SM</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-14 w-14">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback className="text-lg">LG</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback className="text-xl">XL</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* With Fallback */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">With Fallback</h4>
                <div className="flex gap-md items-center">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-destructive text-destructive-foreground">XY</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-green-500 text-white">OK</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Avatar Group */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">Avatar Group</h4>
                <div className="flex -space-x-3">
                  <Avatar className="border-2 border-background">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
                    <AvatarFallback>U1</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
                    <AvatarFallback>U2</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarFallback>U3</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarFallback>U4</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">+5</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="progress"
          title="Progress"
          description="Visual progress indicators for loading and completion states"
        >
          <CodePlayground
            code={progressCode}
            title="Progress Component"
            description="Progress bars show completion status of tasks or processes"
          >
            <div className="space-y-md">
              <div>
                <div className="flex justify-between mb-xs">
                  <span className="text-sm">Animated Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div>
                <div className="flex justify-between mb-xs">
                  <span className="text-sm">Upload Progress</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} />
              </div>

              <div>
                <div className="flex justify-between mb-xs">
                  <span className="text-sm">Task Completion</span>
                  <span className="text-sm text-muted-foreground">30%</span>
                </div>
                <Progress value={30} />
              </div>

              <div>
                <div className="flex justify-between mb-xs">
                  <span className="text-sm">Download Complete</span>
                  <span className="text-sm text-muted-foreground">100%</span>
                </div>
                <Progress value={100} />
              </div>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="skeleton"
          title="Skeleton"
          description="Loading placeholder components for better UX"
        >
          <CodePlayground
            code={skeletonCode}
            title="Skeleton Component"
            description="Skeletons show content placeholders while data is loading"
          >
            <div className="space-y-lg">
              {/* Card Skeleton */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">Card Loading</h4>
                <div className="flex items-center space-x-md p-md border rounded-md">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-xs flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>

              {/* Article Skeleton */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">Article Loading</h4>
                <div className="space-y-sm">
                  <Skeleton className="h-48 w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              {/* Table Skeleton */}
              <div>
                <h4 className="text-sm font-medium mb-sm text-muted-foreground">Table Loading</h4>
                <div className="space-y-sm">
                  <div className="flex gap-md">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-md">
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-8 w-1/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="alerts"
          title="Alerts"
          description="Important messages and notifications for user attention"
        >
          <CodePlayground
            code={alertCode}
            title="Alert Component"
            description="Alerts communicate important information to users"
          >
            <div className="space-y-md">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the CLI.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again to continue.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 text-green-700 [&>svg]:text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your changes have been saved successfully.
                </AlertDescription>
              </Alert>

              <Alert className="border-yellow-500 text-yellow-700 [&>svg]:text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Your subscription will expire in 3 days. Please renew to avoid interruption.
                </AlertDescription>
              </Alert>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This feature is currently in beta. Some functionality may change.
                </AlertDescription>
              </Alert>
            </div>
          </CodePlayground>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}
