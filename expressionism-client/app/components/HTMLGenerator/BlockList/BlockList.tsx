'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import readyMadeCombinationsServices from '../../services/firstLevelServices/readyMadeCombinationsServices';
import prefixCSS from '../../utils/PrefixCSS';

type Block = {
  groupName: string;
  html: string;
  css: string;
  index: number;
  level?: number; // Добавим уровень, если нужно
};

// --- Shadow DOM wrapper для изоляции стилей и DOM ---
function ShadowRootWrapper({ html, css }: { html: string; css: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (ref.current && !shadowRootRef.current) {
      shadowRootRef.current = ref.current.attachShadow({ mode: 'open' });
    }

    if (shadowRootRef.current) {
      // Очистим содержимое перед рендером
      shadowRootRef.current.innerHTML = '';

      // Добавляем стили
      const style = document.createElement('style');
      style.textContent = css;
      shadowRootRef.current.appendChild(style);

      // Добавляем HTML
      const container = document.createElement('div');
      container.innerHTML = html;
      shadowRootRef.current.appendChild(container);
    }
  }, [html, css]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}

export default function MaketViewer() {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [sortedBlocks, setSortedBlocks] = useState<Block[] | null>(null);

  const searchParams = useSearchParams();
  const selectedIndex = searchParams.get('index');
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  // Загрузка блоков
  useEffect(() => {
    const fetchData = async () => {
      const blocksData = await readyMadeCombinationsServices(1, 3);

      // Преобразуем в массив с префиксом CSS и группой
      const allCombinations = Object.entries(blocksData).map(([groupName, groupBlocks], groupIndex) => {
        const prefix = `group-${groupIndex}`;

        // Можно передать level, если он есть в данных (пример)
        console.log('groupBlocks', groupBlocks);
        
        const level = groupBlocks?.[0]?.level ?? 0;

        return {
          groupName,
          html: `<div class="${prefix}">\n${groupBlocks.map((block) => block.html).join('\n')}\n</div>`,
          css: prefixCSS(groupBlocks.map((block) => block.css_style).join('\n'), prefix),
          index: groupIndex,
          level,
        };
      });

      setBlocks(allCombinations);
    };

    fetchData();
  }, []);
  console.log('preview sorted', 12);
  // Сортировка по уровню
  useEffect(() => {
    if (!blocks) return;

    const sorted = [...blocks].sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

    setSortedBlocks(sorted);
    console.log('preview sorted', sorted);

  }, [blocks]);

  // Запрет определённых сочетаний клавиш и контекстного меню (оставил без изменений)
  useEffect(() => {
    const disableShortcuts = (e: KeyboardEvent) => {
      const blockedKeys = [
        { ctrl: true, key: 'u' },
        { ctrl: true, shift: true, key: 'i' },
        { ctrl: true, shift: true, key: 'j' },
        { key: 'F12' },
        { key: 'PrintScreen' },
      ];

      if (
        blockedKeys.some(
          (k) => (k.ctrl ? e.ctrlKey : true) && (k.shift ? e.shiftKey : true) && e.key === k.key
        )
      ) {
        e.preventDefault();
        alert('Действие запрещено');
      }
    };

    const disableContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('keydown', disableShortcuts);
    window.addEventListener('contextmenu', disableContextMenu);

    return () => {
      window.removeEventListener('keydown', disableShortcuts);
      window.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  // Эффект блюра при PrintScreen
  useEffect(() => {
    const blurScreen = () => {
      document.body.style.filter = 'blur(5px)';
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 2000);
    };

    const listener = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        blurScreen();
      }
    };

    document.addEventListener('keyup', listener);
    return () => document.removeEventListener('keyup', listener);
  }, []);

  // Экспорт PDF одного блока
  const exportPDF = async (index: number) => {
    const element = refs.current[index];
    if (!element) return;

    await html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: `maket_${index + 1}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      })
      .save();
  };

  // Экспорт всех в ZIP
  const exportAllToZip = async () => {
    if (!sortedBlocks) return;

    const zip = new JSZip();

    for (let i = 0; i < sortedBlocks.length; i++) {
      const element = refs.current[i];
      if (!element) continue;

      try {
        const pdfDataUri = await html2pdf().from(element).outputPdf('datauristring');
        const base64Data = pdfDataUri.split(',')[1];
        const fileName = `maket_${i + 1}.pdf`;
        zip.file(fileName, base64Data, { base64: true });
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

  if (!sortedBlocks) return <div style={{ padding: '32px' }}>Загрузка макетов...</div>;

  const filteredBlocks =
    selectedIndex !== null ? [sortedBlocks[parseInt(selectedIndex, 10)]] : sortedBlocks;

  return (
    <div
      style={{
        padding: '32px',
        fontFamily: 'sans-serif',
        background: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 600 }}>Просмотр макетов</h1>
        <button
          onClick={() => router.push('/htmlGenerator')}
          style={{
            backgroundColor: 'rgb(163, 152, 195)',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid rgb(163, 152, 195)',
            cursor: 'pointer',
            color: 'black',
          }}
        >
          Вернуться к генерации
        </button>
      </div>

      <button
        onClick={exportAllToZip}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '30px',
        }}
      >
        Экспортировать все в ZIP
      </button>

      {filteredBlocks.map((block, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: '48px',
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',

            // Ограничение по ширине и авто-скролл по горизонтали если не помещается
            maxWidth: '100%',
            overflowX: 'auto',
          }}
        >
          <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>Макет: {block.groupName}</h2>

          <div
            ref={(el) => (refs.current[idx] = el)}
            style={{
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '12px',
              background: '#fff',
              // Ограничение и автоскролл по горизонтали
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            {/* Изоляция стилей и html через ShadowRoot */}
            <ShadowRootWrapper html={block.html} css={block.css} />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => exportPDF(idx)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Скачать PDF
            </button>

            <a
              href={`?index=${block.index}`}
              style={{ color: '#3b82f6', textDecoration: 'underline', alignSelf: 'center' }}
            >
              Открыть отдельно
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
