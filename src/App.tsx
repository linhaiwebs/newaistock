import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TemplateSwitcher } from './components/templates/TemplateSwitcher';
import { LoginPage } from './components/admin/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { UsersPage } from './components/admin/UsersPage';
import { AnalyticsPage } from './components/admin/AnalyticsPage';
import { RedirectsPage } from './components/admin/RedirectsPage';
import { CachePage } from './components/admin/CachePage';
import { TemplatesPage } from './components/admin/TemplatesPage';
import { TemplateEditor } from './components/admin/TemplateEditor';
import { DomainsPage } from './components/admin/DomainsPage';
import { DomainForm } from './components/admin/DomainForm';
import ContentPage from './components/admin/ContentPage';
import { initializeAnalytics } from './lib/analytics';
import { trackSession, trackDuration } from './lib/api';
import { getSessionId, trackSessionDuration } from './lib/session';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  useEffect(() => {
    initializeAnalytics();

    const sessionId = getSessionId();
    const getDuration = trackSessionDuration();

    trackSession(
      sessionId,
      'unknown',
      navigator.userAgent,
      document.referrer
    ).catch(console.error);

    const interval = setInterval(() => {
      const duration = getDuration();
      trackDuration(sessionId, duration).catch(console.error);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TemplateSwitcher />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="domains" element={<DomainsPage />} />
            <Route path="domains/new" element={<DomainForm />} />
            <Route path="domains/:id/edit" element={<DomainForm />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="redirects" element={<RedirectsPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="templates/:id/edit" element={<TemplateEditor />} />
            <Route path="cache" element={<CachePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default App;
