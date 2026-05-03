import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ui-avatars.com", "images.unsplash.com", "avatars.githubusercontent.com"],
  },
  // experimental: { https: true }, // Desativado para produção
};

export default withNextIntl(nextConfig);
