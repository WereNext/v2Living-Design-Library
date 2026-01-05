import { ShowcaseSection } from "../ShowcaseSection";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { ShowcaseWithNav } from "../ShowcaseWithNav";

const invoices = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
  { id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
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

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection 
          id="table"
          title="Table" 
          description="Display data in tabular format"
        >
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
        </ShowcaseSection>

        <ShowcaseSection 
          id="avatar"
          title="Avatar" 
          description="User profile images with fallbacks"
        >
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        </ShowcaseSection>

        <ShowcaseSection 
          id="progress"
          title="Progress" 
          description="Visual progress indicators"
        >
          <div className="space-y-4">
            <div>
              <p className="mb-2">Animated Progress: {progress}%</p>
              <Progress value={progress} />
            </div>
            <div>
              <p className="mb-2">Static Progress: 75%</p>
              <Progress value={75} />
            </div>
          </div>
        </ShowcaseSection>

        <ShowcaseSection 
          id="skeleton"
          title="Skeleton" 
          description="Loading placeholder components"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </ShowcaseSection>

        <ShowcaseSection 
          id="alerts"
          title="Alerts" 
          description="Important messages and notifications"
        >
          <div className="space-y-4">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the cli.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Your session has expired. Please log in again.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert with helpful details.
              </AlertDescription>
            </Alert>
          </div>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}