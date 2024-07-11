import { NodeProps } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { ExpressionismNode, MAIN_NODES } from "./types";

const InversionNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    return (
        <BaseNode title="Инверсия" color="violet" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="expression" label="Выражение"></InputHandle>
        </BaseNode>
    );
};

InversionNode.label = "Инверсия";
InversionNode.group = MAIN_NODES;

export default InversionNode;
