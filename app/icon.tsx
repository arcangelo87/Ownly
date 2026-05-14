import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1C4A2A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            color: '#F7F2E9',
            fontSize: 22,
            fontWeight: 700,
            fontFamily: 'serif',
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          B
        </span>
      </div>
    ),
    size
  );
}
