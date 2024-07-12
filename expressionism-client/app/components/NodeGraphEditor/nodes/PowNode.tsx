import { ChangeEvent, useState } from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { InputField } from "./fields";
import { ExpressionismNode, FUNCTION_NODES } from "./types";

const PowNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    const { getNodes, setNodes } = useReactFlow();
    const [sourceExpr, setSourceExpr] = useState(props.data.sourceExpression);
    const [degree, setDegree] = useState(props.data.degree);

    const handleSourceExpressionChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    };

    const handleDegreeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDegree(e.target.value);
        setNodes(
            getNodes().map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        degree: e.target.value,
                    };
                }
                return node;
            }),
        );
    };

    return (
        <BaseNode title="Степень" color="yellow" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="source-expression" label="Основание">
                <InputField
                    value={sourceExpr}
                    placeholder="Введите выражение"
                    onChange={handleSourceExpressionChange}
                />
            </InputHandle>
            <InputHandle handleId="degree-expression" label="Показатель">
                <InputField
                    value={degree}
                    placeholder="Введите показатель степени"
                    onChange={handleDegreeChange}
                />
            </InputHandle>
        </BaseNode>
    );
};

PowNode.label = "Степень";
PowNode.group = FUNCTION_NODES;
PowNode.data = { sourceExpression: "x", degree: "2" };

export default PowNode;
