import { css, cx } from "@/styled-system/css";
import { Dropdown, DropdownProps } from "primereact/dropdown";

const DropdownField = (props: DropdownProps) => {
    return (
        <Dropdown
            className={cx(
                "nodrag",
                css({
                    w: "full",
                    "& .p-dropdown-label": { fontSize: "18px!", p: "6.5px 12px !" },
                    "& .p-dropdown-trigger": { w: "32px!" },
                }),
                props.className,
            )}
            {...props}
        />
    );
};

export { DropdownField };
