import { NodeProps } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { ExpressionismNode, MAIN_NODES } from "./types";

const SimplificationNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    return (
        <BaseNode title="Упрощение" color="violet" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="expression" label="Выражение"></InputHandle>
        </BaseNode>
    );
};

SimplificationNode.label = "Упрощение";
SimplificationNode.group = MAIN_NODES;

export default SimplificationNode;
