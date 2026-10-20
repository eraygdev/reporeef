import "./index.css"; // <-- BU SATIRI EKLE
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";
import { useState, useEffect, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useScale } from "./hooks/useScale";
import { ConfigProvider } from "./context/ConfigContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import CookieBanner from "./components/layout/CookieBanner";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import { ToastProvider } from "./components/ui/Toast";
import PageTransition from "./components/ui/PageTransition";

// Sayfa yüklenirken gösterilecek spinner
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <svg
        className="w-6 h-6 text-accent animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// Sayfa değişince en üste kaydır
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const FULLSCREEN_ROUTES = [
  "/login",
  "/register",
  "/auth/callback",
  "/onboarding",
];

// Uygulama İskeleti ve Layout Yönetimi
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (loading || !user) return;
    const onboarded = user.onboarded !== false;

    if (!onboarded && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
      return;
    }
    if (onboarded && location.pathname === "/onboarding") {
      navigate("/", { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans text-text selection:bg-accent selection:text-bg">
      {!isFullscreen && <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />}
      {!isFullscreen && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <main
        className={`flex-1 flex flex-col w-full bg-bg min-h-0 overflow-x-clip ${isFullscreen ? "overflow-y-hidden" : ""}`}
      >
        <Suspense fallback={<PageLoader />}>
          <PageTransition>
            <Outlet /> {/* Rotalarımız burada yüklenecek */}
          </PageTransition>
        </Suspense>
      </main>

      {!isFullscreen && <Footer />}
      <ScrollToTopButton />
      <CookieBanner />
    </div>
  );
}

// Ana HTML Şablonu (Eski index.html'in görevini yapar)
export function Layout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#161A22" />
        <title>
          RepoReef — Açık Kaynak Proje Paylaşım ve Ekip Kurma Platformu
        </title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Root Bileşeni (Provider'ları sarar)
export default function App() {
  useScale();

  return (
    <ConfigProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ConfigProvider>
  );
}
