import { ImageResponse } from 'next/og';

export const alt = 'Launchly Live Site Preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const siteName = (subdomain || 'Launchly Site')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          backgroundColor: '#0F0F14',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          border: '12px solid #FF5588',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: '3px solid #000',
              backgroundColor: '#FFD600',
              color: '#000000',
              fontSize: '18px',
              fontWeight: '900',
              textTransform: 'uppercase',
            }}
          >
            LIVE SUBDOMAIN // {subdomain}.launchly.site
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#7BD7C1',
              letterSpacing: '2px',
            }}
          >
            LAUNCHLY STUDIO
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              lineHeight: '1.1',
              color: '#FFFFFF',
              margin: '0',
            }}
          >
            {siteName}
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#A0A0B0',
              margin: '0',
              maxWidth: '850px',
            }}
          >
            Designed, customized, and published live with zero-code edge hosting on Launchly.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(255,255,255,0.15)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px', fontSize: '18px', color: '#FFFFFF' }}>
            <span>✓ Next.js 15 App Router</span>
            <span>✓ Edge Subdomain</span>
            <span>✓ Neo-Brutalist Engine</span>
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: '2px solid #000',
              backgroundColor: '#F472B6',
              color: '#000',
              fontWeight: '900',
              fontSize: '16px',
            }}
          >
            Launchly.site
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
