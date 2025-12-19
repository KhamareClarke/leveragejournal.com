'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CheckoutCancel() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-gray-300">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border-2 border-gray-700 rounded-2xl p-8 space-y-4">
          <p className="text-gray-400">
            If you experienced any issues or have questions, please don't hesitate to contact our support team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold px-8 py-6 rounded-xl shadow-[0_8px_32px_rgba(241,203,50,0.4)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.6)] transition-all duration-300 hover:scale-105">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button variant="ghost" className="w-full sm:w-auto text-gray-300 hover:text-[#f1cb32] hover:bg-[#f1cb32]/10 border border-transparent hover:border-[#f1cb32]/30 px-8 py-6 rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

