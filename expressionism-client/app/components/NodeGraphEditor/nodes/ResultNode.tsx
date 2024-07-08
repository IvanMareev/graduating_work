import { NodeProps } from "reactflow";
import { BaseNode, InputHandle } from "./NodePrimitives";

const ResultNode = (props: NodeProps) => {
    return (
        <BaseNode title="Результат" {...props}>
            <InputHandle handleId="inp-1" label="Выражение">
            </InputHandle>
        </BaseNode>
    );
};

export default ResultNode;
