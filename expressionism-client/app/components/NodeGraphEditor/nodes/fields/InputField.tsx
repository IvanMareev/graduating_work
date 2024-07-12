import { css, cx } from "@/styled-system/css";
import { InputText } from "primereact/inputtext";

type InputFieldProps = {
    value?: string;
    placeholder?: string;
    leftElements?: React.ReactNode;
    rightElements?: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = (props: InputFieldProps) => {
    let inputField = (
        <InputText
            type="text"
            className={cx("p-inputtext-sm", "nodrag", css({ h: "42px", w: "full" }))}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
        />
    );

    if (props.leftElements || props.rightElements) {
        inputField = (
            <div className="p-inputgroup">
                {props.leftElements}
                {inputField}
                {props.rightElements}
            </div>
        );
    }

    return inputField;
};

export { InputField };
export type { InputFieldProps };
