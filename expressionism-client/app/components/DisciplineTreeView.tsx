"use client";

import { css } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";
import React, { useCallback, useRef, useState } from "react";
import Block from "./Block";
import DisciplineTree, { TreeType } from "./DisciplineTree";
import { Tooltip } from "react-tooltip";
import { TreeApi } from "react-arborist";
import { Child } from "@/app/components/DisciplineTree/types";
import CourseVariantList from "./CourseVariantList";

const DisciplineTreeView = () => {
    const [courseVariant, setCourseVariant] = useState<number | undefined>(undefined);

    const treeRefLeft = useRef<TreeApi<Child>>(null);
    const treeRefRight = useRef<TreeApi<Child>>(null);

    let isNodeToggled = false;

    const onVariantChanged = useCallback((variantId: number) => {
        setCourseVariant(variantId);
    }, []);

    return (
        <Flex display="flex" gap={4} borderRadius={16} w="full" h="full" padding={4} bgColor="slate.4">
            <Flex
                boxSizing="border-box"
                flex="1 0 50%"
                gap={2}
                direction="column"
                alignItems="stretch"
                maxW="calc(50% - 8px)"
            >
                <h3 className={css({ fontSize: "xl" })}>Структура курса</h3>
                <Block
                    className={css({
                        flex: "1",
                        flexBasis: 0,
                        pr: 1,
                        boxShadow: "sm",
                        overflowX: "visible",
                        overflowY: "auto",
                    })}
                >
                    <DisciplineTree
                        ref={treeRefLeft}
                        treeType={TreeType.CourseStructure}
                        onToggle={(id) => {
                            if (isNodeToggled) return;

                            isNodeToggled = true;

                            const tree1 = treeRefLeft.current;
                            const tree2 = treeRefRight.current;

                            if (tree1 !== null && tree2 !== null) {
                                if (tree1.isOpen(id)) {
                                    tree1.closeAll();
                                    tree1.open(id);
                                    tree1.openParents(id);

                                    tree2.closeAll();
                                    tree2.open(id);
                                    tree2.openParents(id);
                                } else {
                                    tree2.close(id);
                                    tree1.close(id);
                                }
                            }

                            isNodeToggled = false;
                        }}
                    />
                </Block>
            </Flex>
            <Flex
                boxSizing="border-box"
                flex="1 0 50%"
                gap={2}
                direction="column"
                alignItems="stretch"
                maxW="calc(50% - 8px)"
            >
                <h3 className={css({ fontSize: "xl" })}>Контрольно-измерительные материалы</h3>
                <Block
                    className={css({
                        flex: "1 0",
                        flexBasis: 0,
                        minH: 0,
                        pr: 1,
                        boxShadow: "sm",
                        overflowY: "auto",
                        overflowX: "visible",
                    })}
                >
                    <DisciplineTree
                        ref={treeRefRight}
                        treeType={TreeType.ControlMaterials}
                        courseVariantId={courseVariant}
                        onToggle={(id) => {
                            if (isNodeToggled) return;

                            isNodeToggled = true;

                            const tree1 = treeRefLeft.current;
                            const tree2 = treeRefRight.current;

                            if (tree1 !== null && tree2 !== null) {
                                if (tree2.isOpen(id)) {
                                    tree2.closeAll();
                                    tree2.open(id);
                                    tree2.openParents(id);

                                    if (id.split("-").length < 3) {
                                        tree1.closeAll();
                                        tree1.open(id);
                                        tree1.openParents(id);
                                    }
                                } else {
                                    tree2.close(id);
                                    tree1.close(id);
                                }
                            }

                            isNodeToggled = false;
                        }}
                    />
                </Block>
                <Block className={css({ boxShadow: "sm" })} padding={2}>
                    <CourseVariantList
                        onVariantChanged={onVariantChanged}
                    />
                </Block>
            </Flex>
            <Tooltip id="tree-node-button" />
        </Flex>
    );
};

export default DisciplineTreeView;
