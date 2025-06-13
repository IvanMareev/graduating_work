"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Switch,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import styles from "./BlockList.module.css";
import createNewContainer from "@/app/services/firstLevelServices/createNewContainer";
import { CreateContainerParams } from "@/app/types/lvl1";
import getTemplateLvlTableServices from "@/app/services/firstLevelServices/getTemplateLvlTableServices";
import setAlwaysPresentMarkerServices from "@/app/services/firstLevelServices/setAlwaysPresentMarkerServices";

type Block = {
  id: number;
  name: string;
  level: number;
  html: string;
  css_style: string;
  lvl_id: number;
  always_eat: boolean;
  template_lvl1_id: number;
};

type GroupedBlocks = {
  [name: string]: Block[];
};

type BlockListProps = {
  blocks: GroupedBlocks;
  level: number;
};

const BlockList: React.FC<BlockListProps> = ({ blocks, level }) => {
  const router = useRouter();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newBlockContent, setNewBlockContent] = useState<CreateContainerParams | null>(null);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [previewBlock, setPreviewBlock] = useState<Block | null>(null);

  const handleOpenAddModal = (groupName: string) => {
    setSelectedGroup(groupName);
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewBlockContent(null);
  };

  const handleAddBlock = async () => {
    if (!newBlockContent) return;
    const updatedBlockContent = {
      ...newBlockContent,
      level: level,
    };
    const res = await createNewContainer(updatedBlockContent);
    router.push(`/HtmlCssEditorPreview/${level}/0?BlockID=${res.id}&templateId=${newBlockContent["template_lvl_id"] || 1}&name=${res.name}`);
    handleCloseAddModal();
  };

  useEffect(() => {
    if (openAddModal && level !== 1) {
      getTemplateLvlTableServices(level - 1).then((data) => {
        if (Array.isArray(data)) {
          setTemplateOptions(data);
        }
      });
    }
  }, [openAddModal, level]);

  const handleToggleAlwaysEat = (groupName: string) => {
    const groupBlocks = blocks[groupName];
    console.log('groupBlocks', groupBlocks);
    
    if (!groupBlocks || groupBlocks.length === 0) return;

    const newValue = !groupBlocks[0]?.always_eat;
    let setAlwaysPresent = setAlwaysPresentMarkerServices({'always_eat': newValue, 'id': groupBlocks[0]?.template_lvl1_id}, level)
    console.log('setAlwaysPresent', setAlwaysPresent);
    
    groupBlocks.forEach((block) => {
      block.always_eat = newValue;
    });

    setSelectedGroup(groupName + (newValue ? "1" : "0"));
  };

  const handleOpenPreviewModal = (block: Block) => {
    setPreviewBlock(block);
    setOpenPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setOpenPreviewModal(false);
    setPreviewBlock(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Button
        variant="contained"
        startIcon={<Plus size={18} />}
        sx={{ textTransform: "none" }}
        onClick={() => handleOpenAddModal("")}
      >
        Добавить контейнер
      </Button>

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 4,
          boxShadow: 15,
          p: 3,
          bgcolor: "#fafafa",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {Object.entries(blocks).map(([groupName, groupBlocks]) => (
          <Card
            key={groupName}
            variant="outlined"
            sx={{
              boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.7)",
              borderColor: "#ccc",
              borderTopWidth: groupName === Object.keys(blocks)[0] ? "1px" : 0,
              borderRadius: 0,
              "&:first-of-type": {
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderTopWidth: "1px",
              },
              "&:last-of-type": {
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderBottomWidth: "1px",
              },
            }}

          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6">{groupName}</Typography>
                  <Box
                    sx={{
                      backgroundColor: "#e0e0e0",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Вариантов: {groupBlocks.length}
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2">Обязательно в макете</Typography>
                  <Switch
                    checked={!!groupBlocks[0]?.always_eat}
                    onChange={() => handleToggleAlwaysEat(groupName)}
                    color="primary"
                  />
                  <Button
                    variant="contained"
                    onClick={() => setSelectedGroup(groupName)}
                    sx={{ textTransform: "none" }}
                  >
                    Посмотреть варианты
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>


      {/* Модальное окно: список вариантов верстки в группе */}
      <Dialog open={!!selectedGroup && !openAddModal} onClose={() => setSelectedGroup(null)} maxWidth="md" fullWidth>
        <DialogTitle>Варианты верстки для группы: {selectedGroup}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              sx={{ textTransform: "none" }}
              onClick={() => {
                router.push(
                  `/HtmlCssEditorPreview/${level}/0?BlockID=${blocks[selectedGroup || ""]?.[0]?.lvl_id || 0}&templateId=1`
                );
                setSelectedGroup(null);
              }}
            >
              Добавить вариант верстки контейнера
            </Button>

            {blocks[selectedGroup || ""]?.map((block) => (
              <Card
                key={block.id}
                variant="outlined"
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpenPreviewModal(block)}
              >
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}       // расстояние между элементами
                  >
                    <Typography variant="subtitle1">ID: {block.id}</Typography>
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/HtmlCssEditorPreview/${level}/${block.id}/?name=${block.name}`);
                      }}
                    >
                      Редактировать
                    </Button>

                    {/* Применяем стили блока */}
                    <style>{block?.css_style}</style>

                    {/* Предпросмотр блока */}
                    <Box
                      mt={1}
                      p={2}
                      width="300%"
                      maxWidth={500}
                      border="1px solid #ccc"
                      borderRadius={2}
                      dangerouslySetInnerHTML={{ __html: block?.html || "" }}
                      sx={{
                        overflowX: "auto",
                        backgroundColor: "#fafafa",
                        boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Box>
                </CardContent>

              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedGroup(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно предпросмотра блока */}
      {/* <Dialog open={openPreviewModal} onClose={handleClosePreviewModal} maxWidth="md" fullWidth>
        <DialogTitle>Предпросмотр блока ID: {previewBlock?.id}</DialogTitle>
        <DialogContent>
          <style>{previewBlock?.css_style}</style>
          <Box
            className={styles.preview}
            mt={2}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
            dangerouslySetInnerHTML={{ __html: previewBlock?.html || "" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreviewModal}>Закрыть</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (previewBlock) {
                router.push(`/HtmlCssEditorPreview/${level}/${previewBlock.id}/`);
              }
              handleClosePreviewModal();
            }}
          >
            Редактировать
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Модальное окно добавления контейнера */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить вариант</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название блока"
            onChange={(e) =>
              setNewBlockContent((prev) => ({
                ...prev,
                containerName: e.target.value,
              }))
            }
            margin="normal"
          />
          {level === 1 && (
            <TextField
              fullWidth
              label="Значение сортировки"
              onChange={(e) =>
                setNewBlockContent((prev) => ({
                  ...prev,
                  physicalLevel: e.target.value,
                }))
              }
              margin="normal"
            />
          )}
          {level !== 1 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Выберите с каким компонентом связать контейнер</InputLabel>
              <Select
                value={newBlockContent?.template_lvl_id || ""}
                label="Template"
                onChange={(e) =>
                  setNewBlockContent((prev) => ({
                    ...prev,
                    template_lvl_id: e.target.value,
                  }))
                }
              >
                {templateOptions.map((tpl) => (
                  <MenuItem key={tpl.id} value={tpl.id}>
                    {tpl.template_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Отмена</Button>
          <Button onClick={handleAddBlock} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlockList;
