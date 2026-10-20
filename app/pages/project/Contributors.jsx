import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { useToast } from "../../components/ui/Toast";
import LoadingScreen from "../../components/ui/LoadingScreen";
import NotFoundScreen from "../../components/ui/NotFoundScreen";
import Avatar from "../../components/ui/Avatar";
import PageBreadcrumb from "../../components/ui/PageBreadcrumb";
import * as Icon from "../../components/ui/Icons";
import { extractError } from "../../utils/errors";
import { getLastSeenStatus, formatLastSeen } from "../../utils/format";

import { API } from "../../utils/api";

export default function ProjectContributors() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [waInput, setWaInput] = useState("");
  const [waSaving, setWaSaving] = useState(false);

  const isOwner =
    user &&
    data?.contributors?.some(
      (c) => c.user_id === user.user_id && c.role === "owner",
    );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    fetch(`${API}/projects/${id}/contributors`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (res.status === 403) throw new Error("forbidden");
        if (res.status === 404) throw new Error("not_found");
        if (!res.ok) throw new Error("fetch_failed");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setWaInput(json.whatsappInviteUrl || "");
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.message === "forbidden") {
          navigate(`/project/${id}`, { replace: true });
          return;
        }
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleSaveWhatsapp = async () => {
    if (waSaving) return;
    setWaSaving(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/projects/${id}/contributors/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ whatsappInviteUrl: waInput.trim() }),
      });

      if (!res.ok) {
        const { message } = await extractError(res, t);
        toast.error(message);
        setWaSaving(false);
        return;
      }

      const json = await res.json();
      setData((prev) => ({
        ...prev,
        whatsappInviteUrl: json.whatsappInviteUrl,
      }));
      toast.success(t("contributors.whatsapp.saved"));
    } catch {
      toast.error(t("errors.generic"));
    } finally {
      setWaSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message={t("contributors.loading")} />;
  }

  if (error === "not_found") {
    return (
      <NotFoundScreen
        eyebrow={t("contributors.not_found_eyebrow")}
        bigText={`#${id}`}
        title={t("contributors.not_found_title")}
        description={t("contributors.not_found_desc")}
        primaryCta={{
          label: t("details.back_home"),
          to: "/",
          icon: Icon.ArrowLeft,
        }}
      />
    );
  }

  if (!data) return null;

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-default mx-auto px-4 sm:px-6 lg:px-8 py-page">
        <PageBreadcrumb
          items={[
            { label: t("breadcrumb.home"), to: "/" },
            {
              label: t("breadcrumb.project", { id: data.projectId }),
              to: `/project/${data.projectId}`,
            },
            { label: t("breadcrumb.contributors") },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-h3 font-extrabold text-text mb-2 tracking-tight">
            {t("contributors.title")}
          </h1>
          <p className="text-body-sm text-text-muted">
            {t("contributors.subtitle")}
          </p>
        </div>

        {/* WhatsApp kartı */}
        <div className="mb-6 bg-surface border border-accent/10 rounded-card p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-button bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0">
              <Icon.Link className="w-4 h-4 text-[#25D366]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-body-sm font-bold text-text font-mono uppercase tracking-wider mb-1">
                {t("contributors.whatsapp.title")}
              </h2>
              <p className="text-caption text-text-muted leading-relaxed">
                {t("contributors.whatsapp.desc")}
              </p>
            </div>
          </div>

          {isOwner ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value)}
                placeholder={t("contributors.whatsapp.placeholder")}
                disabled={waSaving}
                className="flex-1 px-3.5 py-2.5 text-body-sm bg-bg border border-accent/15 rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all disabled:opacity-50 font-mono"
              />
              <button
                type="button"
                onClick={handleSaveWhatsapp}
                disabled={waSaving}
                className="px-4 py-2.5 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              >
                {waSaving
                  ? t("contributors.whatsapp.saving")
                  : t("contributors.whatsapp.save")}
              </button>
            </div>
          ) : data.whatsappInviteUrl ? (
            <a
              href={data.whatsappInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-body-sm font-bold rounded-button hover:bg-[#25D366]/90 transition-all"
            >
              <Icon.ExternalLink className="w-4 h-4" />
              {t("contributors.whatsapp.join")}
            </a>
          ) : (
            <p className="text-caption text-text-muted/70 font-mono">
              {t("contributors.whatsapp.empty")}
            </p>
          )}
        </div>

        {/* Contributors listesi */}
        <div className="bg-surface border border-accent/10 rounded-card overflow-hidden">
          <div className="px-5 py-3 border-b border-accent/10">
            <h2 className="text-caption font-bold text-text uppercase tracking-wider font-mono">
              {t("contributors.list_title", {
                count: data.contributors.length,
              })}
            </h2>
          </div>

          <ul className="divide-y divide-accent/10">
            {data.contributors.map((c) => {
              const status = getLastSeenStatus(c.last_seen_at);
              return (
                <li key={c.user_id}>
                  <Link
                    to={`/profile/${c.username}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-bg/40 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        src={c.avatar_url}
                        username={c.username}
                        size="md"
                      />
                      {status !== "none" && status !== "older" && (
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-pill border-2 border-surface ${
                            status === "online"
                              ? "bg-green-500"
                              : status === "today"
                                ? "bg-yellow-500"
                                : "bg-white/60"
                          }`}
                          aria-label={t(`contributors.status.${status}`)}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-body-sm font-medium text-text truncate font-mono">
                          {c.username}
                        </p>
                        {c.role === "owner" && (
                          <span className="text-mono-sm px-1.5 py-0.5 rounded-pill bg-accent/10 text-accent border border-accent/20 font-mono">
                            {t("contributors.role.owner")}
                          </span>
                        )}
                      </div>
                      {c.bio && (
                        <p className="text-caption text-text-muted truncate">
                          {c.bio}
                        </p>
                      )}
                    </div>

                    <span className="text-mono-sm text-text-muted/70 font-mono shrink-0">
                      {formatLastSeen(c.last_seen_at, t)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
