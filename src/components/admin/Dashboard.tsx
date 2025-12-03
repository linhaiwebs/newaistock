import { useEffect, useState } from 'react';
import { Users, TrendingUp, Target, Clock, Activity, MousePointerClick } from 'lucide-react';
import { getOverviewStats } from '../../lib/api';

interface Stats {
  totalUsers: number;
  totalDiagnoses: number;
  totalConversions: number;
  avgSessionTime: number;
  diagnosisRate: string;
  conversionRate: string;
  diagnosisClicks: number;
  conversionClicks: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const data = await getOverviewStats(token);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">没有找到数据</div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">仪表板</h1>
        <p className="text-gray-600">系统整体统计和性能概览</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="总用户数"
          value={stats.totalUsers.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          label="总诊断数"
          value={stats.totalDiagnoses.toLocaleString()}
          color="green"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="总转化数"
          value={stats.totalConversions.toLocaleString()}
          color="indigo"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="平均停留时间"
          value={formatTime(stats.avgSessionTime)}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">诊断率</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {stats.diagnosisRate}%
          </div>
          <p className="text-sm text-gray-600">
            每个用户的诊断执行率
          </p>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${Math.min(parseFloat(stats.diagnosisRate), 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">转化率</h3>
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {stats.conversionRate}%
          </div>
          <p className="text-sm text-gray-600">
            诊断后的转化率
          </p>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min(parseFloat(stats.conversionRate), 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">点击事件</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MousePointerClick className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.diagnosisClicks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">诊断按钮点击</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <MousePointerClick className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.conversionClicks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">转化按钮点击</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
