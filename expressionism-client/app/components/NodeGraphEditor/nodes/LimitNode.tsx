import { DropdownChangeEvent } from "primereact/dropdown";
import { ChangeEvent, useCallback, useState } from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { DropdownField, InputField } from "./fields";
import { ExpressionismNode, LARGE_OPERATORS } from "./types";

const substituteVariables = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "k",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "x",
    "y",
    "z",
    "w",
];

const limitDirections = ["+-", "-", "+"];

const LimitNode: ExpressionismNode<NodeProps> = (props) => {
    const { getNodes, setNodes } = useReactFlow();

    const [limitDir, setLimitDir] = useState(props.data.limitDir);
    const [limitVariable, setLimitVariable] = useState(props.data.limitVariable);
    const [sourceExpr, setSourceExpr] = useState(props.data.sourceExpression);
    const [targetExpr, setTargetExpr] = useState(props.data.limitTarget);

    const handleSymbolChange = useCallback(
        (e: DropdownChangeEvent) => {
            setLimitVariable(e.value);
            setNodes(
                getNodes().map((node) => {
                    if (node.id === props.id) {
                        node.data = {
                            ...node.data,
                            limitVariable: e.value,
                        };
                    }
                    return node;
                }),
            );
        },
        [getNodes, props.id, setNodes],
    );

    const handleLimitChange = useCallback(
        (e: DropdownChangeEvent) => {
            setLimitDir(e.value);
            console.log(e.value);

            setNodes(
                getNodes().map((node) => {
                    if (node.id === props.id) {
                        node.data = {
                            ...node.data,
                            limitDir: e.value,
                        };
                    }

                    return node;
                }),
            );
        },
        [getNodes, props.id, setNodes],
    );

    const handleFirstExpressionChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSourceExpr(e.target.value);
            setNodes(
                getNodes().map((node) => {
                    if (node.id === props.id) {
                        node.data = {
                            ...node.data,
                            sourceExpression: e.target.value,
                        };
                    }
                    return node;
                }),
            );
        },
        [getNodes, props.id, setNodes],
    );

    const handleSecondExpressionChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setTargetExpr(e.target.value);
            setNodes(
                getNodes().map((node) => {
                    if (node.id === props.id) {
                        node.data = {
                            ...node.data,
                            limitTarget: e.target.value,
                        };
                    }
                    return node;
                }),
            );
        },
        [getNodes, props.id, setNodes],
    );

    return (
        <BaseNode title="Предел" color="red" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="source-expression" label="Выражение">
                <InputField
                    id={"1"}
                    value={sourceExpr}
                    placeholder="Введите выражение"
                    onChange={handleFirstExpressionChange}
                />
            </InputHandle>
            <InputHandle handleId="limit-variable" label="По переменной" hideHandle>
                <DropdownField
                    value={limitVariable}
                    options={substituteVariables}
                    onChange={handleSymbolChange}
                />
            </InputHandle>
            <InputHandle handleId="limit-target" label="Стремящейся к">
                <DropdownField
                    id="3"
                    value={limitDir}
                    options={limitDirections}
                    onChange={handleLimitChange}
                    style={{ maxWidth: "80px" }}
                />
                <InputField
                    id={"2"}
                    value={targetExpr}
                    placeholder="Введите выражение"
                    onChange={handleSecondExpressionChange}
                />
            </InputHandle>
        </BaseNode>
    );
};

LimitNode.label = "Предел";
LimitNode.group = LARGE_OPERATORS;
LimitNode.data = {
    limitDir: "+-",
    limitVariable: "x",
    sourceExpression: "2",
    limitTarget: "0",
};

export default LimitNode;
