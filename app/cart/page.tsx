'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createCheckoutSession } from '@/lib/stripe';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    try {
      setIsProcessing(true);
      // Pass cart items to checkout so quantities are included
      await createCheckoutSession(user?.id, user?.email, items);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-600" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                <span className="animate-gradient">Your Cart is Empty</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Start adding items to your cart to see them here.
              </p>
            </div>
            <Link href="/">
              <Button className="bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold px-8 py-6 rounded-xl shadow-[0_8px_32px_rgba(241,203,50,0.4)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.6)] transition-all duration-300 hover:scale-105">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-24">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#f1cb32] mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="animate-gradient">Shopping Cart</span>
          </h1>
          <p className="text-gray-400 mt-2">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/20 p-6 hover:border-[#f1cb32]/40 transition-all duration-300 rounded-2xl"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 bg-gradient-to-br from-neutral-900 to-black rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-2xl font-black animate-gradient mb-4">
                        £{(item.price / 100).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="border-[#f1cb32]/30 text-[#f1cb32] hover:bg-[#f1cb32]/10 w-10 h-10 rounded-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-bold text-lg w-12 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="border-[#f1cb32]/30 text-[#f1cb32] hover:bg-[#f1cb32]/10 w-10 h-10 rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/20 p-6 rounded-2xl sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
                  <span className="text-white font-semibold">£{(getTotalPrice() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="border-t border-[#f1cb32]/20 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-2xl font-black animate-gradient">
                    £{(getTotalPrice() / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
                className="w-full bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold py-6 rounded-xl shadow-[0_8px_32px_rgba(241,203,50,0.4)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.6)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={clearCart}
                className="w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                Clear Cart
              </Button>

              <div className="mt-6 pt-6 border-t border-[#f1cb32]/20">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>✓</span>
                  <span>Free UK Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>✓</span>
                  <span>30-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>✓</span>
                  <span>Secure Payment</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

