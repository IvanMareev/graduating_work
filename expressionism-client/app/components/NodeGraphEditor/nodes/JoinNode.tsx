import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { DropdownChangeEvent } from "primereact/dropdown";
import { useState } from "react";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { DropdownField } from "./fields";
import { ExpressionismNode, MAIN_NODES } from "./types";

const operators = ["+", "-", "*", "/"];

const JoinNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    const [operator, setOperator] = useState(props.data.operator);
    const [expand, setExpand] = useState<boolean>(props.data.expand);
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

    const handleExpandChange = (e: CheckboxChangeEvent) => {
        setExpand(e.target.checked);
        setNodes(
            getNodes().map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        expand: e.target.checked,
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
            {operator === "*" && (
                <InputHandle handleId="expand" hideHandle>
                    <Checkbox
                        inputId={props.id + "-expand"}
                        checked={expand}
                        onChange={handleExpandChange}
                    />
                    <label htmlFor={props.id + "-expand"}>Раскрыть скобки</label>
                </InputHandle>
            )}
        </BaseNode>
    );
};

JoinNode.label = "Соединение";
JoinNode.group = MAIN_NODES;
JoinNode.data = { operator: "+", expand: false };

export default JoinNode;
