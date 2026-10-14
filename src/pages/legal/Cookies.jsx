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
          <p>RepoReef uses the following cookies:</p>
          <ul>
            <li>
              <strong>Essential cookies:</strong> Required for session
              management and security. Cannot be disabled.
            </li>
            <li>
              <strong>Local storage:</strong> Your login token and form drafts
              are stored in your browser.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "localstorage",
      title: "LocalStorage Usage",
      content: (
        <>
          <p>
            In addition to cookies, RepoReef uses your browser's{" "}
            <strong>localStorage</strong> feature:
          </p>
          <ul>
            <li>
              <strong>token:</strong> The JWT token created when you log in.
              Valid for 7 days.
            </li>
            <li>
              <strong>createProjectDraft:</strong> The data you enter while
              creating a new project. Stays in your browser until you save.
            </li>
          </ul>
          <p>
            LocalStorage data is not sent to the server, only stored in your
            browser.
          </p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "Third-Party Cookies",
      content: (
        <p>
          RepoReef currently does not use third-party advertising or analytics
          cookies. If they are added in the future, this page will be updated.
        </p>
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
    // KVKK bölümü — sadece Türkçe seçiliyken
    ...(lang === "tr"
      ? [
          {
            id: "kvkk",
            title: "KVKK Aydınlatma Metni",
            content: (
              <>
                <p>
                  Bu bölüm, 6698 sayılı Kişisel Verilerin Korunması Kanunu
                  ("KVKK") kapsamında veri sorumlusu sıfatıyla yapılan
                  bilgilendirmedir.
                </p>
                <p>
                  <strong>Veri Sorumlusu:</strong> RepoReef —{" "}
                  <a href="mailto:hello@reporeef.com">hello@reporeef.com</a>
                </p>
                <p>
                  <strong>İşlenen Veriler:</strong> GitHub kullanıcı adı,
                  e-posta adresi, profil resmi URL'i, IP adresi (yalnızca audit
                  log), hesap oluşturma tarihi.
                </p>
                <p>
                  <strong>İşleme Amaçları:</strong> Hesap oluşturma ve yönetimi,
                  kimlik doğrulama, platform güvenliği, hizmet sunumu.
                </p>
                <p>
                  <strong>Hukuki Sebep:</strong> Açık rıza ve sözleşmenin ifası
                  (KVKK m.5/2-c).
                </p>
                <p>
                  <strong>Haklarınız:</strong> KVKK m.11 kapsamında;
                  verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme
                  ve itiraz etme haklarına sahipsiniz. Başvuru için:{" "}
                  <a href="mailto:hello@reporeef.com">hello@reporeef.com</a>
                </p>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <Legal
      title={t("cookies.title")}
      updatedAt="September 27, 2026"
      sections={sections}
    />
  );
}
