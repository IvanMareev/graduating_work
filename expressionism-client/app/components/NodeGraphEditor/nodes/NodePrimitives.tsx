import { cx, sva } from "@/styled-system/css";
import { Box } from "@/styled-system/jsx";
import React, { useCallback, useMemo } from "react";
import { Connection, Handle, NodeProps, Position, useNodeId, useStore } from "@xyflow/react";

export type HandleProps = {
    handleId: string;
    className?: string;
    label?: string;
    children?: React.ReactNode;
    hideHandle?: boolean;
    onConnect?: (connection: Connection) => void;
};

const InputHandle = (props: HandleProps) => {
    const nodeId = useNodeId();
    const handleId = `node-${nodeId}_handle-${props.handleId}`;
    const isConnected = useStore(
        useCallback((state) => state.edges.find((e) => e.targetHandle === handleId), [handleId]),
    );

    const handle = !props.hideHandle && (
        <Handle
            type={"target"}
            id={handleId}
            position={Position.Left}
            style={{
                left: "-16px",
                width: "9px",
                height: "9px",
                border: "none",
                outline: "2px solid var(--colors-slate-light-9)",
                background: "var(--colors-slate-light-1)",
            }}
            onConnect={props.onConnect}
        />
    );

    return (
        <>
            {props.label && (
                <Box fontSize="md" position="relative">
                    {props.label}
                    {handle}
                </Box>
            )}
            <Box
                position="relative"
                display="flex"
                alignItems="center"
                gap={1}
                gridColumn={props.label ? "span 1" : "span 2"}
                className={props.className}
            >
                {!isConnected && props.children}
            </Box>
        </>
    );
};

const OutputHandle = (props: HandleProps) => {
    const nodeId = useNodeId();
    return (
        <>
            <Box
                minH="20px"
                w="full"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gridColumn="span 2"
                gap={1}
                className={props.className}
            >
                {props.children && <Box w="full">{props.children}</Box>}
                {props.label && <Box fontSize="md">{props.label}</Box>}
                <Handle
                    type={"source"}
                    id={`node-${nodeId}_handle-${props.handleId}`}
                    position={Position.Right}
                    style={{
                        right: "-16px",
                        border: "none",
                        width: "9px",
                        height: "9px",
                        outline: "2px solid var(--colors-slate-light-9)",
                        background: "var(--colors-slate-light-1)",
                    }}
                />
            </Box>
        </>
    );
};

const baseNodeStyles = sva({
    slots: ["root", "header", "content"],
    className: "node",
    base: {
        root: {
            display: "flex",
            flexDir: "column",
            borderRadius: "md",
            boxShadow: "md",
            boxSizing: "border-box",
            outline: "1px solid token(colors.slate.9)",
        },
        header: {
            bgColor: "sky.8",
            px: 3,
            py: 1.5,
            color: "slate.1",
            fontSize: "xl",
            boxShadow: "sm",
            borderTopRadius: "5px",
        },
        content: {
            display: "grid",
            background: "slate.2",
            borderBottomRadius: "md",
            alignItems: "center",
            py: 3,
            px: 3,
            gridColumnGap: 2,
            gridRowGap: 2,
            minW: "240px",
            gridTemplateColumns: "auto auto",
            gridAutoRows: "minmax(20px, auto)",
        },
    },
    variants: {
        selected: {
            true: {
                root: {
                    outline: "2px solid token(colors.slate.10)",
                },
            },
        },
        color: {
            blue: {
                header: {
                    bgColor: "sky.8",
                },
            },
            orange: {
                header: {
                    bgColor: "orange.8",
                },
            },
            green: {
                header: {
                    bgColor: "green.8",
                },
            },
            violet: {
                header: {
                    bgColor: "violet.8",
                },
            },
            red: {
                header: {
                    bgColor: "red.8",
                },
            },
            yellow: {
                header: {
                    bgColor: "yellow.8",
                },
            },
            lime: {
                header: {
                    bgColor: "lime.8",
                },
            },
        },
    },
    defaultVariants: {
        color: "blue",
        selected: false,
    },
});

type BaseNodeProps = NodeProps & {
    title: string;
    color?: "blue" | "orange" | "green" | "violet" | "red" | "yellow" | "lime" | undefined;
    className?: string;
    children?: React.ReactNode;
};

type NodeContextProps = {
    nodeProps: NodeProps;
};

const NodeContext = React.createContext<NodeContextProps | undefined>(undefined);

const BaseNode = (props: BaseNodeProps) => {
    const styles = useMemo(
        () => baseNodeStyles({ selected: props.selected, color: props.color }),
        [props.color, props.selected],
    );

    return (
        <div className={cx(styles.root, props.className)}>
            <div className={styles.header}>{props.title}</div>
            <NodeContext.Provider value={{ nodeProps: props }}>
                <div className={styles.content}>{props.children}</div>
            </NodeContext.Provider>
        </div>
    );
};

const useNodeContext = () => {
    const context = React.useContext(NodeContext);

    if (!context) {
        throw new Error("This component must be used within a <BaseNode> component.");
    }

    return context;
};

export { BaseNode, InputHandle, OutputHandle, useNodeContext };
