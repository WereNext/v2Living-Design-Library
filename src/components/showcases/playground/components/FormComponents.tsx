import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Checkbox } from "../../../ui/checkbox";
import { Switch } from "../../../ui/switch";
import { Separator } from "../../../ui/separator";
import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Mail, Lock, Search } from "lucide-react";
import type { PlaygroundComponent } from "../types";

export const textInputs: PlaygroundComponent = {
  id: "text-inputs",
  name: "Text Inputs",
  category: "Forms",
  code: `import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Mail, Lock, Search } from "lucide-react";

export function TextInputs() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search..."
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}`,
  preview: (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="demo-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="demo-email"
            type="email"
            placeholder="you@example.com"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="demo-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="demo-password"
            type="password"
            placeholder="••••••••"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="demo-search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="demo-search"
            placeholder="Search..."
            className="pl-9"
          />
        </div>
      </div>
    </div>
  )
};

export const checkboxesSwitches: PlaygroundComponent = {
  id: "checkboxes-switches",
  name: "Checkboxes & Switches",
  category: "Forms",
  code: `import { Checkbox } from "./components/ui/checkbox";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";

export function CheckboxesSwitches() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="cursor-pointer">
          Accept terms and conditions
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="cursor-pointer">
          Send me marketing emails
        </Label>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">
          Enable notifications
        </Label>
        <Switch id="notifications" />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark mode</Label>
        <Switch id="dark-mode" />
      </div>
    </div>
  );
}`,
  preview: (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center space-x-2">
        <Checkbox id="demo-terms" />
        <Label htmlFor="demo-terms" className="cursor-pointer">
          Accept terms and conditions
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="demo-marketing" />
        <Label htmlFor="demo-marketing" className="cursor-pointer">
          Send me marketing emails
        </Label>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="demo-notifications">Enable notifications</Label>
        <Switch id="demo-notifications" />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="demo-dark-mode">Dark mode</Label>
        <Switch id="demo-dark-mode" />
      </div>
    </div>
  )
};

export const selectRadio: PlaygroundComponent = {
  id: "select-radio",
  name: "Select & Radio",
  category: "Forms",
  code: `import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

export function SelectRadio() {
  return (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label>Select Framework</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Choose Plan</Label>
        <RadioGroup defaultValue="pro">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="cursor-pointer">
              Free
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="pro" />
            <Label htmlFor="pro" className="cursor-pointer">
              Pro - $29/month
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <Label htmlFor="enterprise" className="cursor-pointer">
              Enterprise
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}`,
  preview: (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label>Select Framework</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Choose Plan</Label>
        <RadioGroup defaultValue="pro">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="demo-free" />
            <Label htmlFor="demo-free" className="cursor-pointer">Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="demo-pro" />
            <Label htmlFor="demo-pro" className="cursor-pointer">Pro - $29/month</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enterprise" id="demo-enterprise" />
            <Label htmlFor="demo-enterprise" className="cursor-pointer">Enterprise</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
};

export const formComponents = [textInputs, checkboxesSwitches, selectRadio];
