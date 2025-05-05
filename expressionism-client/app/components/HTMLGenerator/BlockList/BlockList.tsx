import React from 'react';
import styles from './BlockList.module.css';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  Box,
  Button
} from '@mui/material';

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
  [name: string]: Block[];
};

type BlockListProps = {
  blocks: GroupedBlocks;
};

const BlockList: React.FC<BlockListProps> = ({ blocks }) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {Object.entries(blocks).map(([groupName, groupBlocks]) => (
        <Accordion key={groupName} >
          <AccordionSummary expandIcon={<h6>#</h6>}>
            <Typography variant="h6">{groupName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" gap={2}>
              {groupBlocks.map((block) => (
                <Card key={block.id} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">ID: {block.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Уровень: {block.level}, Always Eat: {block.always_eat ? '✔️' : '❌'}
                      <Button variant="outlined">Редактировать вариант</Button>
                    </Typography>
                    


                    {/* Вставка CSS */}
                    <style>{block.css_style}</style>

                    {/* HTML превью */}
                    <Box
                      className={styles.preview}
                      mt={2}
                      p={2}
                      border="1px solid #ccc"
                      dangerouslySetInnerHTML={{ __html: block.html }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BlockList;
