import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Input } from "../ui-adapters/Input";
import { Label } from "../ui/label";
import { CreditCard, Lock, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function CheckoutShowcase() {
  const [step, setStep] = useState(1);

  const sections = [
    { id: "multi-step", title: "Multi-Step Checkout" },
    { id: "single-page", title: "Single Page" },
    { id: "payment-methods", title: "Payment Methods" },
  ];

  const cartItems = [
    { id: 1, name: "Premium Headphones", price: 299.99, quantity: 1 },
    { id: 2, name: "Wireless Earbuds", price: 159.99, quantity: 2 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="multi-step"
        title="Multi-Step Checkout"
        description="Progressive checkout flow with steps"
      >
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-xl">
            {[
              { num: 1, label: "Shipping" },
              { num: 2, label: "Payment" },
              { num: 3, label: "Review" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-sm mt-xs">{s.label}</span>
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-md ${
                      step > s.num ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-lg">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {step === 1 && "Shipping Information"}
                    {step === 2 && "Payment Details"}
                    {step === 3 && "Review Order"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-md">
                  {step === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-md">
                        <div className="space-y-xs">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div className="space-y-xs">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      <div className="space-y-xs">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="123 Main St" />
                      </div>
                      <div className="grid grid-cols-3 gap-md">
                        <div className="space-y-xs col-span-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="New York" />
                        </div>
                        <div className="space-y-xs">
                          <Label htmlFor="zip">ZIP</Label>
                          <Input id="zip" placeholder="10001" />
                        </div>
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div className="space-y-xs">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="space-y-xs">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                      <div className="grid grid-cols-2 gap-md">
                        <div className="space-y-xs">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-xs">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" type="password" />
                        </div>
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <div className="space-y-md">
                      <div className="p-md bg-muted rounded-lg space-y-xs">
                        <p className="text-sm font-semibold">Shipping To:</p>
                        <p className="text-sm text-muted-foreground">
                          John Doe<br />
                          123 Main St<br />
                          New York, NY 10001
                        </p>
                      </div>
                      <div className="p-md bg-muted rounded-lg space-y-xs">
                        <p className="text-sm font-semibold">Payment Method:</p>
                        <p className="text-sm text-muted-foreground">
                          Visa ending in 3456
                        </p>
                      </div>
                      <div className="flex items-center gap-xs text-sm text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        Your payment information is secure
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-sm">
                  {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (step < 3) {
                        setStep(step + 1);
                      } else {
                        toast.success("Order placed successfully!");
                        setStep(1);
                      }
                    }}
                  >
                    {step === 3 ? "Place Order" : "Continue"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-sm text-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-sm border-t space-y-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-sm border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="single-page"
        title="Single Page Checkout"
        description="All checkout fields on one page"
      >
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-lg">
          <div className="md:col-span-2 space-y-lg">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-xs">
                  <Truck className="w-5 h-5" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-md">
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-xs">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-xs">
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-xs">
                  <Label>Address</Label>
                  <Input placeholder="123 Main St" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-xs">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-md">
                <div className="space-y-xs">
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-xs">
                    <Label>CVV</Label>
                    <Input placeholder="123" type="password" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-md">
              <CardHeader>
                <CardTitle className="text-base">Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-sm text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-sm border-t flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={() => toast.success("Order placed!")}>
                  <Lock className="w-4 h-4 mr-xs" />
                  Complete Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="payment-methods"
        title="Payment Method Selection"
        description="Different payment options for checkout"
      >
        <div className="max-w-2xl mx-auto space-y-md">
          {[
            { icon: "💳", name: "Credit Card", desc: "Visa, Mastercard, Amex" },
            { icon: "🅿️", name: "PayPal", desc: "Pay with your PayPal account" },
            { icon: "🍎", name: "Apple Pay", desc: "Pay with Apple Pay" },
            { icon: "🏦", name: "Bank Transfer", desc: "Direct bank transfer" },
          ].map((method) => (
            <Card
              key={method.name}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => toast(`Selected ${method.name}`)}
            >
              <CardContent className="flex items-center gap-md p-md">
                <div className="text-3xl">{method.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.desc}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
