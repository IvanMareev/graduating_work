"use client";

import { IconButton } from "@/app/components/ui/icon-button";
import { fetcherDelete, fetcherGet, fetcherPatch, fetcherPost } from "@/app/api/fetchers";
import { CourseVariant } from "@/app/types/model";
import { css, sva } from "@/styled-system/css";
import { Box } from "@/styled-system/jsx";
import { ChevronLeft, ChevronRight, CircleAlert, PlusIcon, Trash2 } from "lucide-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import useSWR from "swr";
import { Tooltip } from "react-tooltip";
import { CourseVariantTab } from "./CourseVariantTab";

const courseVariantsListStyles = sva({
    slots: ["root", "listRoot"],
    base: {
        root: {
            display: "flex",
            alignItems: "stretch",
            flexWrap: "nowrap",
            overflow: "hidden",
        },
        listRoot: {
            display: "flex",
            flex: "1 0",
            gap: 2,
            alignItems: "stretch",
            pr: 2,
            flexWrap: "nowrap",
            overflow: "hidden",
        },
    },
});

const styles = courseVariantsListStyles();

type CourseVariantListProps = {
    onVariantChanged?: (variantId: number) => void;
};

const CourseVariantList: React.FC<CourseVariantListProps> = ({ onVariantChanged }) => {
    const { data, isValidating, mutate } = useSWR<CourseVariant[]>(
        "disciplines/1/course_variants",
        fetcherGet,
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            fallbackData: [{ id: -1, name: "..." }],
        },
    );

    const [selectedItem, setSelectedItem] = React.useState(0);
    const [shouldScrollToLast, setShouldScrollToLast] = React.useState(false);
    const contextMenuRef = React.useRef<ContextMenu>(null);
    const itemsRef = React.useRef<Map<number, HTMLLIElement> | null>(null);

    const getMap = React.useCallback(() => {
        if (!itemsRef.current) {
            itemsRef.current = new Map();
        }
        return itemsRef.current;
    }, []);

    const scrollTo = React.useCallback(
        (id: number) => {
            const map = getMap();
            const node = map.get(id);
            node?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        },
        [getMap],
    );

    const selectItem = React.useCallback(
        (itemIndex: number) => {
            if (data === undefined) return;

            if (itemIndex < 0) itemIndex = 0;
            if (itemIndex > data.length - 1) itemIndex = data.length - 1;

            setSelectedItem(itemIndex);
            scrollTo(data[itemIndex].id);
            onVariantChanged?.(data[itemIndex].id);
        },
        [data, onVariantChanged, scrollTo],
    );

    const newCourseVariant = async (e: any) => {
        await fetcherPost("disciplines/1/new/course_variant", { name: "Безымянный" });
        mutate();
        setShouldScrollToLast(true);
    };

    const showConfirmDeleteCourseVariant = () => {
        confirmDialog({
            message: "Вы действительно хотите удалить этот вариант курса? Это действие необратимо!",
            header: `Удаление варианта курса "${data![selectedItem].name}"`,
            icon: <CircleAlert size={32} />,
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            rejectLabel: "Отмена",
            acceptLabel: "Удалить",
            accept: async () => {
                await fetcherDelete("delete/course_variant/" + data![selectedItem].id);
                mutate(data!.filter((_, i) => i !== selectedItem));
                selectItem(selectedItem - 1);
            },
        });
    };

    const deleteSelectedCourseVariant = async (e: any) => {
        if (e.item.id === "delete") {
            showConfirmDeleteCourseVariant();
        }
    };

    React.useEffect(() => {
        if (shouldScrollToLast && !isValidating) {
            selectItem(data!.length - 1);
            setShouldScrollToLast(false);
        }
    }, [data, selectItem, shouldScrollToLast, isValidating]);

    const renderTabs = () => {
        return data!.map((courseVariant, i) => (
            <CourseVariantTab
                ref={(node) => {
                    const map = getMap();
                    if (node) {
                        map.set(courseVariant.id, node);
                    } else {
                        map.delete(courseVariant.id);
                    }
                }}
                key={`${courseVariant.id}-${courseVariant.name}`}
                selected={i === selectedItem}
                onClick={() => {
                    selectItem(i);
                }}
                onSubmit={async (value) => {
                    await fetcherPatch("edit/course_variant/" + courseVariant.id, { name: value });
                    const newData = [...data!];
                    newData[i] = { ...newData[i], name: value };
                    mutate(newData, false);
                }}
                onContextMenu={(e: any) => {
                    selectItem(i);
                    contextMenuRef.current?.show(e);
                }}
                content={courseVariant.name}
            />
        ));
    };

    return (
        <>
            <Box className={styles.root}>
                <ul className={styles.listRoot}>{renderTabs()}</ul>
                <Box
                    display="flex"
                    gap={2}
                    alignItems="center"
                    pl={2}
                    boxShadow="-2px 0 0 0 var(--colors-border-default)"
                >
                    <IconButton variant="ghost" size="sm" onClick={newCourseVariant}>
                        <PlusIcon />
                    </IconButton>
                    <IconButton
                        variant="ghost"
                        size="sm"
                        disabled={selectedItem <= 0}
                        onClick={() => {
                            selectItem(selectedItem - 1);
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                    <IconButton
                        variant="ghost"
                        size="sm"
                        disabled={selectedItem >= data!.length - 1}
                        onClick={() => {
                            selectItem(selectedItem + 1);
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>
            </Box>
            <ContextMenu
                ref={contextMenuRef}
                model={[
                    {
                        id: "delete",
                        label: "Удалить",
                        icon: <Trash2 className={css({ mr: "2" })} size={16} />,
                        command: deleteSelectedCourseVariant,
                    },
                ]}
            />
            <Tooltip id="course-variant-tooltip" />
            <Tooltip
                style={{ backgroundColor: "var(--colors-red-light-9)" }}
                id="course-variant-input-field-error"
            />
        </>
    );
};

export default CourseVariantList;
