'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import Editor from '@monaco-editor/react';
import styles from './style.module.css';
import { useParams, useRouter } from 'next/navigation';
import getLayoutVariantServices from '@/app/services/firstLevelServices/getLayoutVariantServices';
import putLayoutVariantServices from '@/app/services/firstLevelServices/putLayoutVariantServices';
import createLayoutVariantServices from "@/app/services/firstLevelServices/createLayoutVariantServices";
import { useSearchParams } from 'next/navigation';


const HtmlCssEditorPreview: React.FC = () => {
    const [layoutVariant, setLayoutVariant] = useState<any>(null);
    const [level, setLevel] = useState<number | null>(null);
    const [id, setId] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();


    useEffect(() => {
        const levelParam = Number(params?.level);
        const idParam = params?.id?.toString();

        if (!isNaN(levelParam)) setLevel(levelParam);
        if (idParam) setId(idParam);

        if (levelParam && idParam && parseInt(idParam) !== 0) {
            getLayoutVariantServices(idParam, levelParam).then((data: any) => {
                setLayoutVariant(data);
            });
        }
    }, [params]);

    const handleCSSChange = (css: string) => {
        setLayoutVariant(prev => ({ ...prev, css_style: css }));
    };

    const handleHTMLChange = (html: string) => {
        setLayoutVariant(prev => ({ ...prev, html }));
    };

    const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLayoutVariant(prev => ({ ...prev, is_active: event.target.checked }));
    };

    const saveLayoutVariant = async () => {
        if (!layoutVariant || !level) {
            console.error('Нет данных для сохранения');
            return;
        }
        if (parseInt(id || '', 10) === 0) {
            const BlockID = searchParams.get('BlockID');

            if (!BlockID) {
                console.error('BlockID отсутствует в query-параметрах');
                return;
            }

            const newVariant = {
                ...layoutVariant,
                'template_lvl1_id': 13
            };
            console.log('dsf',newVariant);
            
            await createLayoutVariantServices(newVariant, level);
        } else {
            await putLayoutVariantServices(layoutVariant, level);
        }


        router.push('/htmlGenerator');
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} height="100%" p={2}>
            {parseInt(id || '', 10) === 0 && (
                <h1>Вы создаете вариант верстки для {level}</h1>
            )}
            <div className={styles.buttonContainer}>
                <Button variant="text" onClick={() => router.push('/htmlGenerator')}>
                    Не сохранять изменения
                </Button>
                <Button variant="contained" onClick={saveLayoutVariant}>
                    Сохранять изменения
                </Button>
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
