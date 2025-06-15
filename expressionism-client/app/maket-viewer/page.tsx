// app/maket-viewer/page.tsx
'use client';

import dynamic from 'next/dynamic';

const MaketViewer = dynamic(() => import('../components/MaketViewer/MaketViewer'), { ssr: false });

export default function Page() {
  return <MaketViewer />;
}
