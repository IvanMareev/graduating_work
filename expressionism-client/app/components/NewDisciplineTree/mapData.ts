import { apiActions } from "@/app/api/actions";
import { Section, Task } from "@/app/types/model";
import {
    BookOpenText,
    BookText,
    Check,
    Dice3,
    Edit,
    Flag,
    FlaskConical,
    NotebookTabs,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { confirmPopup } from "primereact/confirmpopup";
import { Dispatch, SetStateAction } from "react";
import { TreeItem } from "react-complex-tree";
import { TreeNodeButtonProps } from "../DisciplineTree/TreeNodeButton";

export enum TreeItemAccesoryType {
    CourseStructure,
    ControlMaterials,
}

export enum TreeItemType {
    Generator,
    Task,
    TaskGenerator,
}

export type TreeItemEditData = {
    newName?: string;
    taskType?: string;
};

export type TreeItemData = {
    title: string;
    icon?: React.ElementType;
    accesoryType?: TreeItemAccesoryType;
    itemType?: TreeItemType;
    onEdit?: (data: TreeItemEditData) => Promise<void>;
    isAction?: boolean;
    taskInfo?: Task;
    action?: React.MouseEventHandler<HTMLElement>;
    extra?: TreeNodeButtonProps[];
};

interface TreeItemExtended<T> extends TreeItem<T> {
    canSelect?: boolean;
}

type MappedData = { [id: string]: TreeItemExtended<TreeItemData> };

function mapDataToTree(
    data: Section[],
    courseVariantId: number,
    router: AppRouterInstance,
    setTaskId: Dispatch<SetStateAction<number | null>>,
): MappedData {
    const mappedValues: MappedData = {};

    data.forEach((section) => {
        const newTopicAction = "new_topic_" + section.id;

        mappedValues[`section-${section.id}`] = {
            index: `section-${section.id}`,
            data: {
                title: section.name,
                icon: BookText,
                onEdit: async (data) => {
                    await apiActions.edit.section(1, section.id, { name: data.newName });
                },
                extra: [
                    {
                        icon: Pencil,
                        tooltip: "Редактировать",
                        onClick: (context) => {
                            context.startRenamingItem();
                        },
                    },
                    {
                        icon: Trash2,
                        tooltip: "Удалить раздел",
                        popover: {
                            title: "Удалить раздел",
                            content: "Вы уверены, что хотите удалить раздел?",
                            confirmAction: async () => {
                                await apiActions.delete.section(1, section.id);
                            },
                        },
                        hoverColor: "red",
                    },
                ],
            },
            isFolder: true,
            children: section.topics
                .map((topic) => `topic_${section.id}-${topic.id}`)
                .concat([newTopicAction]),
        };

        // Add action for new topic
        mappedValues[newTopicAction] = {
            index: newTopicAction,
            data: {
                title: "Новая тема",
                isAction: true,
                icon: Plus,
                accesoryType: TreeItemAccesoryType.CourseStructure,
                action: async (e) => {
                    e.stopPropagation();
                    await apiActions.create.topic(1, section.id, { name: "Новая тема" });
                },
            },
            canMove: false,
            canRename: false,
            canSelect: false,

            isFolder: false,
        };

        section.topics.forEach((topic) => {
            const newGeneratorAction = "new_generator_" + topic.id;

            mappedValues[`topic_${section.id}-${topic.id}`] = {
                index: `topic_${section.id}-${topic.id}`,
                data: {
                    title: topic.name,
                    icon: BookOpenText,
                    onEdit: async (data) => {
                        await apiActions.edit.topic(1, topic.id, { name: data.newName });
                    },
                    extra: [
                        {
                            icon: Pencil,
                            tooltip: "Редактировать",
                            onClick: (context) => {
                                context.startRenamingItem();
                            },
                        },
                        {
                            icon: Trash2,
                            tooltip: "Удалить тему",
                            popover: {
                                title: "Удалить тему",
                                content: "Вы уверены, что хотите удалить тему?",
                                confirmAction: async () => {
                                    await apiActions.delete.topic(1, topic.id);
                                },
                            },
                            hoverColor: "red",
                        },
                    ],
                },
                isFolder: true,
                children: topic.generators
                    .map((generator) => `generator-${generator.id}`)
                    .concat([newGeneratorAction]),
            };

            // Add action for new generator
            mappedValues[newGeneratorAction] = {
                index: newGeneratorAction,
                data: {
                    title: "Новый генератор",
                    isAction: true,
                    icon: Plus,
                    accesoryType: TreeItemAccesoryType.CourseStructure,
                    action: async (e) => {
                        e.stopPropagation();
                        await apiActions.create.generator(1, topic.id, { name: "Новый генератор" });
                    },
                },
                canMove: false,
                canRename: false,
                canSelect: false,

                isFolder: false,
            };

            const newTaskAction = "new_task_" + topic.id;

            mappedValues[`right_topic-${topic.id}`] = {
                index: `right_topic-${topic.id}`,
                data: {
                    title: topic.name,
                    icon: BookOpenText,
                },
                isFolder: true,
                children: topic.tasks
                    .filter((task) => task.course_variant.id === courseVariantId)
                    .map((task) => `task-${task.id}`)
                    .concat([newTaskAction]),
            };

            // Add action for new task
            mappedValues[newTaskAction] = {
                index: newTaskAction,
                data: {
                    title: "Новый КИМ",
                    isAction: true,
                    icon: Plus,
                    accesoryType: TreeItemAccesoryType.ControlMaterials,
                    action: async (e) => {
                        e.stopPropagation();
                        await apiActions.create.task(1, topic.id, {
                            name: "Новый КИМ",
                            task_type: 1,
                            course_variant: courseVariantId,
                        });
                    },
                },
                canMove: false,
                canRename: false,
                canSelect: false,
                isFolder: false,
            };

            topic.generators.forEach((generator) => {
                mappedValues[`generator-${generator.id}`] = {
                    index: `generator-${generator.id}`,
                    data: {
                        title: generator.name,
                        icon: FlaskConical,
                        accesoryType: TreeItemAccesoryType.CourseStructure,
                        itemType: TreeItemType.Generator,
                        onEdit: async (data) => {
                            await apiActions.edit.generator(1, generator.id, {
                                name: data.newName,
                            });
                        },
                        extra: [
                            {
                                icon: Pencil,
                                tooltip: "Переименовать",
                                onClick: (context) => {
                                    context.startRenamingItem();
                                },
                            },
                            {
                                icon: Edit,
                                tooltip: "Перейти к редактору",
                                onClick: (context) => {
                                    router.push(`editor/${generator.id}`);
                                },
                                hoverColor: "green",
                            },
                            {
                                icon: Trash2,
                                tooltip: "Удалить генератор",
                                popover: {
                                    title: "Удалить генератор",
                                    content: "Вы уверены, что хотите удалить генератор?",
                                    confirmAction: async () => {
                                        await apiActions.delete.generator(1, generator.id);
                                    },
                                },
                                hoverColor: "red",
                            },
                        ],
                    },
                    isFolder: false,
                };
            });

            topic.tasks.forEach((task) => {
                if (task.course_variant.id !== courseVariantId) return;

                mappedValues[`task-${task.id}`] = {
                    index: `task-${task.id}`,
                    data: {
                        title: task.name,
                        icon: task.type.id === 1 ? Check : Flag,
                        accesoryType: TreeItemAccesoryType.ControlMaterials,
                        itemType: TreeItemType.Task,
                        onEdit: async (data) => {
                            await apiActions.edit.task(1, task.id, {
                                name: data.newName,
                                task_type: data.taskType,
                            });
                        },
                        taskInfo: task,
                        extra: [
                            {
                                icon: Pencil,
                                tooltip: "Редактировать",
                                onClick: (context) => {
                                    context.startRenamingItem();
                                },
                            },
                            {
                                icon: Dice3,
                                disabled: task.generators.length === 0,
                                tooltip:
                                    task.generators.length !== 0
                                        ? "Сгенерировать"
                                        : "Добавьте генераторы в КИМ",
                                onClick: (context, e) => {
                                    confirmPopup({
                                        group: "generation",
                                        target: e.currentTarget,
                                        defaultFocus: "accept",
                                    });
                                    setTaskId(task.id);
                                },
                                hoverColor: "orange",
                            },
                            {
                                icon: NotebookTabs,
                                tooltip: "Посмотреть результаты",
                                onClick: (context) => {
                                    router.push(`results/${task.id}`);
                                },
                                hoverColor: "green",
                            },
                            {
                                icon: Trash2,
                                tooltip: "Удалить КИМ",
                                popover: {
                                    title: "Удалить КИМ",
                                    content: "Вы уверены, что хотите удалить КИМ?",
                                    confirmAction: async () => {
                                        await apiActions.delete.task(1, task.id);
                                    },
                                },
                                hoverColor: "red",
                            },
                        ],
                    },
                    isFolder: true,
                    children: task.generators.map((generator) => `task_generator-${generator.id}`),
                };

                task.generators.forEach((taskGenerator) => {
                    mappedValues[`task_generator-${taskGenerator.id}`] = {
                        index: `task_generator-${taskGenerator.id}`,
                        data: {
                            title: taskGenerator.generator.name,
                            icon: FlaskConical,
                            itemType: TreeItemType.TaskGenerator,
                            extra: [
                                {
                                    icon: Trash2,
                                    tooltip: "Убрать генератор из КИМ",
                                    popover: {
                                        title: "Убрать генератор из КИМ",
                                        content: "Вы уверены, что хотите убрать генератор из КИМ?",
                                        confirmAction: async () => {
                                            await apiActions.delete.taskGenerator(
                                                1,
                                                taskGenerator.id,
                                            );
                                        },
                                    },
                                    hoverColor: "red",
                                },
                            ],
                        },
                        isFolder: false,
                    };
                });
            });
        });
    });

    mappedValues["root_left"] = {
        index: "root_left",
        data: { title: "root_left" },
        isFolder: true,
        children: data.map((section) => `section-${section.id}`).concat(["new_section"]),
    };

    // New section aciton
    mappedValues["new_section"] = {
        index: "new_section",
        data: {
            title: "Новый раздел",
            isAction: true,
            icon: Plus,
            accesoryType: TreeItemAccesoryType.CourseStructure,
            action: async (e) => {
                e.stopPropagation();
                await apiActions.create.section(1, { name: "Новый раздел" });
            },
        },
        canMove: false,
        canRename: false,
        canSelect: false,
        isFolder: false,
    };

    return mappedValues;
}

export default mapDataToTree;
