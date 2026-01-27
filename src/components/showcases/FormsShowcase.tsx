import { ShowcaseSection } from "../ShowcaseSection";
import { Input } from "../ui-adapters/Input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { useState } from "react";
import { toast } from "sonner";
import { CodePlayground } from "../CodePlayground";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { ShowcaseCard } from "../ShowcaseCard";

interface FormsShowcaseProps {
  designIntent?: string;
}

export function FormsShowcase({ designIntent = "web-app" }: FormsShowcaseProps) {
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchEnabled, setSwitchEnabled] = useState(false);

  const sections = [
    { id: "text-input", title: "Text Input" },
    { id: "textarea", title: "Textarea" },
    { id: "checkbox", title: "Checkbox" },
    { id: "radio-group", title: "Radio Group" },
    { id: "select", title: "Select" },
    { id: "switch", title: "Switch" },
    { id: "slider", title: "Slider" },
  ];

  const loginFormCode = `import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";

export function LoginForm() {
  return (
    <div className="space-y-md max-w-md">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Enter your email" 
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="Enter your password" 
        />
      </div>
      <div className="flex items-center space-x-xs">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="cursor-pointer">
          Remember me
        </Label>
      </div>
      <Button className="w-full">Sign In</Button>
    </div>
  );
}`;

  const selectCode = `import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./components/ui/select";
import { Label } from "./components/ui/label";

export function SelectExample() {
  return (
    <div className="max-w-md">
      <Label htmlFor="framework">Framework</Label>
      <Select onValueChange={(value) => console.log(value)}>
        <SelectTrigger id="framework">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}`;

  const switchSliderCode = `import { Switch } from "./components/ui/switch";
import { Slider } from "./components/ui/slider";
import { Label } from "./components/ui/label";
import { useState } from "react";

export function ControlsExample() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-lg max-w-md">
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Enable notifications</Label>
        <Switch 
          id="notifications" 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
      <div>
        <Label>Volume: {sliderValue[0]}%</Label>
        <Slider 
          value={sliderValue} 
          onValueChange={setSliderValue}
          max={100}
          step={1}
          className="mt-xs"
        />
      </div>
    </div>
  );
}`;

  const checkboxCode = `import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { toast } from "sonner";

export function CheckboxExample() {
  return (
    <div className="space-y-md">
      <div className="flex items-center space-x-xs">
        <Checkbox 
          id="terms" 
          onCheckedChange={(checked) => toast(\`Terms: \${checked}\`)} 
        />
        <Label htmlFor="terms" className="cursor-pointer">
          Accept terms and conditions
        </Label>
      </div>
      <div className="flex items-center space-x-xs">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="cursor-pointer">
          Receive marketing emails
        </Label>
      </div>
    </div>
  );
}`;

  const radioCode = `import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Label } from "./components/ui/label";
import { toast } from "sonner";

export function RadioExample() {
  return (
    <RadioGroup 
      defaultValue="card" 
      onValueChange={(value) => toast(\`Selected: \${value}\`)}
    >
      <div className="flex items-center space-x-xs">
        <RadioGroupItem value="card" id="card" />
        <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
      </div>
      <div className="flex items-center space-x-xs">
        <RadioGroupItem value="paypal" id="paypal" />
        <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
      </div>
      <div className="flex items-center space-x-xs">
        <RadioGroupItem value="apple" id="apple" />
        <Label htmlFor="apple" className="cursor-pointer">Apple Pay</Label>
      </div>
    </RadioGroup>
  );
}`;

  const textareaCode = `import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";

export function TextareaExample() {
  return (
    <div className="max-w-md">
      <Label htmlFor="message">Message</Label>
      <Textarea 
        id="message" 
        placeholder="Type your message here..." 
        rows={4} 
      />
    </div>
  );
}`;

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection
          id="text-input"
          title="Text Input"
          description="Basic text input fields"
        >
          <CodePlayground
            code={loginFormCode}
            title="Login Form Example"
            description="Complete login form with email, password, and remember me"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              <ShowcaseCard
                defaultName="Email Input"
                category="form"
                designIntent={designIntent}
                description="Email input field with validation"
              >
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </ShowcaseCard>

              <ShowcaseCard
                defaultName="Password Input"
                category="form"
                designIntent={designIntent}
                description="Password input field with masking"
              >
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
              </ShowcaseCard>

              <ShowcaseCard
                defaultName="Disabled Input"
                category="form"
                designIntent={designIntent}
                description="Disabled input field state"
              >
                <div>
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" disabled placeholder="Disabled input" />
                </div>
              </ShowcaseCard>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="textarea"
          title="Textarea"
          description="Multi-line text input"
        >
          <CodePlayground
            code={textareaCode}
            title="Textarea Example"
            description="Textarea with placeholder and rows"
          >
            <ShowcaseCard
              defaultName="Message Textarea"
              category="form"
              designIntent={designIntent}
              description="Multi-line text input for messages or comments"
            >
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  rows={4}
                />
              </div>
            </ShowcaseCard>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="checkbox"
          title="Checkbox"
          description="Binary choice checkboxes"
        >
          <CodePlayground
            code={checkboxCode}
            title="Checkbox Example"
            description="Checkboxes with onCheckedChange events"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <ShowcaseCard
                defaultName="Terms Checkbox"
                category="form"
                designIntent={designIntent}
                description="Checkbox for accepting terms and conditions"
              >
                <div className="flex items-center space-x-xs">
                  <Checkbox
                    id="terms"
                    onCheckedChange={(checked) => toast(`Terms: ${checked}`)}
                  />
                  <Label htmlFor="terms" className="cursor-pointer">
                    Accept terms and conditions
                  </Label>
                </div>
              </ShowcaseCard>

              <ShowcaseCard
                defaultName="Marketing Checkbox"
                category="form"
                designIntent={designIntent}
                description="Checkbox for optional marketing preferences"
              >
                <div className="flex items-center space-x-xs">
                  <Checkbox id="marketing" />
                  <Label htmlFor="marketing" className="cursor-pointer">
                    Receive marketing emails
                  </Label>
                </div>
              </ShowcaseCard>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="radio-group"
          title="Radio Group"
          description="Single selection from multiple options"
        >
          <CodePlayground
            code={radioCode}
            title="Radio Group Example"
            description="Radio group with onValueChange events"
          >
            <ShowcaseCard
              defaultName="Payment Method Selector"
              category="form"
              designIntent={designIntent}
              description="Radio group for selecting payment method"
            >
              <RadioGroup
                defaultValue="card"
                onValueChange={(value) => toast(`Selected: ${value}`)}
              >
                <div className="flex items-center space-x-xs">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-xs">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                </div>
                <div className="flex items-center space-x-xs">
                  <RadioGroupItem value="apple" id="apple" />
                  <Label htmlFor="apple" className="cursor-pointer">Apple Pay</Label>
                </div>
              </RadioGroup>
            </ShowcaseCard>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="select"
          title="Select"
          description="Dropdown selection menu"
        >
          <CodePlayground
            code={selectCode}
            title="Select Example"
            description="Dropdown select with multiple options"
          >
            <ShowcaseCard
              defaultName="Framework Selector"
              category="form"
              designIntent={designIntent}
              description="Dropdown select for choosing a framework"
            >
              <div>
                <Label>Choose a framework</Label>
                <Select onValueChange={(value) => toast(`Selected: ${value}`)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="svelte">Svelte</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </ShowcaseCard>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="switch"
          title="Switch"
          description="Toggle switch for boolean states"
        >
          <CodePlayground
            code={switchSliderCode}
            title="Switch and Slider Example"
            description="Toggle switch and range slider"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <ShowcaseCard
                defaultName="Toggle Switch"
                category="form"
                designIntent={designIntent}
                description="Toggle switch for enabling/disabling features"
              >
                <div className="flex items-center space-x-xs">
                  <Switch
                    id="airplane-mode"
                    checked={switchEnabled}
                    onCheckedChange={(checked) => {
                      setSwitchEnabled(checked);
                      toast(checked ? "Switch enabled" : "Switch disabled");
                    }}
                  />
                  <Label htmlFor="airplane-mode" className="cursor-pointer">
                    Airplane Mode {switchEnabled ? "(On)" : "(Off)"}
                  </Label>
                </div>
              </ShowcaseCard>

              <ShowcaseCard
                defaultName="Disabled Switch"
                category="form"
                designIntent={designIntent}
                description="Disabled switch state"
              >
                <div className="flex items-center space-x-xs">
                  <Switch id="disabled-switch" disabled />
                  <Label htmlFor="disabled-switch">Disabled switch</Label>
                </div>
              </ShowcaseCard>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="slider"
          title="Slider"
          description="Range input slider"
        >
          <ShowcaseCard
            defaultName="Volume Slider"
            category="form"
            designIntent={designIntent}
            description="Range slider for adjusting volume or other numeric values"
          >
            <div>
              <Label>Volume: {sliderValue[0]}%</Label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="mt-xs"
              />
            </div>
          </ShowcaseCard>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}