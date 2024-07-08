import { DropdownChangeEvent } from "primereact/dropdown";
import { useState } from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { DropdownField } from "./fields";

const operators = ["+", "-", "*", "/"];

const JoinNode = (props: NodeProps) => {
    const [operator, setOperator] = useState(props.data.operator);
    const { getNodes, setNodes } = useReactFlow();

    const handleOperatorChange = (e: DropdownChangeEvent) => {
        setOperator(e.value);
        setNodes(
            getNodes().map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        operator: e.value,
                    };
                }

                return node;
            }),
        );
    };

    return (
        <BaseNode title="Соединение" color="orange" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="expression-1" label="Выражение 1"></InputHandle>
            <InputHandle handleId="expression-2" label="Выражение 2"></InputHandle>
            <InputHandle handleId="operator" hideHandle>
                <DropdownField
                    value={operator}
                    onChange={handleOperatorChange}
                    options={operators}
                />
            </InputHandle>
        </BaseNode>
    );
};

export default JoinNode;
