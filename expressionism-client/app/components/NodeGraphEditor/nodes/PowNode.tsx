import { ChangeEvent, useState } from "react";
import { NodeProps, useStore } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { InputField } from "./fields";

const PowNode = (props: NodeProps) => {
    const nodes = useStore((s) => s.getNodes());
    const setNodes = useStore((s) => s.setNodes);
    const [sourceExpr, setSourceExpr] = useState(props.data.sourceExpression);
    const [degree, setDegree] = useState(props.data.degree);

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

    const handleDegreeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDegree(e.target.value);
        setNodes(
            nodes.map((node) => {
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
                    id={"1"}
                    value={sourceExpr}
                    placeholder="Введите выражение"
                    onChange={handleSourceExpressionChange}
                />
            </InputHandle>
            <InputHandle handleId="degree-expression" label="Показатель">
                <InputField
                    id={"2"}
                    value={degree}
                    placeholder="Введите показатель степени"
                    onChange={handleDegreeChange}
                />
            </InputHandle>
        </BaseNode>
    );
};

export default PowNode;
