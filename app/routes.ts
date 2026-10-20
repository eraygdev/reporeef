import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/project/Home.jsx"),
  route("profile/:username", "pages/user/Profile.jsx"),

  // Settings alt rotaları
  route("settings", "pages/settings/SettingsLayout.jsx", [
    index("pages/settings/Index.jsx"), // /settings'e gelince /settings/account'a yönlendirir
    route("account", "pages/settings/Account.jsx"),
    route("appearance", "pages/settings/Appearance.jsx"),
    route("notifications", "pages/settings/Notifications.jsx"),
    route("danger", "pages/settings/Danger.jsx"),
  ]),

  route("dashboard", "pages/user/Dashboard.jsx"),
  route("create-project", "pages/project/Create.jsx"),
  route("project/:id/edit", "pages/project/Edit.jsx"),
  route("project/:id/contributors", "pages/project/Contributors.jsx"),
  route("project/:id", "pages/project/Details.jsx"),

  route("login", "pages/auth/Login.jsx"),
  route("register", "pages/auth/Register.jsx"),
  route("auth/callback", "pages/auth/Callback.jsx"),
  route("onboarding", "pages/auth/Onboarding.jsx"),

  route("about", "pages/legal/About.jsx"),
  route("privacy", "pages/legal/Privacy.jsx"),
  route("terms", "pages/legal/Terms.jsx"),
  route("cookies", "pages/legal/Cookies.jsx"),

  route("*", "pages/NotFound.jsx"),
] satisfies RouteConfig;
