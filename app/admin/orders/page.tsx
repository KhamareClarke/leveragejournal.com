'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ShoppingBag, Mail, Calendar, PoundSterling, Package, Loader2, MapPin, Phone, Home } from 'lucide-react';

interface Order {
  orderId: string;
  customerEmail: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  price: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  metadata: any;
  shippingAddress: string | null;
  shippingAddressRaw: any;
  billingAddress: string | null;
  billingAddressRaw: any;
  shippingName: string | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.amountTotal, 0);
  const totalOrders = orders.length;

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#f1cb32] mx-auto mb-4" />
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={fetchOrders}
            className="bg-[#f1cb32] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#d4a017] transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="animate-gradient">Leverage Journal Orders</span>
          </h1>
          <p className="text-gray-400">All Leverage Journal orders only</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-black text-[#f1cb32]">{totalOrders}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-[#f1cb32]" />
            </div>
          </Card>
          <Card className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-black text-[#f1cb32]">£{totalRevenue.toFixed(2)}</p>
              </div>
              <PoundSterling className="w-10 h-10 text-[#f1cb32]" />
            </div>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/30 p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-2">No orders yet</p>
            <p className="text-sm text-gray-500">Orders will appear here once customers make purchases.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.orderId}
                className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/30 p-6 hover:border-[#f1cb32]/50 transition-all"
              >
                <div className="space-y-4">
                  {/* Top Row: Order Info, Customer, Product */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Order Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#f1cb32]" />
                        <p className="text-sm text-gray-400">Order ID</p>
                      </div>
                      <p className="font-mono text-xs text-white break-all">{order.orderId}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-[#f1cb32]" />
                        <p className="text-sm text-gray-400">Customer</p>
                      </div>
                      <p className="text-white font-semibold">{order.customerName}</p>
                      <p className="text-xs text-gray-400 break-all">{order.customerEmail}</p>
                      {order.phone && order.phone !== 'Not provided' && (
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <p className="text-xs text-gray-400">{order.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* Product & Price */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Product</p>
                      <p className="text-white font-semibold">{order.productName}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <p className="text-xs text-gray-400">Quantity: {order.quantity}</p>
                          <p className="text-xs text-gray-400">Status: <span className="text-green-400 capitalize">{order.paymentStatus}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-[#f1cb32]">{order.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  {(order.shippingAddress || order.billingAddress) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#f1cb32]/20">
                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#f1cb32]" />
                            <p className="text-sm text-gray-400 font-semibold">Shipping Address</p>
                          </div>
                          {order.shippingName && order.shippingName !== order.customerName && (
                            <p className="text-white font-medium text-sm">{order.shippingName}</p>
                          )}
                          <p className="text-white text-sm leading-relaxed">{order.shippingAddress}</p>
                          {order.shippingAddressRaw && (
                            <div className="mt-2 space-y-1 text-xs text-gray-400">
                              {order.shippingAddressRaw.country && (
                                <p>Country: {order.shippingAddressRaw.country}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Billing Address */}
                      {order.billingAddress && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Home className="w-5 h-5 text-[#f1cb32]" />
                            <p className="text-sm text-gray-400 font-semibold">Billing Address</p>
                          </div>
                          <p className="text-white text-sm leading-relaxed">{order.billingAddress}</p>
                          {order.billingAddressRaw && (
                            <div className="mt-2 space-y-1 text-xs text-gray-400">
                              {order.billingAddressRaw.country && (
                                <p>Country: {order.billingAddressRaw.country}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Show message if no address */}
                      {!order.shippingAddress && !order.billingAddress && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 italic">No address information available for this order</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchOrders}
            className="bg-[#f1cb32] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#d4a017] transition-colors"
          >
            Refresh Orders
          </button>
        </div>
      </div>
    </main>
  );
}
