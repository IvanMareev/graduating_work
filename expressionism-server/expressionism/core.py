from enum import Enum
from sympy import Expr, pprint, symbols, evaluate, nsimplify, expand, simplify, collect

from expressionism.graph import ExpressionGraph
from icecream import ic
import random


class CoefficientType(Enum):
    INTEGER = 0
    FLOAT = 1


class Coefficient:
    def __init__(
        self,
        name: str,
        type: CoefficientType,
        min: int | float,
        max: int | float,
    ):
        self.symbol = symbols(name)
        self.type: CoefficientType = type
        self.min: int | float = min
        self.max: int | float = max

    def get_value(self) -> int | float:
        if self.type == CoefficientType.INTEGER:
            return random.randint(int(self.min), int(self.max))
        elif self.type == CoefficientType.FLOAT:
            return random.uniform(float(self.min), float(self.max))
        else:
            raise ValueError("Invalid coefficient type")

    def __repr__(self) -> str:
        return f"Coefficient({self.symbol}, {self.type}, {self.min}, {self.max})"


class Expressionism:
    def __init__(self):
        pass

    def expr(self, expr):
        pass

    def build_expression_template(self, graph: ExpressionGraph):
        result_node = next(
            (node for node in graph.nodes if node.type == "result"), None
        )

        if result_node is None:
            raise ValueError("No result node found")

        template = result_node.calc(graph)

        pprint(template)

        return template

    def concretization(self, template: Expr, coefficients: list[Coefficient]) -> Expr:
        concrete_expression = template
        with evaluate(False):
            for c in coefficients:
                c_value = 0
                attempt = 0
                while c_value == 0:
                    c_value = c.get_value()
                    attempt += 1
                    if attempt > 100:
                        raise ValueError(f"Cannot generate value for coefficient {c}")
                concrete_expression = concrete_expression.subs(c.symbol, c_value)
        ic(concrete_expression.atoms)
        if ic(len(concrete_expression.free_symbols)) > 0:
            ic("Expression simplified")
            concrete_expression = concrete_expression.simplify().evalf()

        return concrete_expression
