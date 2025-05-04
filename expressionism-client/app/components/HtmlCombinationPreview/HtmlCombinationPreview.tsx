import React from 'react';
import { Typography, Box } from '@mui/material';

type Block = {
  id: number;
  name: string;
  level: number;
  html: string;
  css_style: string;
  always_eat: boolean;
  template_lvl1_id: number;
};

type GroupedBlocks = {
  [key: string]: Block[];
};

type HtmlCombinationPreviewProps = {
  blocks: GroupedBlocks;
};

const HtmlCombinationPreview: React.FC<HtmlCombinationPreviewProps> = ({ blocks }) => {
  if (!blocks || Object.keys(blocks).length === 0) {
    return <Typography>Нет комбинаций для отображения</Typography>;
  }

  const globalStyle = `
    .combo-block {
      border: 2px dashed #aaa;
      padding: 20px;
      margin: 40px 0;
      background: #fff;
    }
    body {
      font-family: Arial, sans-serif;
      background: #fafafa;
    }
    h2 {
      margin-bottom: 20px;
    }
  `;

  return (
    <Box>
      <style>{globalStyle}</style>
      <Typography variant="h5" gutterBottom>
        Все комбинации Wireframe
      </Typography>

      {Object.entries(blocks).map(([groupName, groupBlocks], groupIndex) => {
        const combinedHTML = groupBlocks.map(block => block.html).join('\n');
        const combinedCSS = groupBlocks.map(block => block.css_style).join('\n');
        const length = groupBlocks.length;

        return (
          <Box className="combo-block" key={groupName}>
            <Typography variant="h6" gutterBottom>
              Комбинация #{groupIndex + 1} (длина {length}) - {groupName}
            </Typography>

            {/* Вставка общего CSS для этой комбинации */}
            <style>{combinedCSS}</style>

            {/* HTML блоков */}
            <div dangerouslySetInnerHTML={{ __html: combinedHTML }} />
          </Box>
        );
      })}
    </Box>
  );
};

export default HtmlCombinationPreview;
