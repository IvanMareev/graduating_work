import { sva } from "@/styled-system/css";

const disciplineTreeViewStyles = sva({
    slots: ["root", "column", "header", "content", "courseVariants"],
    base: {
        root: {
            display: "flex",
             justifyContent: "center",
            gap: 4,
            borderRadius: 16,
            w: "full",
            h: "full",
            p: 4,
            bgColor: "slate.4",
            width: "100%"
        },
        column: {
            boxSizing: "border-box",
            display: "flex",
            flex: "1 0 50%",
            gap: 2,
            flexDir: "column",
            justifyContent: "stretch",
            alignItems: "stretch",
            maxW: "calc(50% - 8px)",
            direction: "column",
        },
        header: {
            fontSize: "xl",
        },
        content: {
            flex: "1 0",
            flexBasis: 0,
            pr: 1,
            pt: 1.5,
            boxShadow: "sm",
            overflowX: "visible",
            overflowY: "auto",
        },
        courseVariants: {
            p: "2",
            boxShadow: "sm",
        },
    },
});

const treeRenderersStyles = sva({
    className: "tr-renderer",
    slots: ["item", "title", "action", "actionWrapper", "extra", "selected", "betweenLine"],
    base: {
        item: {
            display: "flex",
            gap: 2.5,
            alignItems: "center",
            py: 2,
            pr: 2,
            fontSize: "xl",
            fontWeight: "medium",
            _hover: {
                "& .tr-renderer__extra": {
                    opacity: 1,
                },
            },
            "& .tr-renderer__extra": {
                opacity: 0,
                transition: "opacity 0.1s",
            },
        },
        title: {
            textOverflow: "ellipsis",
            textWrap: "nowrap",
            fontSize: "sm",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
        action: {
            color: "blue.10",
            _hover: {
                color: "blue.9",
            },
            "& .tr-renderer__actionWrapper": {
                cursor: "pointer",
            },
        },
        actionWrapper: {
            display: "inherit",
            gap: "inherit",
            alignItems: "inherit",
            minW: 0,
        },
        extra: {
            display: "flex",
            gap: 2,
            ml: "auto",
        },
        // TODO: Паддинг слева бы, а то выделенный элемент с бекграундом не очень смотрится
        selected: {
            bgColor: "blue.3",
            borderRadius: "md",
            "& .tr-renderer__extra": {
                opacity: 1,
            },
        },
        betweenLine: {
            position: "absolute",
            right: "8px",
            height: "2px",
            bgColor: "blue.10",
        }
    },
});

export { disciplineTreeViewStyles, treeRenderersStyles };
