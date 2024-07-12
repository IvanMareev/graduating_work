import { DropdownChangeEvent } from "primereact/dropdown";
import { ChangeEvent, useCallback, useState } from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { DropdownField, InputField } from "./fields";
import { ExpressionismNode, MAIN_NODES } from "./types";

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

const SubstitutionNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    const { getNodes, setNodes } = useReactFlow();
    const [symbol, setSymbol] = useState(props.data.variable);
    const [sourceExpr, setSourceExpr] = useState(props.data.sourceExpression);
    const [substituteExpr, setSubstituteExpr] = useState(props.data.substituteExpression);

    const handleSymbolChange = useCallback(
        (e: DropdownChangeEvent) => {
            setSymbol(e.value);
            setNodes(
                getNodes().map((node) => {
                    if (node.id === props.id) {
                        node.data = {
                            ...node.data,
                            variable: e.value,
                        };
                    }
                    return node;
                }),
            );
        },
        [getNodes, props.id, setNodes],
    );

    const handleSourceExpressionChange = useCallback(
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

    const handleSubstituteExpressionChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSubstituteExpr(e.target.value);
            setNodes(
                getNodes().map((node) => {
                    if (node.id === props.id) {
                        node.data = {
                            ...node.data,
                            substituteExpression: e.target.value,
                        };
                    }
                    return node;
                }),
            );
        },
        [getNodes, props.id, setNodes],
    );

    return (
        <BaseNode title="Подстановка" color="orange" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="source-expression" label="В выражение">
                <InputField
                    value={sourceExpr}
                    placeholder="Введите выражение"
                    onChange={handleSourceExpressionChange}
                />
            </InputHandle>
            <InputHandle handleId="symbol-to-substitute" label="Вместо" hideHandle={true}>
                <DropdownField
                    value={symbol}
                    options={substituteVariables}
                    onChange={handleSymbolChange}
                />
            </InputHandle>
            <InputHandle handleId="expression-to-substitute" label="Подставить">
                <InputField
                    value={substituteExpr}
                    placeholder="Введите выражение"
                    onChange={handleSubstituteExpressionChange}
                />
            </InputHandle>
        </BaseNode>
    );
};

SubstitutionNode.label = "Подстановка";
SubstitutionNode.group = MAIN_NODES;
SubstitutionNode.data = { variable: "x", sourceExpression: "", substituteExpression: "" };

export default SubstitutionNode;
