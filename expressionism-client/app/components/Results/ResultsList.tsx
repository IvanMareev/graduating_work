"use client";

import { apiActions } from "@/app/api/actions";
import { fetcherGet } from "@/app/api/fetchers";
import { GenerationResult, Task } from "@/app/types/model";
import { css, cx, sva } from "@/styled-system/css";
import { Box, Center, Flex } from "@/styled-system/jsx";
import ky from "ky";
import { FileUp, FlaskConical, Trash2 } from "lucide-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { confirmPopup } from "primereact/confirmpopup";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { TreeNodeButton } from "../DisciplineTree/TreeNodeButton";
import GenerationPopup from "./GenerationPopup";
import { boxStyles } from "./styles";

export type ResultsListProps = {
    task: Task | undefined;
    onResultSelect: (result: GenerationResult | null) => void;
};

const TRANSITIONS = {
    toggleable: {
        timeout: 100,
        classNames: {
            enter: css({ maxH: "0" }),
            enterActive: css({
                maxH: "40px!",
                overflow: "hidden",
                transition: "max-height 0.1s ease-in-out",
            }),
            exit: css({ maxH: "40px" }),
            exitActive: css({
                maxH: "0!",
                overflow: "hidden",
                transition: "max-height 0.1s ease-in",
            }),
        },
    },
};

const accordionStyles = sva({
    className: "resultsAccordion",
    slots: ["root", "header", "headerSelected", "content", "extra"],
    base: {
        root: {
            display: "flex",
            flexDir: "column",
            gap: 1,
        },
        header: {
            p: 2,
            borderRadius: "md",
            position: "relative",
            transition: "background-color 0.1s",
            _hover: {
                bgColor: "slate.3",
                "& .resultsAccordion__extra": {
                    opacity: 1,
                    transition: "opacity 0.1s",
                },
            },
            "& .resultsAccordion__extra": {
                opacity: 0,
                transition: "none",
            },
        },
        headerSelected: {
            bgColor: "blue.4",
            _hover: {
                bgColor: "blue.4",
            },
            "& .resultsAccordion__extra": {
                opacity: 1,
                transition: "opacity 0.1s",
            },
        },
        content: {
            mt: "-4px",
            px: "38px",
            py: 2,
            bgColor: "blue.3",
            borderBottomRadius: "md",
            display: "flex",
            flexDir: "column",
            gap: 2,
        },
        extra: {
            display: "flex",
            gap: 2,
        },
    },
});

const ResultsList = ({ task, onResultSelect }: ResultsListProps) => {
    const { data, mutate } = useSWR<GenerationResult[]>(
        task ? `tasks/${task.id}/results` : null,
        fetcherGet,
        {
            revalidateOnFocus: false,
        },
    );

    const [results, setResults] = useState<GenerationResult[]>([]);
    const [selectedResultIdx, setSelectedResultIdx] = useState(0);

    const style = accordionStyles();
    useEffect(() => {
        if (data == null) return;
        setResults(data);
    }, [data, onResultSelect]);

    useEffect(() => {
        const idx = Math.max(0, Math.min(selectedResultIdx, results.length - 1));

        setSelectedResultIdx(idx);
        onResultSelect(results.length === 0 ? null : results[idx]);
    }, [onResultSelect, results, selectedResultIdx]);

    const generationConfirm = (event) => {
        confirmPopup({
            group: "generation",
            target: event.currentTarget,
            defaultFocus: "accept",
        });
    };

    return (
        <div className={boxStyles.boxRoot}>
            <div className={boxStyles.boxHeader}>
                <h3>Результаты генерации</h3>
                <span>всего: {results.length}</span>
            </div>
            <div className={boxStyles.box}>
                <Box overflowY="auto" flex="1 1 0">
                    {results.length === 0 ? (
                        <Center
                            color="fg.subtle"
                            w="full"
                            h="full"
                            flexDir="column"
                            textAlign="center"
                        >
                            <p>Сгенерируйте первые варианты этого задания нажав на кнопку ниже!</p>
                        </Center>
                    ) : (
                        <Accordion
                            expandIcon={<div></div>}
                            collapseIcon={<div></div>}
                            activeIndex={selectedResultIdx}
                            onTabChange={(e) => {
                                if (e.index == null) return;
                                setSelectedResultIdx(e.index);
                                onResultSelect?.(results[e.index]);
                            }}
                            unstyled
                            pt={{
                                root: { className: style.root },
                                accordiontab: {
                                    header: ({ context }) => ({
                                        className: cx(
                                            style.header,
                                            context.selected ? style.headerSelected : null,
                                        ),
                                    }),
                                    content: { className: style.content },
                                    transition: TRANSITIONS.toggleable,
                                },
                            }}
                        >
                            {results.map((result, index) => {
                                const chkBoxId = index + "_checkbox";
                                return (
                                    <AccordionTab
                                        key={index}
                                        header={
                                            <Flex gap={3} alignItems="center">
                                                <FlaskConical size={18} />
                                                {result.name}
                                                <Box flex="1 0"></Box>
                                                <div className={style.extra}>
                                                    <TreeNodeButton
                                                        icon={FileUp}
                                                        tooltip="Экспортировать"
                                                        tooltipId="button-tooltip"
                                                        onClick={async (e) => {
                                                            await ky
                                                                .get(
                                                                    `http://127.0.0.1:5000/results/${result.id}/export`,
                                                                )
                                                                .then((res) => res.blob())
                                                                .then((blob) => {
                                                                    let el =
                                                                        document.createElement("a");
                                                                    el.setAttribute(
                                                                        "download",
                                                                        `Экспорт_${task?.name}_Результат_${index + 1}`,
                                                                    );
                                                                    el.href =
                                                                        URL.createObjectURL(blob);
                                                                    el.click();
                                                                });
                                                        }}
                                                    />
                                                    <TreeNodeButton
                                                        icon={Trash2}
                                                        tooltip="Удалить"
                                                        tooltipId="button-tooltip"
                                                        hoverColor="red"
                                                        popover={{
                                                            title: "Удалить результаты",
                                                            content:
                                                                "Вы действительно хотите удалить результаты генерации?",
                                                            confirmAction: async () => {
                                                                if (result == null) {
                                                                    return;
                                                                }
                                                                await apiActions.delete.results(
                                                                    result.id,
                                                                );
                                                                await mutate();
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </Flex>
                                        }
                                    >
                                        <Box fontSize="sm">Дата: {result.created_at}</Box>
                                        <Box fontSize="sm">
                                            <Checkbox
                                                inputId={chkBoxId}
                                                checked={result.issued}
                                                onChange={async (e) => {
                                                    await apiActions.edit.result(result.id, {
                                                        issued: e.checked,
                                                    });
                                                    await mutate();
                                                }}
                                            />
                                            <label htmlFor={chkBoxId} className={css({ ml: "2" })}>
                                                Выдано
                                            </label>
                                        </Box>
                                    </AccordionTab>
                                );
                            })}
                        </Accordion>
                    )}
                </Box>
                <Button
                    label="Сгенерировать"
                    size="small"
                    disabled={task == null || task.generators.length == 0}
                    onClick={generationConfirm}
                />
            </div>
            <GenerationPopup
                accept={async (e, vc) => {
                    if (task == null) return;
                    await apiActions.create.generation(task.id, { variants_count: vc });
                }}
            />
        </div>
    );
};

export default ResultsList;
