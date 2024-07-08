import { css, cx } from "@/styled-system/css";
import { Box } from "@/styled-system/jsx";
import { ChevronRight } from "lucide-react";
import { TreeRenderProps } from "react-complex-tree";
import { TreeNodeButton } from "../DisciplineTree/TreeNodeButton";
import RenameInput from "./RenameInput";
import { TreeItemData } from "./mapData";
import { treeRenderersStyles } from "./styles";

const styles = treeRenderersStyles();

const disciplineTreeRenderers: TreeRenderProps<TreeItemData> = {
    renderTreeContainer: (props) => <div {...props.containerProps}>{props.children}</div>,
    renderItemsContainer: (props) => <ul {...props.containerProps}>{props.children}</ul>,
    renderItemArrow: ({ item, context }) =>
        item.isFolder ? (
            <Box w="18px">
                <ChevronRight
                    className={css({ transition: "transform 0.1s" })}
                    size={18}
                    style={{
                        transform: context.isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                        cursor: context.isExpanded ? "default" : "pointer",
                    }}
                    {...(context.arrowProps as any)}
                />
            </Box>
        ) : (
            <Box w="18px"></Box>
        ),

    renderItemTitle: (props) => <span className={styles.title}>{props.title}</span>,

    renderRenameInput: RenameInput,

    // renderDragBetweenLine: ({ draggingPosition, lineProps }) => (
    //     <div
    //         {...lineProps}
    //         style={{
    //             top:
    //                 draggingPosition.targetType === "between-items" &&
    //                 draggingPosition.linePosition === "top"
    //                     ? "0px"
    //                     : draggingPosition.targetType === "between-items" &&
    //                         draggingPosition.linePosition === "bottom"
    //                       ? "-4px"
    //                       : "-2px",
    //             left: `${(draggingPosition.depth + 1) * 28}px`,
    //         }}
    //         className={styles.betweenLine}
    //     />
    // ),

    renderItem: (props) => {
        const isAction = !!props.item.data.isAction;

        const renderIcon = () => {
            return <Box w="18px">{props.item.data.icon && <props.item.data.icon size={18} />}</Box>;
        };

        let itemContent = (
            <>
                {renderIcon()}
                {props.title}
            </>
        );

        if (!props.context.isRenaming) {
            itemContent = (
                <div className={styles.actionWrapper} onClick={props.item.data.action}>
                    {itemContent}
                </div>
            );
        }

        return (
            <li
                className={cx(isAction ? styles.action : null)}
                {...(props.context.itemContainerWithChildrenProps as any)}
            >
                <div
                    className={cx(
                        styles.item,
                        props.context.isSelected || props.context.isDraggingOver
                            ? styles.selected
                            : null,
                    )}
                    style={{ marginLeft: `${props.depth * 28}px` }}
                    {...(props.context.itemContainerWithoutChildrenProps as any)}
                    {...(props.context.interactiveElementProps as any)}
                >
                    {props.arrow}
                    {itemContent}

                    {!props.context.isRenaming && props.item.data.extra && (
                        <span className={styles.extra}>
                            {props.item.data.extra.map((extra, i) => (
                                <TreeNodeButton
                                    key={i}
                                    {...extra}
                                    onClick={(e: any) => {
                                        extra.onClick?.(props.context, e);
                                    }}
                                />
                            ))}
                        </span>
                    )}
                </div>
                {props.children}
            </li>
        );
    },
};

export default disciplineTreeRenderers;
