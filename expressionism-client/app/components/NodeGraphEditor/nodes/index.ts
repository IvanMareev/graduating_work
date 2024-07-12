import BranchNode from "./BranchNode";
import ChoiceNode from "./ChoiceNode";
import ExpressionNode from "./ExpressionNode";
import InversionNode from "./InversionNode";
import JoinNode from "./JoinNode";
import LimitNode from "./LimitNode";
import PowNode from "./PowNode";
import ResultNode from "./ResultNode";
import SimplificationNode from "./SimplificationNode";
import SubstitutionNode from "./SubstitutionNode";
import { CONDITION_NODES, FUNCTION_NODES, LARGE_OPERATORS, MAIN_NODES } from "./types";

const nodeGroups = [MAIN_NODES, CONDITION_NODES, FUNCTION_NODES, LARGE_OPERATORS];

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
    choice: ChoiceNode,
};

export {
    BranchNode,
    ChoiceNode,
    ExpressionNode,
    InversionNode,
    JoinNode,
    LimitNode,
    nodeGroups,
    nodeTypes,
    PowNode,
    ResultNode,
    SimplificationNode,
    SubstitutionNode,
};
