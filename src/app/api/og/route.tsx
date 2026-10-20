import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Launchly Studio';
    const badge = searchParams.get('badge') || 'CREATIVE PLATFORM · PRO ARCHITECTURE';
    const desc =
      searchParams.get('desc') ||
      'Curated aesthetic templates, real-time visual canvas, and instant production export.';
    const accent = searchParams.get('accent') || '#FF5588';
    const bg = searchParams.get('bg') || '#0A0B10';
    const subdomain = searchParams.get('subdomain');
    const isDark = !bg.startsWith('#FA') && !bg.startsWith('#FF') && !bg.startsWith('#FFF');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: bg,
            color: isDark ? '#FFFFFF' : '#111111',
            padding: '54px 64px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            border: `12px solid ${accent}`,
            position: 'relative',
          }}
        >
          {/* Background Decorative Pattern / Gradient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '420px',
              height: '420px',
              borderRadius: '9999px',
              backgroundColor: accent,
              opacity: isDark ? 0.2 : 0.12,
              filter: 'blur(80px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '420px',
              height: '420px',
              borderRadius: '9999px',
              backgroundColor: '#FFE600',
              opacity: isDark ? 0.18 : 0.12,
              filter: 'blur(80px)',
            }}
          />

          {/* Top Bar: Brand Watermark & Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 18px',
                borderRadius: '16px',
                border: '3px solid #000000',
                backgroundColor: '#FFE600',
                color: '#000000',
                fontWeight: 900,
                fontSize: '15px',
                letterSpacing: '1px',
                boxShadow: '4px 4px 0px #000000',
                textTransform: 'uppercase',
              }}
            >
              <span>★</span>
              <span>{badge}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '2px',
                color: isDark ? '#FFFFFF' : '#000000',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '14px',
                  height: '14px',
                  borderRadius: '9999px',
                  backgroundColor: accent,
                  border: '2px solid #000',
                }}
              />
              <span>LAUNCHLY // STUDIO</span>
            </div>
          </div>

          {/* Center Content: Title & Description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              maxWidth: '960px',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            {subdomain && (
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: accent,
                  letterSpacing: '1px',
                }}
              >
                https://{subdomain}.launchly.site
              </div>
            )}
            <h1
              style={{
                fontSize: title.length > 32 ? '54px' : '68px',
                fontWeight: 900,
                lineHeight: 1.06,
                letterSpacing: '-1.5px',
                color: isDark ? '#FFFFFF' : '#111111',
                margin: 0,
                textTransform: 'uppercase',
                textShadow: isDark ? '0 4px 20px rgba(0,0,0,0.6)' : 'none',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '22px',
                lineHeight: 1.4,
                color: isDark ? '#C0C0D0' : '#444444',
                margin: 0,
                maxWidth: '880px',
                fontWeight: 500,
              }}
            >
              {desc}
            </p>
          </div>

          {/* Bottom Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: isDark ? '2px solid rgba(255,255,255,0.15)' : '2px solid rgba(0,0,0,0.15)',
              paddingTop: '22px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '24px',
                fontSize: '16px',
                fontWeight: 800,
                color: isDark ? '#E5E5E5' : '#222222',
              }}
            >
              <span>⚡ Next.js 15 App Router</span>
              <span>•</span>
              <span>🎨 Neo-Brutalist Engine</span>
              <span>•</span>
              <span>🌍 1-Click Edge Deploy</span>
            </div>

            <div
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#1C1D2B' : '#E8E8E8',
                border: '2px solid #000',
                fontSize: '14px',
                fontWeight: 800,
                color: isDark ? '#FFFFFF' : '#000000',
              }}
            >
              launchly.site
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Generation Error:', e);
    return new Response(`Failed to generate OG image: ${e.message}`, {
      status: 500,
    });
  }
}
