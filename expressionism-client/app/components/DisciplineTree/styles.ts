import { sva } from "@/styled-system/css";

const disciplineTreeViewStyles = sva({
    slots: ["root", "column", "header", "content", "courseVariants"],
    base: {
        root: {
            display: "flex",
            justifyContent: "center",
            gap: 4,
            borderRadius: "sm",
            w: "full",
            h: "full",
            p: 4,
            bgColor: "gray.1",
            border: "1px solid",
            borderColor: "gray.4",
        },
        column: {
            display: "flex",
            flex: "1",
            flexDir: "column",
            gap: 3,
            backgroundColor: "white",
            borderRadius: "sm",
            border: "1px solid",
            borderColor: "gray.4",
            boxShadow: "sm",
            overflow: "hidden",
        },
        header: {
            fontSize: "lg",
            fontWeight: "semibold",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "gray.3",
            bgColor: "gray.2",
        },
        content: {
            flex: "1",
            overflowY: "auto",
            p: 3,
        },
        courseVariants: {
            p: 3,
            bgColor: "gray.2",
            borderTop: "1px solid",
            borderColor: "gray.3",
        },
    },
});

const treeRenderersStyles = sva({
    className: "tr-renderer",
    slots: ["item", "title", "action", "actionWrapper", "extra", "selected", "betweenLine"],
    base: {
        item: {
            display: "flex",
            alignItems: "center",
            gap: 3,
            p: 2,
            fontSize: "sm",
            fontWeight: "medium",
            borderRadius: "sm",
            transition: "background 0.2s",
            _hover: {
                bgColor: "gray.2",
                "& .tr-renderer__extra": {
                    opacity: 1,
                },
            },
            "& .tr-renderer__extra": {
                opacity: 0,
                transition: "opacity 0.2s",
            },
        },
        title: {
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "sm",
            fontWeight: "normal",
            color: "gray.11",
        },
        action: {
            fontSize: "xs",
            color: "blue.9",
            _hover: {
                color: "blue.7",
            },
        },
        actionWrapper: {
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
        },
        extra: {
            display: "flex",
            gap: 2,
            ml: "auto",
            alignItems: "center",
        },
        selected: {
            bgColor: "blue.2",
            border: "1px solid",
            borderColor: "blue.5",
            "& .tr-renderer__extra": {
                opacity: 1,
            },
        },
        betweenLine: {
            position: "absolute",
            right: "8px",
            height: "2px",
            bgColor: "blue.6",
        }
    },
});

export { disciplineTreeViewStyles, treeRenderersStyles };
