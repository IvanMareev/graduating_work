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
    FormControl,
    MenuItem,
    Select,
    InputLabel
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import styles from "./BlockList.module.css";
import createNewContainer from "@/app/services/firstLevelServices/createNewContainer";
import { CreateContainerParams } from "@/app/types/lvl1";
import getTemplateLvlTableServices from "@/app/services/firstLevelServices/getTemplateLvlTableServices";

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
    level: number
};

const BlockList: React.FC<BlockListProps> = ({ blocks, level }) => {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [newBlockContent, setnewBlockContent] = useState<CreateContainerParams | null>(null);
    const [templateOptions, setTemplateOptions] = useState<any>();

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
            level: level
        };
        console.log('updatedBlockContent', updatedBlockContent);

        setnewBlockContent(updatedBlockContent);
        let res = await createNewContainer(updatedBlockContent);

        router.push(`/HtmlCssEditorPreview/${level}/0?BlockID=${res.id}&templateId=${newBlockContent['template_lvl_id'] || 1}`)
        handleCloseModal();
    };

    useEffect(() => {
        if (openModal && level != 1) {

            getTemplateLvlTableServices(level - 1).then((data) => {
                console.log('templateOptions_data', data);
                if (Array.isArray(data)) {
                    setTemplateOptions(data);
                }
            });
            console.log('templateOptions', templateOptions);
        }
    }, [openModal, level]);
    console.log("BLockLIST", blocks);


    console.log(
        'Block IDs by group:',
        Object.entries(blocks).map(([groupName, groupBlocks]) => ({
            groupName,
            ids: groupBlocks.map((b) => b.id),
        }))
    );


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
                            <Typography variant="h6"> {groupName}     ({groupBlocks[0].always_eat ? "Обязательно в макете" : "необязательно в макете"})</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Button
                                variant="contained"
                                startIcon={<Plus size={18} />}
                                sx={{ textTransform: "none" }}
                                onClick={() => router.push(`/HtmlCssEditorPreview/${level}/0?BlockID=${groupBlocks[0]['lvl_id']}&templateId=${1}`)}
                            >
                                Добавить вариант верстки контейнера
                            </Button>
                            {groupBlocks.map((block) => (
                                <Card key={block.id} variant="outlined">
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1">
                                                ID: {block.id}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    router.push(`/HtmlCssEditorPreview/${level}/${block.id}/`)
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
                    {level == 1 && <TextField
                        fullWidth
                        label="Значение сортровки"
                        onChange={(e) => setnewBlockContent((prev) => ({
                            ...prev,
                            physicalLevel: e.target.value
                        }))}
                        margin="normal"
                    />}
                    {level != 1 && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Выберите с каким компонентом связать контейнер</InputLabel>
                            <Select
                                value={newBlockContent?.template_lvl_id || ""}
                                label="Template"
                                onChange={(e) =>
                                    setnewBlockContent((prev) => ({
                                        ...prev,
                                        template_lvl_id: e.target.value
                                    }))
                                }
                            >
                                {templateOptions?.map((tpl) => (
                                    <MenuItem key={tpl.id} value={tpl.id}>
                                        {tpl.template_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}


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
