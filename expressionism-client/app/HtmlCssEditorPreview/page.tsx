"use client";

import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import Editor from '@monaco-editor/react';
import styles from './style.module.css'

type HtmlCssEditorPreviewProps = {
  initialHtml?: string;
  initialCss?: string;
};

const HtmlCssEditorPreview: React.FC<HtmlCssEditorPreviewProps> = ({
  initialHtml = `<div class="box">Пример блока</div>`,
  initialCss = `.box { color: blue; font-weight: bold; padding: 10px; border: 1px solid #ccc; }`,
}) => {
  const [htmlCode, setHtmlCode] = useState<string>(initialHtml);
  const [cssCode, setCssCode] = useState<string>(initialCss);

  return (
    <Box display="flex" flexDirection="column" gap={2} height="100%" p={2}>

        {/* Кнопки */}
        <div className={styles.buttonContainer}>
            <Button variant="text">Не сохранять изменения</Button>
            <Button variant="contained">Сохранять изменения</Button>
        </div>

        {/* Предпросмотр */}
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
            <style>{cssCode}</style>
            <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
        </Paper>

        {/* Редакторы */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} height="500px">
            {/* HTML редактор */}
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
                value={htmlCode}
                onChange={(value) => setHtmlCode(value || '')}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
            </Paper>

            {/* CSS редактор */}
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
                value={cssCode}
                onChange={(value) => setCssCode(value || '')}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
            </Paper>
        </Box>
        </Box>
  );
};

export default HtmlCssEditorPreview;
