import { Box } from "@/styled-system/jsx";
import { ChevronRight } from "lucide-react";
import { NodeRendererProps, Tree } from "react-arborist";
import { Child, TreeNodeType } from "./types";
import { sva } from "@/styled-system/css";
import React from "react";

const treeNodeStyles = sva({
    className: "tree-node",
    slots: ["root", "label", "chevron", "handle", "control", "extra"],
    base: {
        root: {
            display: "flex",
            gap: 1,
            alignItems: "center",
            minW: 0,
            ml: 2,
            pr: 2,
            fontWeight: "medium",
        },
        control: {
            display: "flex",
            flex: "1 0",
            gap: 3,
            alignItems: "center",
            borderRadius: "sm",
            minW: 0,
            p: 2,
            transition: "background-color 0.1s",
            _hover: {
                background: "slate.3",
                "& .tree-node__extra": {
                    opacity: 1,
                },
            },
            "& .tree-node__extra": {
                opacity: 0,
            },
        },
        handle: {
            display: "flex",
            gap: 3,
            alignItems: "center",
            minW: 0,
        },
        chevron: {
            transition: "transform 0.1s, background 0.1s",
            cursor: "pointer",
            transform: "rotate(0deg)",
            _hover: {
                borderRadius: "sm",
                background: "slate.4",
            },
        },
        label: {
            textOverflow: "ellipsis",
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
        },
        extra: {
            display: "flex",
            gap: 2,
            ml: "auto",
            transition: "opacity 0.1s",
        },
    },
    variants: {
        nodeType: {
            normal: {},
            action: {
                root: {
                    color: "accent.default",
                },
                handle: {
                    cursor: "pointer",
                    _hover: {
                        color: "accent.8",
                        _active: {
                            color: "accent.11",
                        },
                    },
                },
                control: {
                    _hover: {
                        background: "unset",
                    },
                },
            },
        },
        isChecked: {
            true: {
                chevron: {
                    transform: "rotate(90deg)",
                },
            },
        },
        isSelected: {
            true: {
                control: {
                    background: "blue.3",
                    _hover: {
                        background: "blue.3",
                    },
                    "& .tree-node__extra": {
                        opacity: 1,
                    },
                },
            },
        },
    },
    defaultVariants: {
        nodeType: "normal",
    },
});

const taskDropPlaceholderStyles = sva({
    slots: ["root", "label"],
    base: {
        root: {
            display: "flex",
            flex: "1 0",
            justifyContent: "center",
            alignItems: "center",
            border: "2px dashed token(colors.blue.7)",
            borderRadius: "md",
            h: "32px",
            mr: 2,
            bgColor: "blue.2",
        },
        label: {
            textOverflow: "ellipsis",
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
        },
    },
});

const TreeNode: React.ElementType<NodeRendererProps<Child>> = ({ node, style, dragHandle }) => {
    const treeStyles = React.useMemo(
        () =>
            treeNodeStyles({
                nodeType: node.data.isAction ? "action" : "normal",
                isChecked: node.isOpen,
                isSelected: node.isSelected,
            }),
        [node.data.isAction, node.isOpen, node.isSelected],
    );

    node.isDraggable = node.data.type === TreeNodeType.Generator;

    if (node.data.isAction && node.isSelected) {
        node.deselect();
    }

    if (node.data.type === TreeNodeType.TaskDropPlaceholder) {
        const placeholderStyles = taskDropPlaceholderStyles();
        return (
            <Box style={style} display="flex" alignItems="center" height="38px">
                <Box className={placeholderStyles.root}>
                    <span className={placeholderStyles.label}>{node.data.name}</span>
                </Box>
            </Box>
        );
    }

    return (
        <Box className={treeStyles.root} style={style}>
            {node.isInternal && (
                <ChevronRight
                    className={treeStyles.chevron}
                    size={18}
                    onClick={() => {
                        node.toggle();
                    }}
                />
            )}
            <Box className={treeStyles.control}>
                {node.isLeaf && <Box width="10px" />}
                <Box ref={dragHandle} className={treeStyles.handle} onClick={node.data.action}>
                    <Box minW="18px">{<node.data.icon size={18} />}</Box>
                    <span className={treeStyles.label}>{node.data.name}</span>
                </Box>
                <Box className={treeStyles.extra}>{node.data.extra}</Box>
            </Box>
        </Box>
    );
};

export default TreeNode;
