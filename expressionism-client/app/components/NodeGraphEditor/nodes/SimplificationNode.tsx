import { NodeProps } from "@xyflow/react";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { ExpressionismNode, OPERATION_NODES } from "./types";

const SimplificationNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    return (
        <BaseNode title={SimplificationNode.label} color="violet" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="expression" label="Выражение"></InputHandle>
        </BaseNode>
    );
};

SimplificationNode.label = "Упрощение";
SimplificationNode.group = OPERATION_NODES;

export default SimplificationNode;
