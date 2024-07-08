import { ReactNode } from "react";
import { css, cx } from "@/styled-system/css";
import { SystemStyleObject } from "@/styled-system/types";

interface BlockProps {
    className?: string;
    padding?: number;
    borderRadius?: number;
    children?: ReactNode;
    css?: SystemStyleObject;
}

const Block: React.FC<BlockProps> = ({ className, padding = 3, borderRadius = 8, children, css: cssProp = {} }) => {
    const style = css(
        {
            borderRadius: borderRadius,
            padding: padding,
            backgroundColor: "slate.1",
            "& ::-webkit-scrollbar": {
                width: "8px",
            },
            "& ::-webkit-scrollbar-track": {
                background: "#f1f1f1",
            },
            "& ::-webkit-scrollbar-thumb": {
                borderRadius: "4px",
                background: "#999",
            },
            "& ::-webkit-scrollbar-thumb:hover": {
                background: "#555",
            },
            "& *": {
                scrollbarWidth: "thin",
                scrollbarColor: "#999 #f1f1f1",
            },
        },
        cssProp,
    );

    return <div className={cx(style, className)}>{children}</div>;
};

export default Block;
