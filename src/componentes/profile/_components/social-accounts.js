import Link from "next/link";
import {
  DribbleIcon,
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
  XIcon,
} from "../_components/icons";

const ACCOUNTS = [
  { platform: "Facebook", url: "#", Icon: FacebookIcon },
  { platform: "X",        url: "#", Icon: XIcon },
  { platform: "LinkedIn", url: "#", Icon: LinkedInIcon },
  { platform: "Dribble",  url: "#", Icon: DribbleIcon },
  { platform: "GitHub",   url: "#", Icon: GitHubIcon },
];

export function SocialAccounts() {
  return (
    <div className="mt-4">
      <h4 className="mb-3 fw-semibold text-dark">
        Sígueme en
      </h4>

      <div className="d-flex align-items-center justify-content-center gap-3">
        {ACCOUNTS.map(({ Icon, ...item }) => (
          <Link
            key={item.platform}
            href={item.url}
            className="link-dark"
          >
            {/* equivalente a sr-only en Bootstrap */}
            <span className="visually-hidden">
              Ver cuenta de {item.platform}
            </span>

            <Icon />
          </Link>
        ))}
      </div>
    </div>
  );
}
