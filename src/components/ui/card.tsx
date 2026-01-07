import * as React from "react";

import { cn } from "./utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(className)}
      style={{
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        display: 'block',
        borderRadius: '0.75rem',
        border: '1px solid var(--border)',
      }}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(className)}
      style={{
        display: 'block',
        padding: '1.5rem 1.5rem 0 1.5rem',
      }}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn(className)}
      style={{
        display: 'block',
        lineHeight: 1.5,
        marginBottom: '0.5rem',
      }}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn(className)}
      style={{
        display: 'block',
        color: 'var(--muted-foreground)',
        lineHeight: 1.5,
      }}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(className)}
      style={{
        display: 'block',
        padding: '0 1.5rem 1.5rem 1.5rem',
      }}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(className)}
      style={{
        display: 'block',
        padding: '0 1.5rem 1.5rem 1.5rem',
      }}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
