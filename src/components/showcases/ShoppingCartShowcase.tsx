import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Input } from "../ui-adapters/Input";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";

export function ShoppingCartShowcase() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Premium Headphones", price: 299.99, quantity: 1, image: "🎧" },
    { id: 2, name: "Smart Watch", price: 449.99, quantity: 1, image: "⌚" },
    { id: 3, name: "Wireless Earbuds", price: 159.99, quantity: 2, image: "🎵" },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const sections = [
    { id: "cart-list", title: "Cart List" },
    { id: "mini-cart", title: "Mini Cart" },
    { id: "summary", title: "Order Summary" },
  ];

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="cart-list"
        title="Shopping Cart List"
        description="Full cart view with quantity controls"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shopping Cart ({cartItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1">{item.name}</h4>
                    <p className="text-muted-foreground mb-2">${item.price}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <div className="w-full flex gap-2">
              <Input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button variant="outline" onClick={() => toast.success("Promo applied!")}>
                Apply
              </Button>
            </div>
            <div className="w-full flex items-center justify-between text-lg">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={() => toast.success("Proceeding to checkout!")}>
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        id="mini-cart"
        title="Mini Cart Dropdown"
        description="Compact cart preview for header/sidebar"
      >
        <div className="max-w-sm mx-auto">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Cart</CardTitle>
                <Badge>{cartItems.length} items</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded flex items-center justify-center text-xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate mb-0.5">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-3 border-t">
              <div className="w-full flex items-center justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="sm" onClick={() => toast("Opening cart...")}>
                View Cart
              </Button>
              <Button className="w-full" size="sm" variant="outline" onClick={() => toast.success("Checking out!")}>
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="summary"
        title="Order Summary"
        description="Detailed price breakdown for checkout"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
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
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Enter promo code" size={32} />
                  <Button variant="secondary" size="sm">Apply</Button>
                </div>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" size="lg" onClick={() => toast.success("Order placed!")}>
                Place Order
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </CardFooter>
          </Card>
        </div>
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
