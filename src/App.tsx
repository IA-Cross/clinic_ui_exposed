import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { usePageTracking } from './hooks/usePageTracking';
import { HomePage } from './pages/HomePage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';

// El código del panel de administración se descarga solo cuando se visita
// /admin: los visitantes del sitio público no lo pagan.
const AdminLoginPage = lazy(() =>
  import('./pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminEditorPage = lazy(() =>
  import('./pages/AdminEditorPage').then((m) => ({ default: m.AdminEditorPage })),
);
const AdminSettingsPage = lazy(() =>
  import('./pages/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })),
);
const AdminResetPage = lazy(() =>
  import('./pages/AdminResetPage').then((m) => ({ default: m.AdminResetPage })),
);

// Desplaza la vista al ancla (#servicios, #contacto) tras navegar
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function PageTracker() {
  usePageTracking();
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <AuthProvider>
          <BlogProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <ScrollManager />
              <PageTracker />
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                }
              >
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                <Route path="/blog" element={<PublicLayout><BlogListPage /></PublicLayout>} />
                <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />

                {/* Rutas de administración (no enlazadas desde el sitio público) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/reset" element={<AdminResetPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <AdminSettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/new"
                  element={
                    <ProtectedRoute>
                      <AdminEditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/:id/edit"
                  element={
                    <ProtectedRoute>
                      <AdminEditorPage />
                    </ProtectedRoute>
                  }
                />

                {/* Cualquier otra ruta */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </BlogProvider>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

export default App;
