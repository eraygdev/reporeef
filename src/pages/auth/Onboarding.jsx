import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useConfig } from "../../context/ConfigContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { extractError } from "../../utils/errors";
import {
  USERNAME_REGEX,
  BIO_REGEX,
  charCount,
  findInvalidChar,
  isValidUsernameFormat,
} from "../../utils/validators";
import CharWarning from "../../components/ui/CharWarning";
import InputClearButton from "../../components/ui/InputClearButton";
import FieldError from "../../components/ui/FieldError";
import FormBanner from "../../components/ui/FormBanner";

import { API } from "../../utils/api";

export default function Onboarding() {
  const { user, loading, login, refreshUser } = useAuth();
  const { limits } = useConfig();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  const showWarning = (char) => {
    setWarning(char);
    setTimeout(() => setWarning(""), 3000);
  };

  const handleUseGithub = () => {
    if (user?.github_username) {
      setUsername(user.github_username);
      setFieldErrors({});
      setError("");
    }
  };

  const handleUsernameChange = (e) => {
    setFieldErrors({});
    setError("");
    const value = e.target.value;
    if (value === "") {
      setUsername("");
      setWarning("");
      return;
    }
    if (!USERNAME_REGEX.test(value)) {
      const bad = findInvalidChar(value, USERNAME_REGEX);
      if (bad) showWarning(bad);
      return;
    }
    if (charCount(value) > limits.username.max) return;
    setUsername(value);
    setWarning("");
  };

  const handleBioChange = (e) => {
    setError("");
    const value = e.target.value;
    if (value === "") {
      setBio("");
      return;
    }
    if (!BIO_REGEX.test(value)) return;
    if (charCount(value) > limits.bio.max) return;
    setBio(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const trimmed = username.trim();

    if (!trimmed) {
      setFieldErrors({ username: t("onboarding.error.empty") });
      return;
    }

    if (trimmed.toLowerCase().startsWith("user_")) {
      setFieldErrors({ username: t("onboarding.error.reserved") });
      return;
    }

    if (charCount(trimmed) < limits.username.min) {
      setFieldErrors({
        username: t("onboarding.error.too_short", { min: limits.username.min }),
      });
      return;
    }

    if (charCount(trimmed) > limits.username.max) {
      setFieldErrors({
        username: t("onboarding.error.too_long", { max: limits.username.max }),
      });
      return;
    }

    if (!isValidUsernameFormat(trimmed)) {
      setFieldErrors({ username: t("onboarding.error.invalid_format") });
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: trimmed, bio: bio.trim() }),
      });

      if (!res.ok) {
        const { code, message } = await extractError(res, t);
        if (code === "username_taken") {
          setFieldErrors({ username: t("onboarding.error.taken") });
        } else if (code === "username_reserved") {
          setFieldErrors({ username: t("onboarding.error.reserved") });
        } else if (code === "username_too_short") {
          setFieldErrors({
            username: t("onboarding.error.too_short", {
              min: limits.username.min,
            }),
          });
        } else {
          setError(message);
        }
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      // Yeni JWT (onboarded=true claim'i ile) → localStorage + user state
      if (data.token) {
        login(data.token);
      }
      await refreshUser();

      navigate("/", { replace: true });
    } catch {
      setError(t("onboarding.error.generic"));
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="w-full flex-1 flex items-center justify-center bg-bg">
        <p className="text-body-sm text-text-muted font-mono">
          {t("auth.loading")}
        </p>
      </div>
    );
  }

  const overUsernameLimit = charCount(username) > limits.username.max;

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent opacity-[0.06] blur-[120px] rounded-pill pointer-events-none" />

      <div className="relative w-full max-w-md px-4 py-12">
        <div className="bg-surface border border-accent/10 rounded-card p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-pill border border-accent/15 bg-bg/50">
            <span className="w-1.5 h-1.5 rounded-pill bg-accent animate-pulse" />
            <span className="text-mono-sm font-mono tracking-wider text-text-muted uppercase">
              {t("onboarding.eyebrow")}
            </span>
          </div>

          <h1 className="text-h3 font-extrabold tracking-tight text-text mb-2">
            {t("onboarding.title")}
          </h1>
          <p className="text-body-sm text-text-muted leading-relaxed mb-6">
            {t("onboarding.subtitle")}
          </p>

          {user.github_username && (
            <div className="mb-5 flex items-center justify-between gap-3 p-3 bg-bg/50 border border-accent/15 rounded-button">
              <div className="min-w-0">
                <p className="text-mono-sm text-text-muted font-mono">
                  {t("onboarding.github_hint", {
                    github_username: user.github_username,
                  })}
                </p>
                <p className="text-body-sm text-text font-mono truncate mt-0.5">
                  @{user.github_username}
                </p>
              </div>
              <button
                type="button"
                onClick={handleUseGithub}
                disabled={submitting}
                className="shrink-0 px-3 py-1.5 text-caption font-semibold text-text bg-transparent border border-accent/20 rounded-button hover:border-accent hover:bg-surface transition-all cursor-pointer disabled:opacity-50 font-mono"
              >
                {t("onboarding.github_use")}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="username"
                  className="block text-caption font-medium text-text"
                >
                  {t("onboarding.username_label")}
                </label>
                <span className="text-mono-sm text-text-muted tabular-nums font-mono">
                  {charCount(username)} / {limits.username.max}
                </span>
              </div>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder={
                    user.github_username || t("onboarding.username_placeholder")
                  }
                  autoFocus
                  disabled={submitting}
                  className={`w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                    overUsernameLimit || fieldErrors.username
                      ? "border-red-400"
                      : "border-accent/15 focus:border-accent/40"
                  }`}
                />
                <InputClearButton
                  visible={!!username}
                  onClick={() => setUsername("")}
                />
              </div>
              <FieldError message={fieldErrors.username} />
              <CharWarning char={warning} />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-caption font-medium text-text mb-1.5"
              >
                {t("onboarding.bio_label")}{" "}
                <span className="text-text-muted">{t("common.optional")}</span>
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={handleBioChange}
                placeholder={t("onboarding.bio_placeholder")}
                rows={3}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 text-body-sm bg-bg border border-accent/15 rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all resize-y disabled:opacity-50"
              />
            </div>

            <FormBanner type="error" message={error} />

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {submitting ? t("onboarding.submitting") : t("onboarding.submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
