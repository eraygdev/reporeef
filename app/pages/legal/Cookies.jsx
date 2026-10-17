import Legal from "../../components/layout/Legal";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Cookies() {
  const { t, lang } = useLanguage();

  const sections = [
    {
      id: "what-are",
      title: "What Are Cookies?",
      content: (
        <p>
          Cookies are small text files stored in your browser by the websites
          you visit. They are used to remember your session, save your
          preferences, and improve your experience.
        </p>
      ),
    },
    {
      id: "used",
      title: "Cookies We Use",
      content: (
        <>
          <p>
            RepoReef does <strong>not</strong> use tracking, analytics, or
            advertising cookies. Only essential browser storage is used:
          </p>
          <ul>
            <li>
              <strong>Essential storage:</strong> Required for session
              management and security. Cannot be disabled.
            </li>
            <li>
              <strong>Preference storage:</strong> Language, text size, project
              view, and search history — all stored locally in your browser.
            </li>
          </ul>
          <p>
            No data from these cookies or localStorage entries is ever sent to
            third parties.
          </p>
        </>
      ),
    },
    {
      id: "localstorage",
      title: "LocalStorage Usage",
      content: (
        <>
          <p>
            RepoReef uses your browser's <strong>localStorage</strong> for the
            following keys:
          </p>
          <ul>
            <li>
              <strong>token:</strong> JWT session token created when you log in.
              Valid for 7 days. Cleared on logout.
            </li>
            <li>
              <strong>reporeef:lang:</strong> Your interface language preference
              (<code>en</code> or <code>tr</code>).
            </li>
            <li>
              <strong>reporeef:scale:</strong> Your text-size preference (
              <code>sm</code>, <code>md</code>, <code>lg</code>).
            </li>
            <li>
              <strong>reporeef:sort:</strong> Your preferred sort order on the
              home page.
            </li>
            <li>
              <strong>reporeef:cookie-consent:</strong> Records that you have
              dismissed the cookie banner.
            </li>
            <li>
              <strong>projectView:</strong> Your preferred card layout (
              <code>normal</code> or <code>compact</code>).
            </li>
            <li>
              <strong>createProjectDraft:</strong> Draft of a project you are
              currently creating. Cleared when you publish or cancel.
            </li>
            <li>
              <strong>searchHistory:project</strong> and{" "}
              <strong>searchHistory:user:</strong> Your recent searches (last
              8).
            </li>
          </ul>
          <p>
            LocalStorage data is not sent to the server, only stored in your
            browser. You can clear it at any time from your browser settings.
          </p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "Third-Party Cookies",
      content: (
        <>
          <p>
            RepoReef does <strong>not</strong> set any third-party cookies in
            your browser. There is no Google Analytics, no Facebook Pixel, and
            no advertising network integration.
          </p>
          <p>
            Note: Our backend uses <strong>Sentry</strong> for error monitoring,
            but Sentry runs entirely server-side and does not place any cookie
            or tracking identifier in your browser.
          </p>
        </>
      ),
    },
    {
      id: "control",
      title: "How Do I Control Cookies?",
      content: (
        <>
          <p>
            You can delete or block cookies and localStorage data from your
            browser settings. However:
          </p>
          <ul>
            <li>If you block cookies completely, you cannot log in.</li>
            <li>If you clear localStorage, your session will be terminated.</li>
          </ul>
          <p>Settings for popular browsers:</p>
          <ul>
            <li>Chrome: Settings → Privacy and security → Cookies</li>
            <li>Firefox: Settings → Privacy & Security → Cookies</li>
            <li>Safari: Preferences → Privacy → Manage Cookies</li>
          </ul>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes",
      content: (
        <p>
          This cookie policy may be updated from time to time. The current
          version is always published on this page.
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
            <strong>Çerez Kullanımı:</strong> RepoReef yalnızca zorunlu
            (essential) çerezler ve localStorage kullanır. Takip, analitik veya
            reklam çerezi bulunmamaktadır.
          </p>
          <p>
            <strong>Hukuki Sebep:</strong> Zorunlu çerezler, sözleşmenin ifası
            ve meşru menfaat kapsamında (KVKK m.5/2-c ve m.5/2-f) işlenir.
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
      title={t("cookies.title")}
      updatedAt="October 14, 2026"
      sections={sections}
    />
  );
}
