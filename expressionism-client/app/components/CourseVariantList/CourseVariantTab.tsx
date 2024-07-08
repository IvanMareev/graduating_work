import { sva } from "@/styled-system/css";
import { CircleAlert } from "lucide-react";
import React from "react";
import { z } from "zod";

const courseVariantSchema = z
    .string()
    .trim()
    .min(1, { message: "Название варианта курса не должно быть пустым" })
    .max(80, { message: "Название варианта курса слишком длинное!" });

const tabStyles = sva({
    slots: ["tab", "input", "label", "alertIcon"],
    base: {
        tab: {
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "md",
            maxW: "32",
            px: 3,
            textAlign: "center",
            fontSize: "sm",
            transition: "background-color 0.1s",
            cursor: "pointer",
            _hover: {
                bgColor: "slate.3",
                _active: {
                    bgColor: "slate.4",
                },
            },
        },
        label: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
        input: {
            display: "block",
            outline: "none",
            border: "none",
            width: "full",
            minW: "16",
            maxW: "16",
            height: "full",
            color: "inherit",
            fontFamily: "inherit",
            fontSize: "sm",
            bg: "transparent",
            // _focus: {
            //     bg: "slate.3",
            // },
        },
        alertIcon: {
            visibility: "hidden",
            color: "red.9",
        },
    },
    variants: {
        isSelected: {
            true: {
                tab: {
                    bgColor: "blue.4",
                    cursor: "default",
                    _hover: {
                        bgColor: "blue.4",
                        _active: {
                            bgColor: "blue.4",
                        },
                    },
                },
            },
        },
        isInputError: {
            true: {
                tab: {
                    bgColor: "red.4",
                    _hover: {
                        bgColor: "red.4",
                        _active: {
                            bgColor: "red.4",
                        },
                    },
                },
                alertIcon: {
                    visibility: "visible",
                },
            },
        },
    },
});

type TabProps = {
    content: string;
    onClick?: () => void;
    onSubmit?: (value: string) => void;
    onContextMenu?: any;
    selected?: boolean;
};

const Tab = React.forwardRef<HTMLLIElement | null, TabProps>(({ onSubmit, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>(props.content);
    const [validateResult, setValidateResult] = React.useState(courseVariantSchema.safeParse(props.content));
    const inputRef = React.useRef<HTMLInputElement>(null);

    let hitEscape = false;

    const handleClick = (e: any) => {
        // On single click
        if (e.detail === 1 && !props.selected) props.onClick?.();

        // On double click
        if (e.detail === 2) {
            if (isEditing) {
                return;
            }

            setIsEditing(true);
        }
    };

    const submitValue = () => {
        if (inputRef.current != null) {
            const inputValue = inputRef.current.value;
            if (inputValue === value || !validateResult.success) return;
            setValue(validateResult.data);
            onSubmit?.(validateResult.data);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        setValidateResult(courseVariantSchema.safeParse(value));

        if (hitEscape) {
            hitEscape = false;
        } else {
            submitValue();
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Escape") {
            if (inputRef.current != null) {
                hitEscape = true;
                inputRef.current.blur();
            }
        } else if (e.key === "Enter") {
            if (!validateResult.success) return;
            submitValue();
            if (inputRef.current != null) {
                inputRef.current.blur();
            }
        }
    };

    const handleChange = (e: any) => {
        setValidateResult(courseVariantSchema.safeParse(e.target.value));
    };

    const styles = tabStyles({ isSelected: props.selected, isInputError: !validateResult.success });
    return (
        <li
            ref={ref}
            className={styles.tab}
            onClick={handleClick}
            onBlur={handleBlur}
            onContextMenu={props.onContextMenu}
        >
            {!isEditing ? (
                <span
                    className={styles.label}
                    {...(value.length > 10
                        ? {
                              "data-tooltip-id": "course-variant-tooltip",
                              "data-tooltip-content": value,
                          }
                        : null)}
                >
                    {value}
                </span>
            ) : (
                <>
                    <input
                        ref={inputRef}
                        autoFocus
                        className={styles.input}
                        type="text"
                        defaultValue={value}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                    />
                    <CircleAlert
                        className={styles.alertIcon}
                        size="16"
                        data-tooltip-id="course-variant-input-field-error"
                        data-tooltip-content="Название варианта курса не должно быть пустым"
                    />
                </>
            )}
        </li>
    );
});

Tab.displayName = "Tab";

export { Tab as CourseVariantTab };

