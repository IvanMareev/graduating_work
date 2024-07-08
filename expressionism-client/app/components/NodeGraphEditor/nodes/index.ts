import BranchNode from "./BranchNode";
import ExpressionNode from "./ExpressionNode";
import InversionNode from "./InversionNode";
import JoinNode from "./JoinNode";
import LimitNode from "./LimitNode";
import PowNode from "./PowNode";
import ResultNode from "./ResultNode";
import SimplificationNode from "./SimplificationNode";
import SubstitutionNode from "./SubstitutionNode";

const nodeTypes = {
    result: ResultNode,
    expression: ExpressionNode,
    join: JoinNode,
    substitution: SubstitutionNode,
    inversion: InversionNode,
    simplification: SimplificationNode,
    pow: PowNode,
    limit: LimitNode,
    branch: BranchNode,
};

export {
    BranchNode,
    ExpressionNode,
    InversionNode,
    JoinNode,
    LimitNode,
    PowNode,
    ResultNode,
    SimplificationNode,
    SubstitutionNode,
    nodeTypes,
};
