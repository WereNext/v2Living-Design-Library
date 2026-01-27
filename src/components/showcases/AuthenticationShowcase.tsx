import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Mail, Lock, User, Eye, EyeOff, Github, Chrome, ArrowRight, KeyRound, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { CodePlayground } from "../CodePlayground";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function AuthenticationShowcase() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sections = [
    { id: "login-form", title: "Login Form" },
    { id: "signup-form", title: "Sign Up Form" },
    { id: "forgot-password", title: "Forgot Password" },
    { id: "two-factor", title: "Two-Factor Auth" },
    { id: "social-login", title: "Social Login" },
  ];

  const loginFormCode = `import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
          </div>
          <Button variant="link" className="px-0">Forgot password?</Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Sign in</Button>
      </CardFooter>
    </Card>
  );
}`;

  const signupFormCode = `import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

export function SignUpForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm font-normal">
            I agree to the <Button variant="link" className="px-0 h-auto">Terms of Service</Button> and{" "}
            <Button variant="link" className="px-0 h-auto">Privacy Policy</Button>
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  );
}`;

  const forgotPasswordCode = `import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Mail, ArrowRight } from "lucide-react";

export function ForgotPasswordForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="name@example.com" className="pl-10" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full">
          Send reset link
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="link">Back to login</Button>
      </CardFooter>
    </Card>
  );
}`;

  const twoFactorCode = `import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./components/ui/input-otp";

export function TwoFactorForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Two-factor authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full">Verify</Button>
        <Button variant="link">Use backup code instead</Button>
      </CardFooter>
    </Card>
  );
}`;

  const socialLoginCode = `import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Github, Chrome } from "lucide-react";

export function SocialLogin() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>Choose your preferred sign in method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline">
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          Continue with email
        </Button>
      </CardContent>
    </Card>
  );
}`;

  return (
    <div>
      <ShowcaseWithNav sections={sections}>
        <ShowcaseSection
          id="login-form"
          title="Login Form"
          description="Standard login form with email and password"
        >
          <CodePlayground
            code={loginFormCode}
            title="Login Form"
            description="Clean login form with remember me and forgot password options"
          >
            <div className="flex justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="login-email" type="email" placeholder="name@example.com" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
                    </div>
                    <Button variant="link" className="px-0 h-auto">Forgot password?</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => toast.success("Logged in successfully!")}>
                    Sign in
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="signup-form"
          title="Sign Up Form"
          description="Registration form with validation and terms acceptance"
        >
          <CodePlayground
            code={signupFormCode}
            title="Sign Up Form"
            description="Complete registration form with name, email, and password confirmation"
          >
            <div className="flex justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                  <CardDescription>Enter your details to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="firstName" placeholder="John" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-email" type="email" placeholder="name@example.com" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" className="mt-1" />
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to the <Button variant="link" className="px-0 h-auto text-sm">Terms of Service</Button> and{" "}
                      <Button variant="link" className="px-0 h-auto text-sm">Privacy Policy</Button>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => toast.success("Account created successfully!")}>
                    Create account
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="forgot-password"
          title="Forgot Password"
          description="Password reset flow with email input"
        >
          <CodePlayground
            code={forgotPasswordCode}
            title="Forgot Password Form"
            description="Simple form to request a password reset link"
          >
            <div className="flex justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                  <CardDescription>
                    Enter your email address and we'll send you a link to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="reset-email" type="email" placeholder="name@example.com" className="pl-10" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full" onClick={() => toast.success("Reset link sent to your email!")}>
                    Send reset link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="link">Back to login</Button>
                </CardFooter>
              </Card>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="two-factor"
          title="Two-Factor Authentication"
          description="OTP input for two-factor authentication"
        >
          <CodePlayground
            code={twoFactorCode}
            title="Two-Factor Authentication"
            description="6-digit OTP input with authenticator app support"
          >
            <div className="flex justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Two-factor authentication</CardTitle>
                  <CardDescription>
                    Enter the 6-digit code from your authenticator app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Input
                        key={i}
                        className="w-12 h-12 text-center text-lg font-semibold"
                        maxLength={1}
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Didn't receive a code? <Button variant="link" className="px-0 h-auto">Resend</Button>
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full" onClick={() => toast.success("Verified successfully!")}>
                    Verify
                  </Button>
                  <Button variant="link">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Use backup code instead
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CodePlayground>
        </ShowcaseSection>

        <ShowcaseSection
          id="social-login"
          title="Social Login"
          description="OAuth provider buttons with divider"
        >
          <CodePlayground
            code={socialLoginCode}
            title="Social Login Options"
            description="Sign in with social providers like GitHub and Google"
          >
            <div className="flex justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                  <CardDescription>Choose your preferred sign in method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => toast("Redirecting to GitHub...")}>
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button variant="outline" onClick={() => toast("Redirecting to Google...")}>
                      <Chrome className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-email">Email</Label>
                    <Input id="social-email" type="email" placeholder="name@example.com" />
                  </div>
                  <Button className="w-full" onClick={() => toast.success("Magic link sent!")}>
                    Continue with email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CodePlayground>
        </ShowcaseSection>
      </ShowcaseWithNav>
    </div>
  );
}
