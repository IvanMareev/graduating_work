import ExpressionNode from "./ExpressionNode";
import JoinNode from "./JoinNode";
import ResultNode from "./ResultNode";
import SubstitutionNode from "./SubstitutionNode";

const nodeTypes = {
    result: ResultNode,
    expression: ExpressionNode,
    join: JoinNode,
    substitution: SubstitutionNode,
};

export { ExpressionNode, JoinNode, ResultNode, SubstitutionNode, nodeTypes };
