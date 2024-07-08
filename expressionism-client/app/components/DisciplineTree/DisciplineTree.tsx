"use client";

import { apiActions } from "@/app/api/actions";
import { fetcherGet } from "@/app/api/fetchers";
import { TreeNodeButton } from "@/app/components/DisciplineTree/TreeNodeButton";
import type { Discipline, Section, Task, Topic } from "@/app/types/model";
import { Box, Center } from "@/styled-system/jsx";
import {
    BookOpenText,
    BookText,
    Check,
    Dice3,
    FlaskConical,
    NotebookTabs,
    Pencil,
    PlusIcon,
    Trash2,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useMemo } from "react";
import { CursorProps, Tree, TreeApi } from "react-arborist";
import useSWR from "swr";
import useResizeObserver from "use-resize-observer";
import TreeNode from "./TreeNode";
import { Child, TreeNodeType, TreeType } from "./types";

const displayTopicContentAsCourseStructure = (section: Section, topic: Topic) => {
    const mappedContent: Child[] = topic.generators.map((generator) => ({
        id: `${section.id}-${topic.id}-${generator.id}`,
        name: generator.name,
        icon: FlaskConical,
        type: TreeNodeType.Generator,
        extra: [
            <TreeNodeButton
                key="edit-generator"
                icon={Pencil}
                tooltip="Редактировать генератор"
                onClick={() => {}}
            />,
            <TreeNodeButton
                key="delete-generator"
                icon={Trash2}
                tooltip="Удалить генератор"
                popover={{
                    title: "Удалить генератор",
                    content: `Вы уверены, что хотите удалить генератор "${generator.name}" ?`,
                    confirmAction: async () => {
                        await apiActions.delete.generator(1, generator.id);
                    },
                }}
                hoverColor="red"
            />,
        ],
    }));

    mappedContent.push({
        id: `${section.id}-${topic.id}-new-generator`,
        name: "Новый генератор",
        icon: PlusIcon,
        type: TreeNodeType.Generator,
        isAction: true,
        action: async (e) => {
            await apiActions.create.generator(1, topic.id, { name: "Новый генератор" });
        },
    });

    return mappedContent;
};

const displayTaskContent = (section: Section, topic: Topic, task: Task) => {
    const mappedTaskContent: Child[] = task.generators.map((generator) => ({
        id: `${section.id}-${topic.id}-${task.id}-${generator.id}`,
        name: generator.generator.name,
        icon: FlaskConical,
        // TODO: Here not generator, but instead task-generator or smth like that
        type: TreeNodeType.Generator,
    }));

    if (task.generators.length === 0) {
        mappedTaskContent.push({
            id: `${section.id}-${topic.id}-${task.id}-placeholder`,
            name: "Переместите сюда необходимые генераторы из левой панели",
            icon: PlusIcon,
            type: TreeNodeType.TaskDropPlaceholder,
        });
    }

    return mappedTaskContent;
};

const displayTopicContentAsControlMaterials = (
    section: Section,
    topic: Topic,
    router: AppRouterInstance,
    courseVariantId?: number,
) => {
    const mappedContent: Child[] = topic.tasks
        .filter((task) => task.course_variant.id === courseVariantId)
        .map((task) => ({
            id: `${section.id}-${topic.id}-${task.id}`,
            name: task.name,
            icon: Check,
            type: TreeNodeType.Task,
            children: displayTaskContent(section, topic, task),
            extra: [
                <TreeNodeButton
                    key="generate"
                    icon={Dice3}
                    tooltip="Сгенерировать"
                    onClick={() => {
                        router.push("/results/" + task.id);
                    }}
                    hoverColor="orange"
                />,
                <TreeNodeButton
                    key="see-results"
                    icon={NotebookTabs}
                    tooltip="Посмотреть результаты"
                    onClick={() => {
                        router.push("/results/" + task.id);
                    }}
                    hoverColor="green"
                />,
                <TreeNodeButton
                    key="edit"
                    icon={Pencil}
                    tooltip="Изменить"
                    onClick={() => {}}
                    hoverColor="blue"
                />,
                <TreeNodeButton
                    key="delete-task"
                    icon={Trash2}
                    tooltip="Удалить КИМ"
                    popover={{
                        title: "Удалить КИМ",
                        content: `Вы уверены, что хотите удалить "${task.name}" ?`,
                        confirmAction: async () => {
                            await apiActions.delete.task(1, task.id);
                        },
                    }}
                    hoverColor="red"
                />,
            ],
        }));

    mappedContent.push({
        id: `${section.id}-${topic.id}-new-task`,
        name: "Новый КИМ",
        icon: PlusIcon,
        type: TreeNodeType.Task,
        isAction: true,
        action: async (e) => {
            // FIXME: Task should have also task type id
            await apiActions.create.task(1, topic.id, {
                name: "Новый КИМ",
                task_type: 1,
                course_variant: courseVariantId,
            });
        },
    });

    return mappedContent;
};

const displayTopicContent = (
    section: Section,
    topic: Topic,
    treeType: TreeType,
    router: AppRouterInstance,
    courseVariantId?: number,
) => {
    if (treeType === TreeType.ControlMaterials) {
        return displayTopicContentAsControlMaterials(section, topic, router, courseVariantId);
    }

    return displayTopicContentAsCourseStructure(section, topic);
};

