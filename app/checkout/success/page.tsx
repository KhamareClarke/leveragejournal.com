'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger email notification if webhook hasn't fired yet
    if (sessionId) {
      // Call API to send confirmation email as fallback
      fetch('/api/checkout/confirm-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      }).catch(err => {
        console.log('Email notification will be sent via webhook:', err);
      });
    }
    setLoading(false);
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#f1cb32] to-[#d4a017] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(241,203,50,0.5)]">
              <CheckCircle className="w-10 h-10 text-black" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="animate-gradient">Order Confirmed!</span>
          </h1>
          
          <p className="text-xl text-gray-300">
            Your order has been made and will be delivered very soon!
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/30 rounded-2xl p-8 space-y-4">
          <div className="space-y-2">
            <p className="text-gray-400">Order Details</p>
            <p className="text-white font-semibold">Leverage Journal - First Edition A5</p>
            <p className="text-[#f1cb32] font-bold text-xl">£19.99</p>
          </div>
          
          <div className="pt-4 border-t border-[#f1cb32]/20">
            <p className="text-lg text-[#f1cb32] font-semibold mb-2">
              ✅ Your order is confirmed and payment has been received!
            </p>
            <p className="text-sm text-gray-400">
              We will deliver your Leverage Journal very soon. You will receive a confirmation email with your order details and shipping information.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold px-8 py-6 rounded-xl shadow-[0_8px_32px_rgba(241,203,50,0.4)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.6)] transition-all duration-300 hover:scale-105">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" className="w-full sm:w-auto text-gray-300 hover:text-[#f1cb32] hover:bg-[#f1cb32]/10 border border-transparent hover:border-[#f1cb32]/30 px-8 py-6 rounded-xl">
              <ArrowRight className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

