'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import readyMadeCombinationsServices from '../services/firstLevelServices/readyMadeCombinationsServices';

type Block = {
    groupName: string;
    html: string;
    css: string;
    index: number;
};

export default function MaketViewer() {
    const [blocks, setBlocks] = useState<Block[] | null>(null);
    const searchParams = useSearchParams();
    const selectedIndex = searchParams.get('index');
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const blocks = await readyMadeCombinationsServices(1, 3);
            const allCombinations = Object.entries(blocks).map(([groupName, groupBlocks], groupIndex) => ({
                groupName,
                html: groupBlocks.map(block => block.html).join('\n'),
                css: groupBlocks.map(block => block.css_style).join('\n'),
                index: groupIndex,
            }));
            setBlocks(allCombinations);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const disableShortcuts = (e: KeyboardEvent) => {
            const blockedKeys = [
                { ctrl: true, key: 'u' },
                { ctrl: true, shift: true, key: 'i' },
                { ctrl: true, shift: true, key: 'j' },
                { key: 'F12' },
                { key: 'PrintScreen' },
            ];

            if (blockedKeys.some(k =>
                (k.ctrl ? e.ctrlKey : true) &&
                (k.shift ? e.shiftKey : true) &&
                e.key === k.key
            )) {
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

    const exportPDF = async (index: number) => {
        const element = refs.current[index];
        if (!element) return;

        await html2pdf().from(element).set({
            margin: 0,
            filename: `maket_${index + 1}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        }).save();
    };

    const exportAllToZip = async () => {
        if (!blocks) return;

        const zip = new JSZip();

        for (let i = 0; i < blocks.length; i++) {
            const element = refs.current[i];
            if (!element) continue;

            try {
                const pdfDataUri = await html2pdf().from(element).outputPdf('datauristring');
                const base64Data = pdfDataUri.split(',')[1]; // Убираем 'data:application/pdf;base64,'
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


    if (!blocks) return <div style={{ padding: '32px' }}>Загрузка макетов...</div>;

    const filteredBlocks = selectedIndex !== null
        ? [blocks[parseInt(selectedIndex, 10)]]
        : blocks;

    return (
        <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 600 }}>Просмотр макетов</h1>
                <button
                    onClick={() => router.push('/htmlGenerator')}
                    style={{
                        backgroundColor: 'rgb(163, 152, 195)',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid rgb(163, 152, 195)',
                        cursor: 'pointer',
                        color: 'black'
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
                        }}
                    >
                        <style>{block.css}</style>
                        <div dangerouslySetInnerHTML={{ __html: block.html }} />
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
