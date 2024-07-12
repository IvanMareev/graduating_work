"use client";

import { apiActions } from "@/app/api/actions";
import { fetcherGet } from "@/app/api/fetchers";
import { Generator } from "@/app/types/model";
import { css, sva } from "@/styled-system/css";
import { Box, Center, Flex } from "@/styled-system/jsx";
import { nanoid } from "nanoid/non-secure";
import { Button } from "primereact/button";
import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import useSWR from "swr";

const OptionLabel = ({ content }: { content: string }) => {
    return (
        <Box fontSize="md" color="fg.subtle" mb={-1}>
            {content}
        </Box>
    );
};

const editorStyles = sva({
    slots: ["root", "block"],
    base: {
        root: {
            flex: "1 0",
            bgColor: "slate.1",
            borderRadius: "md",
            boxShadow: "sm",
            p: 2,
            display: "flex",
            flexDir: "column",
            gap: 4,
            overflowY: "auto",
        },
        block: {
            display: "flex",
            flexDir: "column",
            gap: 2,
        },
    },
});

export type GeneratorOptionsEditorProps = {
    generatorId: number;
};

type Coefficient = {
    name: string;
    type: "Целое" | "Десятичное";
    min: number;
    max: number;
};

type Restrict = {
    id: string;
    rule: string;
};

export type GeneratorOptionsRef = {
    save: () => Promise<void>;
};

const variablesOptions = ["x", "y", "z", "w"];
const initialCoefOptions = ["a", "b", "c", "d", "e", "k", "m", "n", "p", "q", "r", "s", "t"];

