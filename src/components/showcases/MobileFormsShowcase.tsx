import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ChevronRight, Check } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function MobileFormsShowcase() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const sections = [
    { id: "simple-form", title: "Simple Form" },
    { id: "native-inputs", title: "Native Inputs" },
    { id: "step-form", title: "Step-by-Step Form" },
  ];

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="simple-form"
        title="Mobile-Optimized Form"
        description="Touch-friendly form with large inputs"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create your account
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-base"
                />
              </div>

              <div className="flex items-start gap-2 py-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <Button
                className="w-full h-12 text-base"
                onClick={() => toast.success("Account created!")}
              >
                Create Account
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <button className="text-primary font-semibold">
                  Sign In
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="native-inputs"
        title="Native Mobile Inputs"
        description="HTML5 input types optimized for mobile keyboards"
      >
        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile-email" className="text-base">
                  Email (Email Keyboard)
                </Label>
                <Input
                  id="mobile-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-tel" className="text-base">
                  Phone (Number Pad)
                </Label>
                <Input
                  id="mobile-tel"
                  type="tel"
                  placeholder="555-123-4567"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-number" className="text-base">
                  Number (Numeric)
                </Label>
                <Input
                  id="mobile-number"
                  type="number"
                  placeholder="42"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-date" className="text-base">
                  Date (Date Picker)
                </Label>
                <Input
                  id="mobile-date"
                  type="date"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-time" className="text-base">
                  Time (Time Picker)
                </Label>
                <Input
                  id="mobile-time"
                  type="time"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-url" className="text-base">
                  Website (URL Keyboard)
                </Label>
                <Input
                  id="mobile-url"
                  type="url"
                  placeholder="https://example.com"
                  className="h-12 text-base"
                />
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
            💡 These input types trigger specific mobile keyboards for better UX
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="step-form"
        title="Step-by-Step Mobile Form"
        description="Multi-step form optimized for mobile screens"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`h-2 rounded-full flex-1 ${
                        step >= s ? "bg-primary" : "bg-muted"
                      }`}
                    />
                    {s < 3 && <div className="w-2" />}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Step {step} of 3
              </p>
            </div>

            <CardContent className="pt-6 space-y-4">
              {step === 1 && (
                <>
                  <div className="text-center mb-6">
                    <h3 className="mb-2">Personal Info</h3>
                    <p className="text-sm text-muted-foreground">
                      Let's start with the basics
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="step-name" className="text-base">
                      Full Name
                    </Label>
                    <Input
                      id="step-name"
                      placeholder="John Doe"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="step-email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="step-email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 text-base"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="text-center mb-6">
                    <h3 className="mb-2">Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                      What are you interested in?
                    </p>
                  </div>
                  <div className="space-y-2">
                    {["Technology", "Design", "Business", "Marketing"].map(
                      (option) => (
                        <button
                          key={option}
                          className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-colors ${
                            selectedOptions.includes(option)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => toggleOption(option)}
                        >
                          <span className="font-medium">{option}</span>
                          {selectedOptions.includes(option) && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="mb-2">All Set!</h3>
                    <p className="text-sm text-muted-foreground">
                      Review your information
                    </p>
                  </div>
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">John Doe</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">john@example.com</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Interests
                      </p>
                      <p className="font-medium">
                        {selectedOptions.join(", ") || "None selected"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  className="flex-1 h-12"
                  onClick={() => {
                    if (step < 3) {
                      setStep(step + 1);
                    } else {
                      toast.success("Form completed!");
                      setStep(1);
                      setSelectedOptions([]);
                    }
                  }}
                >
                  {step === 3 ? "Complete" : "Continue"}
                  {step < 3 && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
