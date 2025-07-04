'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import createNewContainer from '@/app/services/firstLevelServices/createNewContainer';
import { CreateContainerParams } from '@/app/types/lvl1';
import BlockGroupList from '@/app/components/HTMLGenerator/BlockGroupList/BlockGroupList';
import BlockList from '../BlockList/BlockList';

type Block = {
  id: number;
  name: string;
  level: number;
  html: string;
  css_style: string;
  always_eat: boolean;
  template_lvl1_id: number;
  insertion_options: any[];
};

type Group = Block[];

type BlockGroupsProps = {
  wireframe: unknown;
  level: number;
  groups: unknown;
  ReqAgainBlock: any;
};

const isValidGroups = (data: any): data is Group[] =>
  Array.isArray(data) && data.every((group) => Array.isArray(group));

const BlocksWithIntersectionOptions: React.FC<BlockGroupsProps> = ({ wireframe, groups, level, ReqAgainBlock }) => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newBlockContent, setnewBlockContent] = useState<CreateContainerParams | null>(null);

  if (!isValidGroups(wireframe)) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const handleAddBlock = async () => {
    const updatedBlockContent = { ...newBlockContent, level };
    setnewBlockContent(updatedBlockContent);
    const res = await createNewContainer(updatedBlockContent);
    const searchParams = new URLSearchParams(window.location.search);
    const title_url = searchParams.get("title") || "Без названия";
    router.push(`/HtmlCssEditorPreview/${level}/0?BlockID=${res?.id ? String(res.id) : 0}&title=${title_url}`);
    setOpenModal(false);
  };

  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Массив элементов второго уровня" />
        <Tab label="Готовые комбинации" />

      </Tabs>

      {tabIndex === 1 && (
        <>
          <Box sx={{ overflow: 'visible' }}>
            <BlockGroupList wireframe={wireframe} level={level} />
          </Box>

          <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
            <DialogTitle>Добавить вариант</DialogTitle>
            <DialogContent sx={{ overflow: 'visible' }}>
              <TextField
                fullWidth
                label="Название блока"
                onChange={(e) =>
                  setnewBlockContent((prev) => ({
                    ...prev,
                    containerName: e.target.value,
                  }))
                }
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Отмена</Button>
              <Button onClick={handleAddBlock} variant="contained">
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {tabIndex === 0 && (
        <Box
          mt={4}
          p={2}
          border="1px dashed gray"
          textAlign="center"
          sx={{ overflow: 'visible' }}
        >
          <BlockList blocks={groups} level={level} ReqAgainBlock={() => ReqAgainBlock()} />
        </Box>
      )}
    </Box>
  );
};

export default BlocksWithIntersectionOptions;