const GeneratorOptionsEditor = forwardRef((props: GeneratorOptionsEditorProps, ref) => {
    const { data, mutate } = useSWR<Generator>(`generators/${props.generatorId}`, fetcherGet, {
        revalidateOnFocus: false,
    });

    const [taskName, setTaskName] = useState("");
    const [taskText, setTaskText] = useState("");
    const [variables, setVariables] = useState<string[]>([]);
    const [coefficients, setCoefficients] = useState<Coefficient[]>([]);
    const [coefOptions, setCoefOptions] = useState(initialCoefOptions);
    const [selectedCoefOption, setSelectedCoefOption] = useState(initialCoefOptions[0]);
    const [selectedCoef, setSelectedCoef] = useState<Coefficient | null>(null);
    const [restricts, setRestricts] = useState<Restrict[]>([]);
    const [selectedRestrict, setSelectedRestrict] = useState<Restrict | null>(null);

    const coefCm = useRef<ContextMenu>(null);
    const restrictCm = useRef<ContextMenu>(null);

    useImperativeHandle(ref, () => {
        return {
            async save() {
                await apiActions.edit.generator(1, props.generatorId, {
                    name: taskName,
                    task_text: taskText,
                    variables: JSON.stringify(variables),
                    coefficients: JSON.stringify(coefficients),
                    restricts: JSON.stringify(restricts.map((r) => r.rule)),
                });
                await mutate();
            },
        };
    }, [coefficients, mutate, props.generatorId, restricts, taskName, taskText, variables]);

    // On data loaded
    useEffect(() => {
        if (data == null) return;

        setTaskName(data.name);
        setTaskText(data.task_text || "");
        setVariables(JSON.parse(data.variables) || []);
        const loadedCoefficients = JSON.parse(data.coefficients) || [];
        setCoefficients(loadedCoefficients);
        const availableCoefficients = initialCoefOptions.filter(
            (option) => !loadedCoefficients.some((coef: any) => coef.name === option),
        );
        setCoefOptions(availableCoefficients);
        if (availableCoefficients.length > 0) setSelectedCoefOption(availableCoefficients[0]);

        const restricts = JSON.parse(data.restricts) || [];
        setRestricts(restricts.map((r: any) => ({ id: nanoid(), rule: r })));
    }, [data]);

    const styles = useMemo(() => editorStyles(), []);

    const deleteCoefFromTable = (coef: Coefficient | null) => {
        if (coef == null) return;
        setCoefficients((coefficients) => coefficients.filter((c) => c !== coef));
        setCoefOptions((options) => options.concat(coef.name).sort());
        setSelectedCoefOption(coef.name);
    };

    const coefMenuModel = [
        {
            label: "Удалить",
            icon: "pi pi-fw pi-times",
            command: () => deleteCoefFromTable(selectedCoef),
        },
    ];

    const deleteRestrictFromTable = (restrict: Restrict | null) => {
        if (restrict == null) return;
        setRestricts((restricts) => restricts.filter((r) => r !== restrict));
    };

    const restrictMenuModel = [
        {
            label: "Удалить",
            icon: "pi pi-fw pi-times",
            command: () => deleteRestrictFromTable(selectedRestrict),
        },
    ];

    const onCellEditComplete = (e: ColumnEvent) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        if (newValue == null) {
            event.preventDefault();
        } else {
            rowData[field] = newValue;
        }
    };

    const coefTypeEditor = (options: ColumnEditorOptions) => {
        return (
            <Dropdown
                value={options.rowData.type}
                onChange={(e) => {
                    options.editorCallback?.(e.value);
                }}
                defaultValue={options.value}
                options={["Целое", "Десятичное"]}
                onKeyDown={(e) => e.stopPropagation()}
            />
        );
    };

    const numberEditor = (options: ColumnEditorOptions) => {
        const isDecimal = options.rowData.type === "Десятичное";
        return (
            <InputNumber
                showButtons
                useGrouping={false}
                buttonLayout="stacked"
                value={options.value}
                inputStyle={{ width: "80px" }}
                minFractionDigits={isDecimal ? 1 : undefined}
                maxFractionDigits={isDecimal ? 3 : undefined}
                min={options.field === "max" ? options.rowData.min : undefined}
                max={options.field === "min" ? options.rowData.max : undefined}
                onValueChange={(e: InputNumberValueChangeEvent) =>
                    options.editorCallback?.(e.value)
                }
            />
        );
    };

    return (
        <Box className={styles.root}>
            {data == null ? (
                <Center w="full" h="full">
                    <ProgressSpinner />
                </Center>
            ) : (
                <>
                    <div className={styles.block}>
                        <OptionLabel content="Название" />
                        <InputText
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Введите название задания"
                        />
                    </div>
                    <div className={styles.block}>
                        <OptionLabel content="Сопровождающий текст" />
                        <InputText
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            placeholder="Например, Вычислить:"
                        />
                    </div>
                    {/* <div className={styles.block}>
                        <OptionLabel content="Переменные" />
                        <MultiSelect
                            value={variables}
                            onChange={(e) => setVariables(e.value)}
                            options={variablesOptions}
                            placeholder="Выберите переменные"
                        />
                    </div> */}

                    <div className={styles.block}>
                        <OptionLabel content="Коэффициенты" />
                        <Flex gap={2}>
                            <Dropdown
                                className={css({ flex: "1 0" })}
                                value={selectedCoefOption}
                                onChange={(e) => setSelectedCoefOption(e.value)}
                                options={coefOptions}
                                disabled={coefOptions.length === 0}
                            />
                            <Button
                                size="small"
                                label="Добавить"
                                severity="secondary"
                                disabled={coefOptions.length === 0}
                                onClick={(e) => {
                                    setCoefficients((coefficients) =>
                                        coefficients.concat({
                                            name: selectedCoefOption,
                                            type: "Целое",
                                            min: -10,
                                            max: 10,
                                        }),
                                    );

                                    setCoefOptions((options) => {
                                        const idx = options.indexOf(selectedCoefOption);
                                        const opts = options.filter((_, i) => i !== idx);
                                        if (opts.length > 0) setSelectedCoefOption(opts[0]);
                                        return opts.sort();
                                    });
                                }}
                            />
                        </Flex>
                        <DataTable
                            value={coefficients}
                            size="small"
                            editMode="cell"
                            showGridlines
                            emptyMessage="Коэффициентов нет"
                            onContextMenu={(e) => coefCm.current?.show(e.originalEvent)}
                            // @ts-ignore
                            contextMenuSelection={selectedCoef}
                            onContextMenuSelectionChange={(e) => setSelectedCoef(e.value)}
                        >
                            <Column field="name" header="Имя"></Column>
                            <Column
                                field="type"
                                header="Тип"
                                editor={(options) => coefTypeEditor(options)}
                                onCellEditComplete={onCellEditComplete}
                            ></Column>
                            <Column
                                field="min"
                                header="От"
                                editor={(options) => numberEditor(options)}
                                onCellEditComplete={onCellEditComplete}
                                align={"center"}
                            ></Column>
                            <Column
                                field="max"
                                header="До"
                                editor={(options) => numberEditor(options)}
                                onCellEditComplete={onCellEditComplete}
                                align={"center"}
                            ></Column>
                        </DataTable>
                        <ContextMenu
                            model={coefMenuModel}
                            ref={coefCm}
                            onHide={() => setSelectedCoef(null)}
                        />
                    </div>

                    <div className={styles.block}>
                        <OptionLabel content="Ограничения" />
                        <DataTable
                            value={restricts}
                            size="small"
                            editMode="cell"
                            showGridlines
                            emptyMessage="Ограничений нет"
                            onContextMenu={(e) => restrictCm.current?.show(e.originalEvent)}
                            // @ts-ignore
                            contextMenuSelection={selectedRestrict}
                            onContextMenuSelectionChange={(e) => setSelectedRestrict(e.value)}
                        >
                            <Column header="№" body={(_, options) => options.rowIndex + 1}></Column>
                            <Column
                                field="rule"
                                header="Ограничение"
                                body={(restrict) =>
                                    restrict.rule === "" ? "Введите ограничение" : restrict.rule
                                }
                                editor={(options) => {
                                    return (
                                        <InputText
                                            value={options.value}
                                            onChange={(e) =>
                                                options.editorCallback?.(e.target.value)
                                            }
                                        />
                                    );
                                }}
                                onCellEditComplete={onCellEditComplete}
                            ></Column>
                        </DataTable>
                        <Button
                            label="Новое ограничение"
                            severity="secondary"
                            onClick={(e) => {
                                setRestricts((restricts) =>
                                    restricts.concat({ id: nanoid(), rule: "" }),
                                );
                            }}
                        />
                        <ContextMenu
                            model={restrictMenuModel}
                            ref={restrictCm}
                            onHide={() => setSelectedRestrict(null)}
                        />
                    </div>
                </>
            )}
        </Box>
    );
});

GeneratorOptionsEditor.displayName = "GeneratorOptionsEditor";

export default GeneratorOptionsEditor;
