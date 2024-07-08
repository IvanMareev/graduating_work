import { DropdownChangeEvent } from "primereact/dropdown";
import { ChangeEvent, useState } from "react";
import { NodeProps, useStore } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { DropdownField, InputField } from "./fields";

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

const SubstitutionNode = (props: NodeProps) => {
    const nodes = useStore((s) => s.getNodes());
    const setNodes = useStore((s) => s.setNodes);
    const [symbol, setSymbol] = useState(props.data.variable);
    const [sourceExpr, setSourceExpr] = useState(props.data.sourceExpression);
    const [substituteExpr, setSubstituteExpr] = useState(props.data.substituteExpression);

    const handleSymbolChange = (e: DropdownChangeEvent) => {
        setSymbol(e.value);
        setNodes(
            nodes.map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        variable: e.value,
                    };
                }
                return node;
            }),
        );
    };

    const handleSourceExpressionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSourceExpr(e.target.value);
        setNodes(
            nodes.map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        sourceExpression: e.target.value,
                    };
                }
                return node;
            }),
        );
    };

    const handleSubstituteExpressionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSubstituteExpr(e.target.value);
        setNodes(
            nodes.map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        substituteExpression: e.target.value,
                    };
                }
                return node;
            }),
        );
    };

    return (
        <BaseNode title="Подстановка" color="orange" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="source-expression" label="В выражение">
                <InputField
                    id={"1"}
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
                    id={"2"}
                    value={substituteExpr}
                    placeholder="Введите выражение"
                    onChange={handleSubstituteExpressionChange}
                />
            </InputHandle>
        </BaseNode>
    );
};

export default SubstitutionNode;
