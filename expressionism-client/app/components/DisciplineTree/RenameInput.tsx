import { sva } from "@/styled-system/css";
import { Check, CircleAlert, XIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { TreeItem } from "react-complex-tree";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { TreeItemData } from "./mapData";

export const renameSchema = z
    .string({ required_error: "Поле не может быть пустым" })
    .trim()
    .min(1, { message: "Поле не может быть пустым" })
    .min(3, { message: "Название должно содержать не менее 3 символов" })
    .max(120, { message: "Название слишком длинное, должно содержать не более 120 символов" });

const renameInputStyles = sva({
    slots: [
        "root",
        "inputWrapper",
        "controls",
        "input",
        "dropdown",
        "submit",
        "cancel",
        "alertIcon",
    ],
    base: {
        root: {
            display: "inline-flex",
            flex: "1 0",
            gap: 3,
            justifyContent: "stretch",
            alignItems: "center",
        },
        controls: {
            display: "flex",
            gap: 2,
            flex: "1 0",
        },
        inputWrapper: {
            display: "flex",
            flex: "1 0",
            alignItems: "center",
            border: "none",
            borderRadius: "md",
            p: 2,
            bgColor: "blue.4",
            transition: "background 0.1s",
        },
        input: {
            outline: "none",
            border: "none",
            width: "full",
            height: "full",
            color: "inherit",
            fontFamily: "inherit",
            fontSize: "sm",
            bg: "transparent",
        },
        submit: {
            color: "blue.10",
            cursor: "pointer",
            _hover: {
                color: "blue.9",
            },
        },
        cancel: {
            color: "red.10",
            cursor: "pointer",
            _hover: {
                color: "red.9",
            },
        },
        dropdown: {
            outline: "1px solid #E8EAED",
            borderRadius: "md",
            background: "slate.1",
            boxShadow: "sm",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "sm",
            px: 2,
            maxW: "100px",
            minW: "50px",
            "& option": {
                h: 4,
            },
        },
        alertIcon: { visibility: "hidden", color: "red.9", ml: 2 },
    },
    variants: {
        invalid: {
            true: {
                inputWrapper: { bgColor: "red.4" },
                alertIcon: { visibility: "visible" },
                submit: {
                    color: "slate.9",
                    cursor: "default",
                    _hover: {
                        color: "slate.9",
                    },
                },
            },
        },
    },
});

export interface RenameInputProps {
    item: TreeItem<TreeItemData>;
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
    inputRef: React.Ref<HTMLInputElement>;
    submitButtonRef: React.Ref<any>;
    submitButtonProps: React.HTMLProps<any>;
    formProps: React.FormHTMLAttributes<HTMLFormElement>;
}

const RenameInput = ({
    item,
    formProps,
    inputRef,
    inputProps,
    submitButtonRef,
    submitButtonProps,
}: RenameInputProps) => {
    const [validateResult, setValidateResult] = useState(renameSchema.safeParse(inputProps.value));
    const [taskType, setTaskType] = useState(item.data.taskInfo?.type.id ?? 1);

    const styles = renameInputStyles({ invalid: !validateResult.success });

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement, Element>) => {
            const currentTarget = e.currentTarget;

            requestAnimationFrame(() => {
                if (!currentTarget.contains(document.activeElement)) {
                    inputProps.onBlur?.(e);
                }
            });
        },
        [inputProps],
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        await item.data.onEdit?.({
            newName: validateResult.data,
            taskType: formData.get("task_type")?.toString() ?? undefined,
        });

        formProps.onSubmit?.(e);
    };

    return (
        <form {...formProps} onSubmit={handleSubmit} className={styles.root}>
            <span className={styles.controls} onBlur={handleBlur} tabIndex={-1}>
                <span className={styles.inputWrapper}>
                    <input
                        className={styles.input}
                        {...inputProps}
                        onBlur={() => {}}
                        ref={inputRef}
                        onChange={(e: any) => {
                            inputProps.onChange?.(e);
                            setValidateResult(renameSchema.safeParse(e.target.value));
                        }}
                    />
                    {!validateResult.success && (
                        <CircleAlert
                            className={styles.alertIcon}
                            size="16"
                            data-tooltip-id="input-field-error"
                            data-tooltip-content={
                                fromError(validateResult.error, { prefix: null }).message
                            }
                        />
                    )}
                </span>

                {item.data.taskInfo && (
                    <select
                        name="task_type"
                        className={styles.dropdown}
                        value={taskType}
                        onChange={(e) => setTaskType(Number(e.target.value))}
                    >
                        <option value={1}>ИДЗ</option>
                        <option value={2}>Контрольная работа</option>
                    </select>
                )}

                <button
                    ref={submitButtonRef}
                    {...submitButtonProps}
                    onClick={undefined}
                    className={styles.submit}
                    type="submit"
                    disabled={!validateResult.success}
                >
                    <Check size={18} />
                </button>
            </span>

            <button type="button" className={styles.cancel}>
                <XIcon size={18} />
            </button>
        </form>
    );
};

export default RenameInput;
