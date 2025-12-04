import { useEffect, useState } from 'react';
import { Users as UsersIcon, ChevronLeft, ChevronRight, Calendar, Clock, MousePointerClick } from 'lucide-react';
import { getUsers } from '../../lib/api';

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [page]);

  async function loadUsers() {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const data = await getUsers(token, page);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">用户管理</h1>
        <p className="text-gray-600">用户活动与行为分析</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <UsersIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        会话: {user.session_id.substring(0, 12)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        IP: {user.ip_address || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(user.first_visit)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      停留时间
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatDuration(user.session_duration || 0)}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MousePointerClick className="w-4 h-4" />
                      诊断次数
                    </div>
                    <div className="font-semibold text-gray-900">
                      {user.diagnoses?.length || 0}次
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MousePointerClick className="w-4 h-4" />
                      转化次数
                    </div>
                    <div className="font-semibold text-gray-900">
                      {user.diagnoses?.filter((d: any) => d.converted).length || 0}次
                    </div>
                  </div>
                </div>

                {user.diagnoses && user.diagnoses.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">诊断历史</div>
                    <div className="space-y-2">
                      {user.diagnoses.map((diagnosis: any) => (
                        <div key={diagnosis.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            股票代码: <span className="font-semibold">{diagnosis.stock_code}</span>
                            {diagnosis.from_cache && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                缓存
                              </span>
                            )}
                          </span>
                          <span className="text-gray-500">
                            {formatDate(diagnosis.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {user.user_agent && (
                  <div className="border-t pt-4 mt-4">
                    <div className="text-xs text-gray-500">
                      User Agent: {user.user_agent}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              第 {page} / {totalPages} 页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                上一页
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                下一页
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
