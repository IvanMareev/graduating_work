import { RecipeVariantProps, cva, cx } from "@/styled-system/css";
import { Box } from "@/styled-system/jsx";
import { confirmPopup } from "primereact/confirmpopup";
import React from "react";
import { TreeItemRenderContext } from "react-complex-tree";

const treeItemButton = cva({
    base: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        rounded: 4,
        color: "slate.9",
        transition: "color 0.1s",
    },
    variants: {
        hoverColor: {
            blue: { _hover: { color: "blue.9" } },
            red: { _hover: { color: "red.9" } },
            orange: { _hover: { color: "orange.9" } },
            green: { _hover: { color: "green.9" } },
        },
        disabled: {
            true: {
                color: "slate.8",
                _hover: { color: "slate.8" },
            },
        },
    },
    defaultVariants: {
        hoverColor: "blue",
    },
});

export interface PopoverConfig {
    title: string;
    content?: string;
    cancelAction?: () => void;
    confirmAction?: () => void;
}

export type TreeNodeButtonProps = RecipeVariantProps<typeof treeItemButton> & {
    className?: string;
    disabled?: boolean;
    icon: React.ElementType;
    tooltip?: string;
    tooltipId?: string;
    popover?: PopoverConfig;
    onClick?: (e: any) => void;
};

interface TooltipProps {
    "data-tooltip-id"?: string;
    "data-tooltip-content"?: string;
}

const popoverToggle = (event: any, popover: PopoverConfig) => {
    confirmPopup({
        target: event.currentTarget,
        message: popover.content,
        icon: "pi pi-info-circle",
        defaultFocus: "reject",
        acceptClassName: "p-button-danger",
        acceptLabel: "Удалить",
        rejectLabel: "Отмена",
        style: { width: "400px" },
        accept: popover.confirmAction,
        reject: popover.cancelAction,
    });
};

const TreeNodeButton: React.FC<TreeNodeButtonProps> = (props) => {
    const className = cx(treeItemButton(props), props.className);
    const opts: TooltipProps = {};

    if (props.tooltip) {
        opts["data-tooltip-id"] = props.tooltipId || "tree-node-button";
        opts["data-tooltip-content"] = props.tooltip;
    }

    let treeNodeButton = (
        <Box
            className={className}
            onClick={(e: any) => {
                if (props.disabled) {
                    return;
                }
                props.onClick?.(e);
                if (props.popover) {
                    popoverToggle(e, props.popover);
                }
            }}
            {...opts}
        >
            <props.icon size={16} />
        </Box>
    );

    return treeNodeButton;
};

export { TreeNodeButton };
