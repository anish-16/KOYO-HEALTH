import { ImageResponse } from 'next/og';
import { allTests } from '@/data/services';
import { packages } from '@/data/packages';
import { packageFamilies } from '@/data/families';

export const runtime = 'edge';

export const alt = 'KOYO Health — diagnostic tests, scans and health packages across India';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #06191F 0%, #0C3B34 62%, #0F7A6C 100%)',
          color: '#FBFAF7',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: '2px solid #BF9B4F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: '#BF9B4F',
            }}
          >
            K
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 30, letterSpacing: 8, color: '#FBFAF7' }}>KOYO HEALTH</div>
            <div style={{ fontSize: 15, letterSpacing: 3, color: '#BF9B4F', fontFamily: 'sans-serif' }}>
              DIAGNOSTICS · IMAGING · PREVENTIVE CARE
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.04, maxWidth: 900 }}>
            Diagnostics that respect your time.
          </div>
          <div style={{ fontSize: 24, color: 'rgba(251,250,247,0.62)', fontFamily: 'sans-serif', maxWidth: 760 }}>
            {`${packageFamilies.length} package categories · ${allTests.length} individual tests · ${packages.length} health packages across 48 Indian cities.`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, fontFamily: 'sans-serif', fontSize: 18, color: 'rgba(251,250,247,0.55)' }}>
          <span>NABL partner labs</span>
          <span>NABH centres</span>
          <span>Reports in 12 hours</span>
          <span style={{ color: '#BF9B4F' }}>koyohealth.in</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
