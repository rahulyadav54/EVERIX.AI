import type { AppLoadContext } from '@remix-run/node';

type CloudflareContext = AppLoadContext & {
  cloudflare?: {
    env: Env;
  };
};

/** Cloudflare Pages (local proxy) or Vercel / Node (`process.env`). */
export function getServerEnv(context: AppLoadContext): Env {
  const fromCloudflare = (context as CloudflareContext).cloudflare?.env;

  if (fromCloudflare) {
    return fromCloudflare;
  }

  return process.env as Env;
}
