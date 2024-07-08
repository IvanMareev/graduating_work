import { sva } from "@/styled-system/css";

const boxStyles = sva({
    slots: ["boxRoot", "boxHeader", "box"],
    base: {
        boxRoot: {
            display: "flex",
            flexDir: "column",
            gap: 1,
            w: "full",
            h: "full",
        },
        boxHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 2,
            px: 2,
            "& span": {
                color: "fg.subtle",
                fontSize: "sm",
            },
            cursor: "default",
        },
        box: {
            flex: "1 1 0",
            bgColor: "slate.1",
            borderRadius: "md",
            boxShadow: "sm",
            p: 2,
            display: "flex",
            flexDir: "column",
            gap: 2,
            minH: "0",
        },
    },
})();

export { boxStyles };
