import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { DollarSign, ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';

export default function Statistics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data.data;
    },
    refetchInterval: 60000, // refresh every 60s
  });

  if (isLoading || !stats) {
    return <div className="bg-white rounded-3xl p-12 text-center text-text-muted">Loading statistics...</div>;
  }

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      prefix: '',
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Revenue',
      value: stats.revenue,
      prefix: '₦',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pending',
      value: stats.pending,
      prefix: '',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: "Today's Revenue",
      value: stats.todayRevenue,
      prefix: '₦',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <Icon size={24} />
              </div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className="text-3xl font-black text-text-dark">
                {card.prefix}
                <CountUp end={card.value || 0} duration={1.5} separator="," />
              </p>
            </div>
          );
        })}
      </div>

      {/* In progress */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
              Orders In Progress
            </p>
            <p className="text-3xl font-black text-brand-red">
              <CountUp end={stats.inProgress || 0} duration={1.5} />
            </p>
          </div>
          <Clock size={40} className="text-brand-red opacity-20" />
        </div>
      </div>

      {/* Top items */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-text-dark mb-4">Top Selling Items</h2>
        {!stats.topItems || stats.topItems.length === 0 ? (
          <p className="text-text-muted text-sm">No sales data yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.topItems.map((item, index) => (
              <div key={item._id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center font-black text-brand-red text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-text-dark">{item.name}</p>
                  <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-brand-red rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, (item.totalQty / (stats.topItems[0]?.totalQty || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="font-bold text-text-dark whitespace-nowrap">
                  <CountUp end={item.totalQty || 0} duration={1.5} /> sold
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}