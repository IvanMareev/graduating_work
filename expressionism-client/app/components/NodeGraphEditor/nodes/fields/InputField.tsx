import { cx, sva } from "@/styled-system/css";
import { useState } from "react";
import { useNodeContext } from "../NodePrimitives";

const inputFieldStyles = sva({
    slots: ["root", "label", "input"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "stretch",
            gap: 1,
            boxSizing: "border-box",
        },
        label: {
            fontSize: "12px",
        },
        input: {
            border: "1px solid token(colors.slate.8)",
            outline: "none",
            borderRadius: "md",
            minW: "50px",
            width: "100%",
            h: "34px",
            fontSize: "xs",
            background: "white",
            px: 1,
            py: 0.5,
            boxSizing: "border-box",
        },
    },
})();

type InputFieldProps = {
    id: string;
    value?: string;
    label?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = (props: InputFieldProps) => {
    const [value, setValue] = useState(props.value);
    const { nodeProps } = useNodeContext();

    return (
        <div className={inputFieldStyles.root}>
            {props.label && (
                <label
                    className={inputFieldStyles.label}
                    htmlFor={`node-${nodeProps.id}_input-${props.id}`}
                >
                    {props.label}
                </label>
            )}
            <input
                className={cx(inputFieldStyles.input, "nodrag")}
                id={`node-${nodeProps.id}_input-${props.id}`}
                type="text"
                value={value}
                placeholder={props.placeholder}
                onChange={(e) => {
                    props.onChange?.(e);
                    setValue(e.target.value);
                }}
            />
        </div>
    );
};

export { InputField };
export type { InputFieldProps };
