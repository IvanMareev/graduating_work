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
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import createNewContainer from '@/app/services/firstLevelServices/createNewContainer';
import { CreateContainerParams } from '@/app/types/lvl1';
import BlockGroupList from '@/app/components/HTMLGenerator/BlockGroupList/BlockGroupList.tsx';
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
  groups: unknown
};

const isValidGroups = (data: any): data is Group[] =>
  Array.isArray(data) && data.every((group) => Array.isArray(group));

const BlocksWithIntersectionOptions: React.FC<BlockGroupsProps> = ({ wireframe, groups, level }) => {
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
    router.push(`/HtmlCssEditorPreview/${level}/0?BlockID=${res.id}`);
    setOpenModal(false);
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} sx={{ mb: 2 }}>
        <Tab label="Готовые комбинации" />
        <Tab label="Массив элементов второго уровня" />
      </Tabs>

      {tabIndex === 0 && (
        <>
          <BlockGroupList wireframe={wireframe} level={level} />
          <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Добавить вариант</DialogTitle>
            <DialogContent>
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

      {tabIndex === 1 && (
        <Box mt={4} p={2} border="1px dashed gray" textAlign="center">
          <BlockList blocks={groups}></BlockList>
        </Box>
      )}
    </Box>
  );
};

export default BlocksWithIntersectionOptions;
