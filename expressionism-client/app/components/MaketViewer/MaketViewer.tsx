'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import saveGenerationResult from '@/app/services/firstLevelServices/saveGenerationResult';
import getSavedGenerationResult from '@/app/services/firstLevelServices/getSavedGenerationResult';
import readyMadeLayoutsServices from '@/app/services/firstLevelServices/readyMadeLayoutsServices';
import HorizontalBlockPreview from '../HorizontalBlockPreview/HorizontalBlockPreview';

interface Combo {
  combo_id: number;
  length?: number;
  css_style?: string;
  css?: string;
  html: string;
}

const waitForImages = (element: HTMLElement): Promise<void> =>
  Promise.all(
    Array.from(element.querySelectorAll('img')).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    })
  ).then(() => undefined);

export default function MaketViewer() {
  const [combinations, setCombinations] = useState<Combo[] | null>(null);
  const searchParams = useSearchParams();
  const selectedIndex = searchParams.get('index');
  const title = searchParams.get('title');
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('title', title);
        
        const data = await readyMadeLayoutsServices(title);
        console.log(data);
        
        setCombinations(data);
      } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };
  fetchData();
}, [title]);

const exportPDF = async (index: number) => {
  const element = refs.current[index];
  if (!element) return;

  await waitForImages(element);
  const canvas = await html2canvas(element, { scale: 3, useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pxToMm = 0.264583;
  const imgWidthMm = canvas.width * pxToMm;
  const imgHeightMm = canvas.height * pxToMm;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const scale = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm);
  const finalWidth = imgWidthMm * scale;
  const finalHeight = imgHeightMm * scale;
  const x = (pageWidth - finalWidth) / 2;
  const y = (pageHeight - finalHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
  pdf.save(`maket_${index + 1}.pdf`);
};

const exportAllToZip = async () => {
  if (!combinations) return;

  const zip = new JSZip();
  for (let i = 0; i < combinations.length; i++) {
    const element = refs.current[i];
    if (!element) continue;

    try {
      await waitForImages(element);
      const canvas = await html2canvas(element, { scale: 3 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pxToMm = 0.264583;
      const imgWidthMm = canvas.width * pxToMm;
      const imgHeightMm = canvas.height * pxToMm;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const scale = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm);
      const finalWidth = imgWidthMm * scale;
      const finalHeight = imgHeightMm * scale;
      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      const pdfBlob = pdf.output('blob');
      zip.file(`maket_${i + 1}.pdf`, pdfBlob);
    } catch (error) {
      console.error(`Ошибка при генерации PDF для блока ${i}:`, error);
    }
  }

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'all_makets.zip');
  } catch (error) {
    console.error('Ошибка при создании архива ZIP:', error);
  }
};

// if (!combinations) return <div style={{ padding: '32px' }}>Загрузка макетов...</div>;

const filtered = selectedIndex !== null ? [combinations[parseInt(selectedIndex, 10)]] : combinations;

return (
  <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f9f9f9' }}>
    <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#f9f9f9', paddingBottom: '16px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600 }}>Просмотр макетов</h1>
        <button
          onClick={() => router.push(`/htmlGenerator?title=${title}`)}
          style={{ backgroundColor: 'rgb(163, 152, 195)', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          Вернуться к генерации
        </button>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
        <button
          onClick={exportAllToZip}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Экспортировать все в ZIP
        </button>

        {!title && (
          <button
            onClick={() => GenerationResult(1)}
            style={{ backgroundColor: '#9333ea', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Сохранить результат генерации
          </button>
        )}
      </div>
    </div>
    <HorizontalBlockPreview blocks={combinations}></HorizontalBlockPreview>


  </div>
);
}
