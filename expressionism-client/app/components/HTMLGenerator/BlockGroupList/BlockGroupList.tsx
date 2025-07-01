'use client';

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Plus, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

type InsertionOption = {
  css_style: string;
  html: string;
  intersection_code: string;
  name: string;
  template_lvl1_id: number;
};

type Block = {
  id: number;
  name: string;
  level: number;
  html: string;
  css_style: string;
  always_eat: boolean;
  template_lvl1_id: number;
  insertion_options: InsertionOption[];
};

type Group = Block[];

type BlockGroupListProps = {
  wireframe: Group[];
  level: number;
};

const BlockGroupList: React.FC<BlockGroupListProps> = ({ wireframe, level }) => {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const title_url = searchParams.get("title") || "Без названия";

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {wireframe.map((group, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ChevronDown size={18} />}>
            <Typography variant="h6">Группа {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" gap={2}>
              {group.map((block) => (
                <Card key={block.id} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">
                      ID: {block.id} — {block.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Уровень: {block.level}, Always Eat: {block.always_eat ? '✔️' : '❌'}
                    </Typography>

                    <style>{block.css_style}</style>

                    <Box
                      mt={2}
                      p={2}
                      border="1px solid #ccc"
                      dangerouslySetInnerHTML={{ __html: block.html }}
                    />

                    {block.insertion_options.length > 0 && (
                      <Box mt={2} pl={2} borderLeft="2px solid #ddd">
                        <Typography variant="subtitle2">Вставки:</Typography>
                        {block.insertion_options.map((option, idx) => (
                          <Box key={idx} mt={1} p={1} border="1px dashed #aaa">
                            <Typography variant="body2">
                              Код вставки: {option.intersection_code}, Название: {option.name}
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ ml: 2 }}
                                onClick={() =>
                                  router.push(`/HtmlCssEditorPreview/${level}/${block.id}/?title=${title_url}`)
                                }
                              >
                                Редактировать вариант
                              </Button>
                            </Typography>
                            <style>{option.css_style}</style>
                            <Box mt={1} dangerouslySetInnerHTML={{ __html: option.html }} />
                          </Box>
                        ))}
                      </Box>
                    )}
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

export default BlockGroupList;