const displayTopics = (
    section: Section,
    treeType: TreeType,
    router: AppRouterInstance,
    courseVariantId?: number,
) => {
    const mappedTopics: Child[] = section.topics.map((topic) => ({
        id: `${section.id}-${topic.id}`,
        name: topic.name,
        icon: BookOpenText,
        type: TreeNodeType.Topic,
        children: displayTopicContent(section, topic, treeType, router, courseVariantId),
        extra: [
            <TreeNodeButton
                key="edit-topic"
                tooltip="Переименовать тему"
                icon={Pencil}
                onClick={() => {
                    console.log("Edit " + section.id);
                }}
                hoverColor="blue"
            />,
            <TreeNodeButton
                key="delete-topic"
                icon={Trash2}
                tooltip="Удалить тему"
                popover={{
                    title: "Удалить тему",
                    content: `Вы уверены, что хотите удалить тему "${topic.name}" ?`,
                    confirmAction: async () => {
                        await apiActions.delete.topic(1, topic.id);
                    },
                }}
                hoverColor="red"
            />,
        ],
    }));

    if (treeType === TreeType.CourseStructure) {
        mappedTopics.push({
            id: `${section.id}-new-topic`,
            name: "Новая тема",
            icon: PlusIcon,
            type: TreeNodeType.Topic,
            isAction: true,
            action: async (e) => {
                await apiActions.create.topic(1, section.id, { name: "Новая тема" });
            },
        });
    }

    return mappedTopics;
};

const displaySections = (
    sections: Section[],
    treeType: TreeType,
    router: AppRouterInstance,
    courseVariantId?: number,
) => {
    const mappedSections: Child[] = sections.map((section) => ({
        id: `${section.id}`,
        name: section.name,
        icon: BookText,
        type: TreeNodeType.Section,
        children: displayTopics(section, treeType, router, courseVariantId),
        extra: [
            <TreeNodeButton
                key="edit-section"
                icon={Pencil}
                tooltip="Редактировать"
                onClick={() => {
                    console.log("Start edit " + section.id);
                }}
                hoverColor="blue"
            />,
            <TreeNodeButton
                key="delete-section"
                icon={Trash2}
                tooltip="Удалить раздел"
                popover={{
                    title: "Удалить раздел",
                    content: `Вы уверены, что хотите удалить раздел "${section.name}" ?`,
                    confirmAction: async () => {
                        await apiActions.delete.section(1, section.id);
                    },
                }}
                hoverColor="red"
            />,
        ],
    }));

    if (treeType === TreeType.CourseStructure) {
        mappedSections.push({
            id: "new-section",
            name: "Новый раздел",
            icon: PlusIcon,
            type: TreeNodeType.Section,
            isAction: true,
            action: async (e) => {
                await apiActions.create.section(1, { name: "Новый раздел" });
            },
        });
    }

    return mappedSections;
};

export interface DisciplineTreeProps {
    treeType: TreeType;
    courseVariantId?: number;
    onToggle?: (id: string) => void;
}

type DisciplineTreeContextType = {
    data: Discipline | undefined;
};

const DisciplineTreeContext = React.createContext<DisciplineTreeContextType | undefined>(undefined);

const TreeCursor: React.FC<CursorProps> = (props) => {
    return (
        <Box
            style={{
                top: props.top,
                left: props.left,
                width: `calc(100% - ${props.left}px - 8px)`,
            }}
            display="flex"
            // zIndex={1}
            position={"relative"}
            alignItems="center"
            border="1px dashed var(--colors-blue-light-8)"
            borderRadius="md"
            height={38}
            pl="4"
            bgColor="blue.2"
        >
            Переместить сюда
        </Box>
    );
};

const DisciplineTree = React.forwardRef<TreeApi<Child> | undefined, DisciplineTreeProps>(
    ({ treeType, courseVariantId, ...props }, forwardedRef) => {
        const router = useRouter();
        const { ref: resizingRef, height } = useResizeObserver<HTMLDivElement>();

        const { data } = useSWR<Discipline>("disciplines/1/sections", fetcherGet, {
            keepPreviousData: true,
            revalidateOnFocus: false,
        });

        const treeViewData = useMemo(() => {
            return data ? displaySections(data.sections, treeType, router, courseVariantId) : [];
        }, [data, treeType, courseVariantId, router]);

        if (data === undefined) {
            return (
                <Center w="full" h="full">
                    <ProgressSpinner />
                </Center>
            );
        }

        return (
            <DisciplineTreeContext.Provider value={{ data: data }}>
                <Box ref={resizingRef} w="full" h="full" overflowX="visible">
                    <Tree
                        ref={forwardedRef}
                        data={treeViewData}
                        rowHeight={38}
                        indent={30}
                        openByDefault={false}
                        onToggle={props.onToggle}
                        renderCursor={TreeCursor}
                        width="100%"
                        height={height}
                    >
                        {TreeNode}
                    </Tree>
                </Box>
            </DisciplineTreeContext.Provider>
        );
    },
);

DisciplineTree.displayName = "DisciplineTree";

const useDisciplineTree = () => {
    const context = React.useContext(DisciplineTreeContext);

    if (!context) {
        throw new Error("This component must be used within a <DisciplineTree> component.");
    }

    return context;
};

export { useDisciplineTree };
export default DisciplineTree;
