"use client";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
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
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import styles from "./BlockList.module.css";
import createNewContainer from "@/app/services/firstLevelServices/createNewContainer";
import { CreateContainerParams } from "@/app/types/lvl1";

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
};

const BlockList: React.FC<BlockListProps> = ({ blocks }) => {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [newBlockContent, setnewBlockContent] = useState<CreateContainerParams | null>(null);

    const handleOpenModal = (groupName: string) => {
        setSelectedGroup(groupName);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddBlock = async () => {
        const updatedBlockContent = {
            ...newBlockContent,
            level: 1
        };

        setnewBlockContent(updatedBlockContent);
        let res = await createNewContainer(updatedBlockContent);

        router.push(`/HtmlCssEditorPreview/${1}/0?BlockID=${res.id}`)
        handleCloseModal();
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{ textTransform: "none" }}
                onClick={() => handleOpenModal('')}
            >
                Добавить контейнер
            </Button>
            {Object.entries(blocks).map(([groupName, groupBlocks]) => (

                <Accordion key={groupName}>
                    <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                            <Typography variant="h6">{groupName}</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Plus size={18} />}
                                sx={{ textTransform: "none" }}
                                onClick={() => router.push(`/HtmlCssEditorPreview/${1}/0?BlockID=${groupBlocks[0]['lvl_id']}`)}
                            >
                              Добавить вариант верстки контейнера 
                            </Button>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {groupBlocks.map((block) => (
                                <Card key={block.id} variant="outlined">
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1">
                                                ID: {block.id} | Уровень: {block.level} | Always Eat:{" "}
                                                {block.always_eat ? "✔️" : "❌"}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    router.push(`/HtmlCssEditorPreview/${1}/${block.id}/`)
                                                }
                                            >
                                                Редактировать
                                            </Button>
                                        </Box>

                                        {/* CSS блок */}
                                        <style>{block.css_style}</style>

                                        {/* HTML превью */}
                                        <Box
                                            className={styles.preview}
                                            mt={2}
                                            p={2}
                                            border="1px solid #ccc"
                                            borderRadius={2}
                                            dangerouslySetInnerHTML={{ __html: block.html }}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}

            {/* Модальное окно */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить вариант</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Название блока"
                        onChange={(e) => setnewBlockContent((prev) => ({
                            ...prev,
                            containerName: e.target.value
                        }))}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Значение сортровки"
                        onChange={(e) => setnewBlockContent((prev) => ({
                            ...prev,
                            physicalLevel: e.target.value
                        }))}
                        margin="normal"
                    />
                    {/* Здесь можно добавить поля для html/css, если нужно */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Отмена</Button>
                    <Button onClick={handleAddBlock} variant="contained" >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BlockList;
