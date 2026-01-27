import { ShowcaseSection } from "../ShowcaseSection";
import { Button } from "../ui-adapters/Button";
import { Badge } from "../ui-adapters/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui-adapters/Card";
import { Input } from "../ui-adapters/Input";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Heart, ArrowRight, Package } from "lucide-react";
import { toast } from "sonner";
import { ShowcaseWithNav } from "../ShowcaseWithNav";
import { useState } from "react";
import { CodePlayground } from "../CodePlayground";

export function ShoppingCartShowcase() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Premium Headphones", price: 299.99, quantity: 1, image: "🎧" },
    { id: 2, name: "Smart Watch", price: 449.99, quantity: 1, image: "⌚" },
    { id: 3, name: "Wireless Earbuds", price: 159.99, quantity: 2, image: "🎵" },
  ]);

  const [savedItems] = useState([
    { id: 4, name: "Bluetooth Speaker", price: 79.99, image: "🔊" },
    { id: 5, name: "Phone Case", price: 29.99, image: "📱" },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const sections = [
    { id: "cart-list", title: "Cart List" },
    { id: "mini-cart", title: "Mini Cart" },
    { id: "empty-cart", title: "Empty Cart" },
    { id: "saved-items", title: "Saved Items" },
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

  const cartListCode = `import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Premium Headphones", price: 299.99, quantity: 1, image: "🎧" },
    { id: 2, name: "Smart Watch", price: 449.99, quantity: 1, image: "⌚" },
    { id: 3, name: "Wireless Earbuds", price: 159.99, quantity: 2, image: "🎵" },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
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
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-3xl">
                {item.image}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-muted-foreground">\${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">\${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between text-lg">
          <span>Subtotal:</span>
          <span className="font-semibold">\${subtotal.toFixed(2)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}`;

  const miniCartCode = `import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function MiniCart({ items, subtotal }) {
  return (
    <Card className="w-80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Cart</CardTitle>
          <Badge>{items.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 text-sm">
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              {item.image}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate">{item.name}</p>
              <p className="text-muted-foreground text-xs">
                Qty: {item.quantity} × \${item.price}
              </p>
            </div>
            <p className="font-semibold">
              \${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-3 border-t">
        <div className="w-full flex justify-between">
          <span className="text-sm">Subtotal:</span>
          <span className="font-semibold">\${subtotal.toFixed(2)}</span>
        </div>
        <Button className="w-full" size="sm">View Cart</Button>
        <Button className="w-full" size="sm" variant="outline">Checkout</Button>
      </CardFooter>
    </Card>
  );
}`;

  const emptyCartCode = `import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";

function EmptyCart() {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Looks like you haven't added anything to your cart yet.
          Start shopping to fill it up!
        </p>
        <Button>
          Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}`;

  const savedItemsCode = `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";

function SavedItems({ items, onAddToCart }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Saved for Later ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-2xl">
                {item.image}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-muted-foreground">\${item.price}</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => onAddToCart(item.id)}>
                  <ShoppingBag className="w-4 h-4 mr-1" /> Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}`;

  const orderSummaryCode = `import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";

function OrderSummary({ subtotal, shipping, tax }) {
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>\${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>\${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>\${tax.toFixed(2)}</span>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Input placeholder="Promo code" />
            <Button variant="secondary" size="sm">Apply</Button>
          </div>
        </div>

        <div className="flex justify-between text-lg pt-3 border-t font-semibold">
          <span>Total</span>
          <span>\${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" size="lg">Place Order</Button>
        <p className="text-xs text-center text-muted-foreground">
          Free shipping on orders over $50
        </p>
      </CardFooter>
    </Card>
  );
}`;

  return (
    <ShowcaseWithNav sections={sections}>
      <ShowcaseSection
        id="cart-list"
        title="Shopping Cart List"
        description="Full cart view with quantity controls and item management"
      >
        <CodePlayground code={cartListCode} preview={
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-xs">
                <ShoppingBag className="w-5 h-5" />
                Shopping Cart ({cartItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-md pb-md border-b last:border-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1">{item.name}</h4>
                      <p className="text-muted-foreground mb-xs">${item.price}</p>
                      <div className="flex items-center gap-xs">
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
                    <div className="flex flex-col items-end gap-xs">
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
            <CardFooter className="flex-col gap-md">
              <div className="w-full flex gap-xs">
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
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="mini-cart"
        title="Mini Cart Dropdown"
        description="Compact cart preview for header dropdowns or sidebars"
      >
        <CodePlayground code={miniCartCode} preview={
          <div className="max-w-sm mx-auto">
            <Card>
              <CardHeader className="pb-sm">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Cart</CardTitle>
                  <Badge>{cartItems.length} items</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-sm text-sm">
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
              <CardFooter className="flex-col gap-xs pt-sm border-t">
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
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="empty-cart"
        title="Empty Cart State"
        description="Friendly empty state with call-to-action to continue shopping"
      >
        <CodePlayground code={emptyCartCode} preview={
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-md bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-xs">Your cart is empty</h3>
              <p className="text-muted-foreground mb-md max-w-sm mx-auto">
                Looks like you haven't added anything to your cart yet.
                Start shopping to fill it up!
              </p>
              <Button onClick={() => toast("Navigating to shop...")}>
                Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="saved-items"
        title="Saved for Later"
        description="Wishlist items that can be moved to cart"
      >
        <CodePlayground code={savedItemsCode} preview={
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-xs">
                <Heart className="w-5 h-5" />
                Saved for Later ({savedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-md sm:grid-cols-2">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex gap-sm p-sm border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-rose-50 rounded flex items-center justify-center text-2xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-muted-foreground">${item.price}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-xs"
                        onClick={() => toast.success(`${item.name} added to cart!`)}
                      >
                        <Package className="w-4 h-4 mr-1" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        } />
      </ShowcaseSection>

      <ShowcaseSection
        id="summary"
        title="Order Summary"
        description="Detailed price breakdown for checkout with promo code support"
      >
        <CodePlayground code={orderSummaryCode} preview={
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-sm">
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
                <div className="pt-sm border-t">
                  <div className="flex items-center gap-xs mb-sm">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Enter promo code" />
                    <Button variant="secondary" size="sm" onClick={() => toast.success("Promo applied!")}>
                      Apply
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-lg pt-sm border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-xs">
                <Button className="w-full" size="lg" onClick={() => toast.success("Order placed!")}>
                  Place Order
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Free shipping on orders over $50
                </p>
              </CardFooter>
            </Card>
          </div>
        } />
      </ShowcaseSection>
    </ShowcaseWithNav>
  );
}
