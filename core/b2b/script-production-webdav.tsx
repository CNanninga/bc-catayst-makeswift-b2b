'use client';

import Script from 'next/script';

import { useB2BAuth } from './use-b2b-auth';
import { useB2BCart } from './use-b2b-cart';

interface Props {
  storeHash: string;
  channelId: string;
  token?: string;
  cartId?: string | null;
  assetsVersion?: string;
}

export function ScriptProductionWebdav({ 
  cartId, 
  storeHash, 
  channelId, 
  token,
  assetsVersion
}: Props) {
  useB2BAuth(token);
  useB2BCart(cartId);

  const B2B_LOADER_SUBDIR = (assetsVersion) ? `b2b-${assetsVersion}` : 'b2b';
  const B2B_LOADER_URL = `https://store-${storeHash}.mybigcommerce.com/content/${B2B_LOADER_SUBDIR}`;

  return (
    <>
      <Script>
        {`
        window.b3CheckoutConfig = {
          routes: {
            dashboard: '/#/dashboard',
          },
        }
        window.B3 = {
          setting: {
            store_hash: '${storeHash}',  
            channel_id: ${channelId},
          },
        }
        `}
      </Script>
      <Script
        type="module"
        crossOrigin=""
        src={`${B2B_LOADER_URL}/index.js`}
      ></Script>
      <Script
        noModule
        crossOrigin=""
        src={`${B2B_LOADER_URL}/polyfills-legacy.js`}
      ></Script>
      <Script
        noModule
        crossOrigin=""
        src={`${B2B_LOADER_URL}/index-legacy.js`}
      ></Script>
    </>
  );
}
