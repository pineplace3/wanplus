import Link from "next/link";

const footerLinks = {
  dogRuns: [
    { href: "/dog-runs", label: "ドッグラン一覧" },
  ],
  cafes: [
    { href: "/cafes", label: "カフェ一覧" },
  ],
  clinics: [
    { href: "/clinics", label: "動物病院一覧" },
  ],
  stays: [
    { href: "/stays", label: "宿泊施設一覧" },
  ],
};

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.379.06 3.808 0 2.43-.013 2.784-.06 3.808-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.379.06-3.808.06-2.43 0-2.784-.013-3.808-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808 0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.63 1.802c-2.43 0-2.784.013-3.808.048-1.054.048-1.629.228-2.01.38a3.3 3.3 0 00-1.193.748 3.3 3.3 0 00-.748 1.193c-.152.38-.332.956-.38 2.01-.035 1.024-.048 1.379-.048 3.808 0 2.43.013 2.784.048 3.808.048 1.054.228 1.629.38 2.01.175.432.416.785.748 1.193a3.3 3.3 0 001.193.748c.38.152.956.332 2.01.38 1.024.035 1.379.048 3.808.048 2.43 0 2.784-.013 3.808-.048 1.054-.048 1.629-.228 2.01-.38a3.3 3.3 0 001.193-.748 3.3 3.3 0 00.748-1.193c.152-.38.332-.956.38-2.01.035-1.024.048-1.379.048-3.808 0-2.43-.013-2.784-.048-3.808-.048-1.054-.228-1.629-.38-2.01a3.3 3.3 0 00-.748-1.193 3.3 3.3 0 00-1.193-.748c-.38-.152-.956-.332-2.01-.38-1.024-.035-1.379-.048-3.808-.048zm0 4.51a6.49 6.49 0 100 12.98 6.49 6.49 0 000-12.98zm0 10.696a4.206 4.206 0 110-8.412 4.206 4.206 0 010 8.412zm6.715-10.405a1.517 1.517 0 11-3.034 0 1.517 1.517 0 013.034 0z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#4A5844] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ドッグラン</h3>
            <ul className="space-y-2">
              {footerLinks.dogRuns.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:opacity-70 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">カフェ</h3>
            <ul className="space-y-2">
              {footerLinks.cafes.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:opacity-70 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">動物病院</h3>
            <ul className="space-y-2">
              {footerLinks.clinics.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:opacity-70 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">宿泊施設</h3>
            <ul className="space-y-2">
              {footerLinks.stays.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:opacity-70 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/80">© 2024 WanPlus. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition"
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
