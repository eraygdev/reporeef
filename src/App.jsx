import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import CookieBanner from "./components/layout/CookieBanner";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import { ToastProvider } from "./components/ui/Toast";
import PageTransition from "./components/ui/PageTransition";

// ─── Lazy-loaded pages ───
// Her route kendi chunk'ında — ilk yüklemede sadece gerekli sayfa iner.
const Home = lazy(() => import("./pages/project/Home"));
const UserProfile = lazy(() => import("./pages/user/Profile"));
const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout"));
const SettingsAccount = lazy(() => import("./pages/settings/Account"));
const SettingsAppearance = lazy(() => import("./pages/settings/Appearance"));
const SettingsNotifications = lazy(
  () => import("./pages/settings/Notifications"),
);
const SettingsDanger = lazy(() => import("./pages/settings/Danger"));
const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const CreateProject = lazy(() => import("./pages/project/Create"));
const EditProject = lazy(() => import("./pages/project/Edit"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Onboarding = lazy(() => import("./pages/auth/Onboarding"));
const ProjectDetail = lazy(() => import("./pages/project/Details"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthCallback = lazy(() => import("./pages/auth/Callback"));
const About = lazy(() => import("./pages/legal/About"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));

// ─── Sayfa geçişinde gösterilen hafif spinner ───
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children, hideFooter, hideNavbar }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans text-text selection:bg-accent selection:text-bg">
      {!hideNavbar && <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />}
      {!hideNavbar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <main
        className={`flex-1 flex flex-col w-full bg-bg min-h-0 overflow-x-clip ${
          hideFooter ? "overflow-y-hidden" : ""
        }`}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  );
}

const FULLSCREEN_ROUTES = [
  "/login",
  "/register",
  "/auth/callback",
  "/onboarding",
];

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    // Onboarding tamamlanmadıysa → /onboarding'e zorla
    if (!user.onboarded && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
      return;
    }

    // Onboarding tamamlandıysa /onboarding'de durmasın
    if (user.onboarded && location.pathname === "/onboarding") {
      navigate("/", { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <>
      <Layout hideFooter={isFullscreen} hideNavbar={isFullscreen}>
        <Suspense fallback={<PageLoader />}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/settings" element={<SettingsLayout />}>
                <Route
                  index
                  element={<Navigate to="/settings/account" replace />}
                />
                <Route path="account" element={<SettingsAccount />} />
                <Route path="appearance" element={<SettingsAppearance />} />
                <Route
                  path="notifications"
                  element={<SettingsNotifications />}
                />
                <Route path="danger" element={<SettingsDanger />} />
              </Route>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:id/edit" element={<EditProject />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/project/:id" element={<ProjectDetail />} />

              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </Layout>

      {/* Cookie banner her route'ta görünür — onboarding bile olsa */}
      <CookieBanner />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
