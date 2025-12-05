import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Link2, Database, LogOut, AlertCircle, Layout, Globe, FileText, Book } from 'lucide-react';
import { verifyAuth } from '../../lib/api';
import { getToken, removeToken, isTokenExpired } from '../../lib/auth';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = getToken();
        if (!token || isTokenExpired()) {
          setAuthError('会话已过期，请重新登录');
          setTimeout(() => {
            removeToken();
            navigate('/admin/login');
          }, 2000);
          return;
        }

        const result = await verifyAuth(token);
        if (!result || !result.valid) {
          setAuthError('认证失败，请重新登录');
          setTimeout(() => {
            removeToken();
            navigate('/admin/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthError('认证验证失败');
      }
    }

    checkAuth();
  }, [navigate]);

  function handleLogout() {
    removeToken();
    navigate('/admin/login');
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: '仪表板' },
    { path: '/admin/users', icon: Users, label: '用户管理' },
    { path: '/admin/analytics', icon: BarChart3, label: '数据分析' },
    { path: '/admin/domains', icon: Globe, label: '域名管理' },
    { path: '/admin/content', icon: FileText, label: '内容管理' },
    { path: '/admin/footer-pages', icon: Book, label: '页脚页面' },
    { path: '/admin/redirects', icon: Link2, label: '重定向管理' },
    { path: '/admin/templates', icon: Layout, label: '模板管理' },
    { path: '/admin/cache', icon: Database, label: '缓存管理' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {authError && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 shadow-lg max-w-md">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{authError}</p>
        </div>
      )}

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">AI株式診断</h1>
            <p className="text-sm text-gray-600">管理画面</p>
          </div>

          <nav className="p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>退出登录</span>
            </button>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
