import { z } from 'zod';

import { auth } from '~/auth';

import { ScriptDev } from './script-dev';
import { ScriptProduction } from './script-production';
import { ScriptProductionWebdav } from './script-production-webdav';

const EnvironmentSchema = z.object({
  BIGCOMMERCE_STORE_HASH: z.string({ message: 'BIGCOMMERCE_STORE_HASH is required' }),
  BIGCOMMERCE_CHANNEL_ID: z.string({ message: 'BIGCOMMERCE_CHANNEL_ID is required' }),
  LOCAL_BUYER_PORTAL_HOST: z.string().url().optional(),
  STAGING_B2B_CDN_ORIGIN: z.string().optional(),
  BUYER_PORTAL_WEBDAV: z.string().optional(),
  BUYER_PORTAL_ASSETS_VERSION: z.string().optional(),
});

export async function B2BLoader() {
  const {
    BIGCOMMERCE_STORE_HASH,
    BIGCOMMERCE_CHANNEL_ID,
    LOCAL_BUYER_PORTAL_HOST,
    STAGING_B2B_CDN_ORIGIN,
    BUYER_PORTAL_WEBDAV,
    BUYER_PORTAL_ASSETS_VERSION
  } = EnvironmentSchema.parse(process.env);

  const session = await auth();

  if (LOCAL_BUYER_PORTAL_HOST) {
    return (
      <ScriptDev
        cartId={session?.user?.cartId ?? undefined}
        channelId={BIGCOMMERCE_CHANNEL_ID}
        hostname={LOCAL_BUYER_PORTAL_HOST}
        storeHash={BIGCOMMERCE_STORE_HASH}
        token={session?.b2bToken}
      />
    );
  }

  if (BUYER_PORTAL_WEBDAV === 'true') {
    return (
      <ScriptProductionWebdav
        cartId={session?.user?.cartId}
        channelId={BIGCOMMERCE_CHANNEL_ID}
        storeHash={BIGCOMMERCE_STORE_HASH}
        token={session?.b2bToken}
        assetsVersion={BUYER_PORTAL_ASSETS_VERSION}
      />
    );
  }

  const environment = STAGING_B2B_CDN_ORIGIN === 'true' ? 'staging' : 'production';

  return (
    <ScriptProduction
      cartId={session?.user?.cartId}
      channelId={BIGCOMMERCE_CHANNEL_ID}
      environment={environment}
      storeHash={BIGCOMMERCE_STORE_HASH}
      token={session?.b2bToken}
    />
  );
}
