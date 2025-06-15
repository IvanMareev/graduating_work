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
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
  Accordion
} from "@mui/material";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import createNewContainer from "@/app/services/firstLevelServices/createNewContainer";
import { CreateContainerParams } from "@/app/types/lvl1";
import getTemplateLvlTableServices from "@/app/services/firstLevelServices/getTemplateLvlTableServices";
import setAlwaysPresentMarkerServices from "@/app/services/firstLevelServices/setAlwaysPresentMarkerServices";
import setActiveStatusForAllLauoutVariantServices from "@/app/services/firstLevelServices/setActiveStatusForAllLauoutVariantServices";

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
  ReqAgainBlock: any;
};

const BlockList: React.FC<BlockListProps> = ({ blocks, level, ReqAgainBlock }) => {
  const router = useRouter();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newBlockContent, setNewBlockContent] = useState<CreateContainerParams | null>(null);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [previewBlock, setPreviewBlock] = useState<Block | null>(null);
  const [sortedblocks, setSortedblocks] = useState<[string, Block[]][]>({});

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
    const groupBlocks = sortedblocks[groupName];
    console.log('groupBlocks', groupBlocks);

    if (!groupBlocks || groupBlocks.length === 0) return;

    const newValue = !groupBlocks[0]?.always_eat;
    let setAlwaysPresent = setAlwaysPresentMarkerServices({ 'always_eat': newValue, 'id': groupBlocks[0]?.template_lvl1_id }, level)
    console.log('setAlwaysPresent', setAlwaysPresent);

    ReqAgainBlock()

    groupBlocks.forEach((sortedblocks) => {
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

  const handleActiveStatus = async (template_lvl1_id: number, is_active: boolean) => {
    let res = await setActiveStatusForAllLauoutVariantServices({
      'template_lvl_id': template_lvl1_id,
      'is_active': is_active
    },
      level)

    console.log('handleActiveStatus', res);

    ReqAgainBlock()
  }


  useEffect(() => {
    const entriesArray = Object.entries(blocks);

    const sorted = entriesArray.sort(([, a], [, b]) => {
      const aLevel = a?.[0]?.level ?? 0;
      const bLevel = b?.[0]?.level ?? 0;
      return aLevel - bLevel;
    });

    setSortedblocks(Object.fromEntries(sorted));
  }, [blocks]);

  console.log('sortedblocks', sortedblocks);

  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 14,
        height: 14,
      },
      '&::before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&::after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));


  const activeGroups = Object.entries(sortedblocks).filter(
    ([_, groupBlocks]) => groupBlocks.some(b => b.is_active)
  );

  const inactiveGroups = Object.entries(sortedblocks).filter(
    ([_, groupBlocks]) => groupBlocks.every(b => !b.is_active)
  );

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



        {/* Активные группы */}
        {activeGroups.map(([groupName, groupBlocks]) => (
          <Card
            key={groupName}
            variant="outlined"
            sx={{
              boxShadow:
                "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.7)",
              borderColor: "#ccc",
              borderTopWidth: groupName === activeGroups[0][0] ? "1px" : 0,
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
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
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

                <Box
                  position="relative"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{
                      backgroundColor: "rgba(176, 173, 224, 0.83)",
                      px: 1.5,
                      py: 0.5,
                      color: "black",
                      fontWeight: 500,
                      borderRadius: "10px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Android12Switch
                          checked={!!groupBlocks[0]?.always_eat}
                          onChange={() => handleToggleAlwaysEat(groupName)}
                        />
                      }
                      label="Обязательно в макете"
                    />
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => setSelectedGroup(groupName)}
                    sx={{ textTransform: "none", mr: 14 }}
                  >
                    Посмотреть варианты
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleActiveStatus(groupBlocks[0]?.template_lvl1_id, false)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      fontSize: "0.7rem",
                      padding: "2px 6px",
                      ml: 2,
                      minHeight: "22px",
                      textTransform: "none",
                      color: "white",
                      backgroundColor: "red",
                      "&:hover": {
                        backgroundColor: "#c62828",
                      },
                    }}
                  >
                    Убрать блок
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Неактивные группы — отдельный список */}
        {inactiveGroups.length > 0 && (
          <>
            <Typography variant="h6" mt={4} mb={2}>
              Не активные группы
            </Typography>
            {inactiveGroups.map(([groupName, groupBlocks]) => (
              <Card
                key={groupName}
                variant="outlined"
                sx={{
                  boxShadow:
                    "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.7)",
                  borderColor: "#ccc",
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
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                  >
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

                    <Box
                      position="relative"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                          backgroundColor: "rgba(176, 173, 224, 0.83)",
                          px: 1.5,
                          py: 0.5,
                          color: "black",
                          fontWeight: 500,
                          borderRadius: "10px",
                          fontSize: "0.875rem",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Android12Switch
                              checked={!!groupBlocks[0]?.always_eat}
                              onChange={() => handleToggleAlwaysEat(groupName)}
                            />
                          }
                          label="Обязательно в макете"
                        />
                      </Box>

                      <Button
                        variant="contained"
                        onClick={() => setSelectedGroup(groupName)}
                        sx={{ textTransform: "none", mr: 14 }}
                      >
                        Посмотреть варианты
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleActiveStatus(groupBlocks[0]?.template_lvl1_id, true)}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          fontSize: "0.7rem",
                          padding: "2px 6px",
                          ml: 2,
                          minHeight: "22px",
                          textTransform: "none",
                          color: "white",
                          backgroundColor: "green",
                          "&:hover": {
                            backgroundColor: "#2e7d32",
                          },
                        }}
                      >
                        Вернуть блок
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Box>


      {/* Модальное окно: список вариантов верстки в группе */}
      <Dialog
        open={!!selectedGroup && !openAddModal}
        onClose={() => setSelectedGroup(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Варианты верстки для группы: {selectedGroup}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              sx={{ textTransform: "none" }}
              onClick={() => {
                router.push(
                  `/HtmlCssEditorPreview/${level}/0?BlockID=${sortedblocks[selectedGroup || ""]?.[0]?.lvl_id || 0
                  }&templateId=1`
                );
                setSelectedGroup(null);
              }}
            >
              Добавить вариант верстки контейнера
            </Button>

            {/* Активные блоки */}
            {sortedblocks[selectedGroup || ""]?.filter((b) => b.is_active).map((block) => (
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
                    alignItems="center"
                    gap={2}
                  >
                    <Typography variant="subtitle1">ID: {block.id}</Typography>
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/HtmlCssEditorPreview/${level}/${block.id}/?name=${block.name}`
                        );
                      }}
                    >
                      Редактировать
                    </Button>
                    <style>{block?.css_style}</style>
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

            {/* Неактивные блоки в отдельном Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Не активные элементы</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {sortedblocks[selectedGroup || ""]?.filter((b) => !b.is_active).map((block) => (
                  <Card
                    key={block.id}
                    variant="outlined"
                    sx={{ cursor: "pointer", mt: 2 }}
                    onClick={() => handleOpenPreviewModal(block)}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={2}
                      >
                        <Typography variant="subtitle1">ID: {block.id}</Typography>
                        <Button
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/HtmlCssEditorPreview/${level}/${block.id}/?name=${block.name}`
                            );
                          }}
                        >
                          Редактировать
                        </Button>
                        <style>{block?.css_style}</style>
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
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedGroup(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

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
