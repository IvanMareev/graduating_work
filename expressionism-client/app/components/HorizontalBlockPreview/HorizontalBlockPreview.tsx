import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';

type Block = {
    id: number;
    title: string;
    html: string;
    css_style: string;
    is_active: boolean;
    created_at: string;
};

const VerticalBlockPreview = ({ blocks }: { blocks: Block[] }) => {
    const [activeBlocks, setActiveBlocks] = useState<Block[]>([]);

    useEffect(() => {
    if (Array.isArray(blocks)) {
        const filtered = blocks.filter(block => block.is_active);
        setActiveBlocks(filtered);
    } else {
        setActiveBlocks([]);
    }
}, [blocks]);


    useEffect(() => {
        const styleElements: HTMLStyleElement[] = [];

        activeBlocks.forEach(({ css_style }) => {
            const style = document.createElement('style');
            style.textContent = css_style;
            document.head.appendChild(style);
            styleElements.push(style);
        });

        return () => {
            styleElements.forEach(el => document.head.removeChild(el));
        };
    }, [activeBlocks]);

    if (activeBlocks.length === 0) {
        return (
            <Typography variant="body2" sx={{ px: 2 }}>
                Нет активных блоков для отображения
            </Typography>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                width: '100%',
                overflowX: 'auto',
                boxShadow: '0px 4px 14px rgba(0,0,0,0.05)',
            }}
        >
            <Typography variant="h6" fontWeight="bold" mb={3}>
                Всего макетов: {activeBlocks.length}
            </Typography>

            <Stack direction="column" spacing={5}>
                {activeBlocks.map((block) => (
                    <Box
                        key={block.id}
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                            p: 2,
                        }}
                    >

                        <Box
                            sx={{
                                p: 2,
                                border: '1px dashed #999',
                                borderRadius: 2,
                                backgroundColor: '#fefefe',
                                boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)',
                            }}
                        >
                            <style>{block.css_style}</style>
                            <div dangerouslySetInnerHTML={{ __html: block.html }} />
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default VerticalBlockPreview;
