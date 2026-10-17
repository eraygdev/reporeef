import Legal from "../../components/layout/Legal";
import { useLanguage } from "../../i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const sections = [
    {
      id: "mission",
      title: "Our Mission",
      content: (
        <>
          <p>
            RepoReef is a platform where developers can share their open source
            projects, discover others, and collaborate together. Our goal is to
            help ideas come to life quickly and connect with the right people.
          </p>
          <p>
            Publish your project, find contributors, build your team. All in one
            place.
          </p>
        </>
      ),
    },
    {
      id: "how-it-works",
      title: "How It Works",
      content: (
        <>
          <p>RepoReef consists of three simple steps:</p>
          <ul>
            <li>
              <strong>Discover:</strong> Filter by categories, search, and star
              the projects you like.
            </li>
            <li>
              <strong>Publish:</strong> Create your own project, add GitHub and
              demo links, build your team.
            </li>
            <li>
              <strong>Contribute:</strong> Join projects you're interested in,
              connect with developers.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "open-source",
      title: "Open Source",
      content: (
        <>
          <p>
            RepoReef is an <strong>open source project platform</strong>. The
            project itself is also developed as open source. We are always open
            to code, suggestions, and feedback.
          </p>
          <p>
            You can contribute via GitHub, report bugs, or suggest new features.
          </p>
        </>
      ),
    },
    {
      id: "privacy",
      title: "Privacy First",
      content: (
        <>
          <p>
            RepoReef takes a <strong>privacy-first</strong> approach to its
            design:
          </p>
          <ul>
            <li>
              Authentication is handled exclusively through GitHub OAuth — no
              passwords stored.
            </li>
            <li>
              JWT tokens contain no email address or username — only an internal
              user ID.
            </li>
            <li>
              Only essential cookies and localStorage are used. No tracking, no
              analytics, no ads.
            </li>
            <li>
              Cover images are hosted on GitHub — we do not upload or store user
              files.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      content: (
        <>
          <p>
            Reach out to us for questions, suggestions, or collaboration
            requests:
          </p>
          <ul>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/eraygdev"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/eraygdev
              </a>
            </li>
            <li>
              Email: <a href="mailto:hello@reporeef.com">hello@reporeef.com</a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <Legal
      title={t("about.title")}
      updatedAt="October 14, 2026"
      sections={sections}
    />
  );
}
