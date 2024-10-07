import { NodeProps } from "@xyflow/react";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { ExpressionismNode, OPERATION_NODES } from "./types";

const ExpandNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    return (
        <BaseNode title={ExpandNode.label} color="violet" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="expression" label="Выражение"></InputHandle>
        </BaseNode>
    );
};

ExpandNode.label = "Раскрыть скобки";
ExpandNode.group = OPERATION_NODES;

export default ExpandNode;
