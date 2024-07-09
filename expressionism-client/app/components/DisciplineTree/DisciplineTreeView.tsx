"use client";

import { apiActions } from "@/app/api/actions";
import { fetcherGet } from "@/app/api/fetchers";
import { Section } from "@/app/types/model";
import { Box } from "@/styled-system/jsx";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ControlledTreeEnvironment,
    InteractionMode,
    Tree,
    TreeEnvironmentRef,
    TreeItem,
    TreeItemIndex,
} from "react-complex-tree";
import { Tooltip } from "react-tooltip";
import useSWR from "swr";
import Block from "../Block";
import CourseVariantList from "../CourseVariantList";
import GenerationPopup from "../Results/GenerationPopup";
import mapDataToTree, { TreeItemData, TreeItemType } from "./mapData";
import disciplineTreeRenderers from "./renderers";
import { disciplineTreeViewStyles } from "./styles";

export class CourseTreeState {
    expandedItems: TreeItemIndex[] = [];
    courseVariant: number = 1;
    selectedTopic: string = "right_topic-1";

    constructor() {
        makeAutoObservable(this);
    }

    setExpandedItems(items: TreeItemIndex[]) {
        this.expandedItems = items;
    }

    setCourseVariant(variant: number) {
        this.courseVariant = variant;
    }

    setSelectedTopic(topic: string) {
        this.selectedTopic = topic;
    }
}

var courseTreeState = new CourseTreeState();
export { courseTreeState };

const DisciplineTreeView = observer(function DisciplineTreeView({
    courseTreeState,
}: {
    courseTreeState: CourseTreeState;
}) {
    const { data } = useSWR<Section[]>("disciplines/1/sections", fetcherGet, {
        keepPreviousData: true,
        revalidateOnFocus: false,
    });

    const router = useRouter();

    const environment = useRef<TreeEnvironmentRef>(null);
    const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [taskId, setTaskId] = useState<number | null>(null);

    useEffect(() => {
        if (data && !initialized) {
            // Expand first section by default
            const initialExpandedItems = [`section-${data[0].id}`];

            // Expand first topic of each section by default
            data.forEach((section) => {
                if (section.topics.length > 0) {
                    initialExpandedItems.push(`topic_${section.id}-${section.topics[0].id}`);
                }
            });

            if (courseTreeState.expandedItems.length === 0) {
                courseTreeState.setExpandedItems(initialExpandedItems);
                // Select first topic by default
                courseTreeState.setSelectedTopic(`right_topic-${data[0].topics[0].id}`);
            }
            setInitialized(true);
        }
    }, [courseTreeState, data, initialized]);

    const items = useMemo(() => {
        if (data === undefined) {
            return {};
        }

        const mappedData = mapDataToTree(data, courseTreeState.courseVariant, router, setTaskId);

        return mappedData;
    }, [courseTreeState.courseVariant, data, router]);

    const handleExpandItem = (item: TreeItem<TreeItemData>) => {
        const itemIndex = item.index.toString();
        const t = itemIndex.split("-")[0];

        courseTreeState.setExpandedItems([
            ...courseTreeState.expandedItems.filter(
                (expandedItem) => t !== expandedItem.toString().split("-")[0],
            ),
            item.index,
        ]);

        if (itemIndex.startsWith("topic")) {
            const topicId = itemIndex.split("-")[1];

            courseTreeState.setSelectedTopic("right_topic-" + topicId);
        } else if (itemIndex.startsWith("section")) {
            const sectionId = itemIndex.split("-")[1];

            const relatedTopic = courseTreeState.expandedItems.find((item) =>
                item.toString().startsWith("topic_" + sectionId),
            );

            if (relatedTopic === undefined) {
                const section = data?.find((s) => s.id === Number(sectionId));
                if (section == null) {
                    throw new Error(`Section with id ${sectionId} not found!`);
                }
                courseTreeState.setExpandedItems(
                    courseTreeState.expandedItems.concat(
                        `topic_${section.id}-${section.topics[0].id}`,
                    ),
                );
                courseTreeState.setSelectedTopic("right_topic-" + section.topics[0].id);
                return;
            }

            courseTreeState.setSelectedTopic(
                "right_topic-" + relatedTopic.toString().split("-")[1],
            );
        }
    };

    const styles = disciplineTreeViewStyles();

    return (
        <ControlledTreeEnvironment<TreeItemData>
            ref={environment}
            viewState={{
                ["course-structure-tree"]: {
                    expandedItems: courseTreeState.expandedItems,
                    selectedItems: selectedItems,
                },
                ["control-materials-tree"]: {
                    expandedItems: courseTreeState.expandedItems,
                    selectedItems: selectedItems,
                },
            }}
            onExpandItem={handleExpandItem}
            onSelectItems={(selectedItems) => {
                setSelectedItems(
                    selectedItems.filter(
                        (item) => items[item].canSelect === undefined || items[item].canSelect,
                    ),
                );
            }}
            // onRenameItem={async (item, newName) => {
            //     await item.data.onEdit?.({ newName });
            // }}
            getItemTitle={(item) => item.data.title}
            items={items}
            defaultInteractionMode={InteractionMode.ClickItemToExpand}
            canDragAndDrop={true}
            canReorderItems={false}
            canDropOnFolder={true}
            canDrag={(items) => {
                return items.every((item) => item.data.itemType === TreeItemType.Generator);
            }}
            canDropAt={(itms, target) => {
                const first =
                    target.targetType === "item" &&
                    environment.current?.items[target.targetItem].data.itemType ===
                        TreeItemType.Task;

                const second =
                    target.targetType === "between-items" &&
                    environment.current?.items[target.parentItem].data.itemType ===
                        TreeItemType.Task;

                return first || second;
            }}
            onDrop={(items, target) => {
                let targetId = -1;

                if (target.targetType === "item") {
                    targetId = Number(target.targetItem.toString().split("-")[1]);
                } else if (target.targetType === "between-items") {
                    targetId = Number(target.parentItem.toString().split("-")[1]);
                }

                items.forEach((item) => {
                    const generatorId = Number(item.index.toString().split("-")[1]);
                    apiActions.create.taskGenerator(1, targetId, generatorId);
                });
            }}
            {...disciplineTreeRenderers}
        >
            <Box className={styles.root}>
                <Box className={styles["column"]}>
                    <h3 className={styles.header}>Структура курса</h3>
                    <Block className={styles.content}>
                        <Tree treeId={"course-structure-tree"} rootItem={"root_left"} />
                    </Block>
                </Box>
                <Box className={styles.column}>
                    <h3 className={styles.header}>Контрольно-измерительные материалы</h3>
                    <Block className={styles.content}>
                        <Tree
                            treeId={"control-materials-tree"}
                            rootItem={courseTreeState.selectedTopic}
                        />
                    </Block>
                    <Block className={styles.courseVariants}>
                        <CourseVariantList courseTreeState={courseTreeState} />
                    </Block>
                </Box>
                <Tooltip id="tree-node-button" />
            </Box>
            <Tooltip
                style={{ backgroundColor: "var(--colors-red-light-9)" }}
                id="input-field-error"
            />
            <GenerationPopup
                accept={async (e, vc) => {
                    if (taskId == null) return;
                    await apiActions.create.generation(taskId, { variants_count: vc });
                    router.push("/results/" + taskId);
                }}
            />
        </ControlledTreeEnvironment>
    );
});

export default DisciplineTreeView;
