'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import Editor from '@monaco-editor/react';
import styles from './style.module.css';
import { useParams } from 'next/navigation';
import getLayoutVariantServices from '@/app/services/firstLevelServices/getLayoutVariantServices';
import putLayoutVariantServices from '../../../services/firstLevelServices/putLayoutVariantServices';
import { useRouter } from 'next/navigation';
type HtmlCssEditorPreviewProps = {};

const HtmlCssEditorPreview: React.FC<HtmlCssEditorPreviewProps> = () => {
    const [layoutVariant, setLayoutVariant] = useState<any>(null);
    const params = useParams();
    const router = useRouter();


    useEffect(() => {
        const level = params?.level;
        const id = params?.id;
        console.log(level, id);
        if (level && id) {
            getLayoutVariantServices(id).then((data: any) => {
                setLayoutVariant(data);
                console.log(data);
            });
        }
    }, []);

    const handleCSSChange = (css: string) => {
        setLayoutVariant(prev => ({ ...prev, css_style: css }));
    };

    const handleHTMLChange = (new_html: string) => {
        setLayoutVariant(prev => ({ ...prev, html: new_html }));
    };

    const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLayoutVariant(prev => ({ ...prev, is_active: event.target.checked }));
    };

    const saveLayoutVariant = () => {
        router.push('/htmlGenerator');
        putLayoutVariantServices(layoutVariant)
    };


    return (
        <Box display="flex" flexDirection="column" gap={2} height="100%" p={2}>
            <div className={styles.buttonContainer}>
                <Button variant="text" onClick={() => router.push('/htmlGenerator')}>Не сохранять изменения</Button>
                <Button variant="contained" onClick={()=>saveLayoutVariant()}>Сохранять изменения</Button>
            </div>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!layoutVariant?.is_active}
                        onChange={handleActiveChange}
                        color="primary"
                    />
                }
                label="Активен"
            />

            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    minHeight: '200px',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Предпросмотр
                </Typography>
                <style>{layoutVariant?.css_style}</style>
                <div dangerouslySetInnerHTML={{ __html: layoutVariant?.html }} />
            </Paper>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} height="500px">
                <Paper
                    elevation={2}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    <Box px={2} py={1} borderBottom="1px solid #eee">
                        <Typography variant="subtitle1">HTML</Typography>
                    </Box>
                    <Editor
                        height="100%"
                        defaultLanguage="html"
                        value={layoutVariant?.html}
                        onChange={(value) => handleHTMLChange(value || '')}
                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                </Paper>

                <Paper
                    elevation={2}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    <Box px={2} py={1} borderBottom="1px solid #eee">
                        <Typography variant="subtitle1">CSS</Typography>
                    </Box>
                    <Editor
                        height="100%"
                        defaultLanguage="css"
                        value={layoutVariant?.css_style}
                        onChange={(value) => handleCSSChange(value || '')}
                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default HtmlCssEditorPreview;
