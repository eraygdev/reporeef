import Legal from "../../components/layout/Legal";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Privacy() {
  const { t, lang } = useLanguage();

  const sections = [
    {
      id: "intro",
      title: "Introduction",
      content: (
        <>
          <p>
            This privacy policy explains what data is collected when you use the
            RepoReef platform, how it is used, and your rights.
          </p>
          <p>
            By using the platform, you are deemed to have accepted this policy.
          </p>
        </>
      ),
    },
    {
      id: "data-collected",
      title: "Data Collected",
      content: (
        <>
          <p>
            When you create an account and use the platform, the following data
            is collected:
          </p>
          <ul>
            <li>
              <strong>Identity data:</strong> Username, email address, GitHub
              username, avatar URL — all coming from your GitHub account.
            </li>
            <li>
              <strong>Profile data:</strong> Biography, username change history
              (timestamp only).
            </li>
            <li>
              <strong>Project data:</strong> Projects you publish, title,
              description, links, categories, and contributor limit.
            </li>
            <li>
              <strong>Interaction data:</strong> Stars, join requests,
              contributor status, login records (audit log).
            </li>
            <li>
              <strong>Technical data:</strong> IP address (for audit log only),
              user agent, request timestamps.
            </li>
          </ul>
          <p>
            <strong>What we do NOT collect:</strong> passwords (GitHub OAuth
            only), tracking cookies, analytics identifiers, advertising IDs, or
            any form of behavioral profiling.
          </p>
        </>
      ),
    },
    {
      id: "purpose",
      title: "Purpose of Data Use",
      content: (
        <>
          <p>The collected data is used for:</p>
          <ul>
            <li>Creating and managing your account</li>
            <li>Publishing and displaying your projects</li>
            <li>Ensuring platform security and preventing abuse</li>
            <li>Detecting and preventing fraud</li>
            <li>Improving the service based on aggregate usage patterns</li>
          </ul>
        </>
      ),
    },
    {
      id: "third-parties",
      title: "Third-Party Services",
      content: (
        <>
          <p>RepoReef uses the following third-party services:</p>
          <ul>
            <li>
              <strong>GitHub OAuth:</strong> For authentication. GitHub's
              privacy policy applies.
            </li>
            <li>
              <strong>Neon (PostgreSQL):</strong> Database hosting. Data is
              stored in the EU/US depending on the Neon region.
            </li>
            <li>
              <strong>Vercel:</strong> Frontend hosting and CDN.
            </li>
            <li>
              <strong>Cloudflare:</strong> DNS, SSL, and tunnel for API traffic.
              Cloudflare may temporarily see incoming requests but does not
              store request content.
            </li>
            <li>
              <strong>Sentry:</strong> Backend error monitoring. Only error
              stack traces and request metadata (path, method, status code) are
              sent — no user content. Used exclusively for debugging.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "security",
      title: "Data Security",
      content: (
        <>
          <p>
            Your data is transmitted over encrypted connections (HTTPS).
            Passwords are never stored — authentication uses GitHub OAuth.
          </p>
          <p>
            <strong>JWT tokens</strong> are valid for 7 days and contain only an
            internal user ID, premium status flag, and onboarding status.
            Neither your email address nor your username is included in the
            token — this is a deliberate privacy-first choice.
          </p>
          <p>
            However, no transmission over the internet is 100% secure. We take
            industry-standard measures to protect your data.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      title: "Your Rights",
      content: (
        <>
          <p>Under GDPR and similar laws, you have the following rights:</p>
          <ul>
            <li>Requesting access to your data</li>
            <li>Requesting correction of incorrect data</li>
            <li>Requesting deletion of your account and data</li>
            <li>Objecting to data processing</li>
            <li>Requesting data portability</li>
          </ul>
          <p>
            For your requests, write to{" "}
            <a href="mailto:hello@reporeef.com">hello@reporeef.com</a>. We
            respond within 30 days.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      title: "Data Retention",
      content: (
        <>
          <p>
            Account data is retained as long as your account is active. When you
            delete your account:
          </p>
          <ul>
            <li>Personal profile data is removed immediately.</li>
            <li>Projects you authored are deleted.</li>
            <li>
              Anonymous audit log entries (login, create, delete) are retained
              for security purposes — these contain no personally identifying
              content.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "changes",
      title: "Policy Changes",
      content: (
        <p>
          This policy may be updated from time to time. Important changes are
          announced on the platform. The current version is always published on
          this page.
        </p>
      ),
    },
  ];

  // KVKK aydınlatma metni — yalnızca Türkçe seçiliyken eklenir
  if (lang === "tr") {
    sections.push({
      id: "kvkk",
      title: "KVKK Aydınlatma Metni",
      content: (
        <>
          <p>
            Bu bölüm, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")
            kapsamında veri sorumlusu sıfatıyla yapılan bilgilendirmedir.
          </p>
          <p>
            <strong>Veri Sorumlusu:</strong> RepoReef —{" "}
            <a href="mailto:hello@reporeef.com">hello@reporeef.com</a>
          </p>
          <p>
            <strong>İşlenen Veriler:</strong> GitHub kullanıcı adı, e-posta
            adresi, profil resmi URL'i, IP adresi (yalnızca audit log), hesap
            oluşturma tarihi.
          </p>
          <p>
            <strong>İşleme Amaçları:</strong> Hesap oluşturma ve yönetimi,
            kimlik doğrulama, platform güvenliği, hizmet sunumu.
          </p>
          <p>
            <strong>Hukuki Sebep:</strong> Açık rıza ve sözleşmenin ifası (KVKK
            m.5/2-c).
          </p>
          <p>
            <strong>Haklarınız:</strong> KVKK m.11 kapsamında; verilerinizin
            işlenip işlenmediğini öğrenme, düzeltme, silme ve itiraz etme
            haklarına sahipsiniz. Başvuru için:{" "}
            <a href="mailto:hello@reporeef.com">hello@reporeef.com</a>
          </p>
        </>
      ),
    });
  }

  return (
    <Legal
      title={t("privacy.title")}
      updatedAt="October 14, 2026"
      sections={sections}
    />
  );
}
