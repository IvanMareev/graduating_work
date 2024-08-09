from expressionism.core import Expressionism, Coefficient, CoefficientType
from expressionism.graph import ExpressionGraph
from icecream import ic

from sympy import latex, parse_expr, Eq, nsimplify, symbols


from pylatex import (
    Document,
    Section,
    Subsection,
    Command,
    NewLine,
    NewPage,
    Package,
    Head,
    PageStyle,
)
from pylatex.utils import italic, NoEscape

import json

from models import Generator


class GeneratorDescription:
    name: str
    task_text: str
    variables: str
    coefficients: str
    restricts: str
    content: str

    def __repr__(self):
        return f"GeneratorDescription({self.name}, {self.task_text}, {self.variables}, {self.coefficients}, {self.restricts}, {self.content})"


def rreplace(s, old, new, occurrence):
    li = s.rsplit(old, occurrence)
    return new.join(li)


class GeneratorSystem:
    def __init__(self):
        self.ex: Expressionism = Expressionism()
        pass

    def generate(self, variants_count: int, generators: list[Generator]):
        results = list()
        for g in generators:
            generator_graph = ExpressionGraph.parse_from_json(g.content)

            raw_coefficients = json.loads(g.coefficients)
            generator_coefficients = [
                Coefficient(
                    c["name"],
                    CoefficientType.INTEGER
                    if c["type"] == "Целое"
                    else CoefficientType.FLOAT,
                    c["min"],
                    c["max"],
                )
                for c in raw_coefficients
            ]

            task_variants: list = []
            for i in range(0, variants_count):
                expression_template = self.ex.build_expression_template(generator_graph)
                concrete_expression = self.ex.concretization(
                    expression_template, generator_coefficients
                )
                task_variants.append(str(concrete_expression))

            results.append({"task_text": ic(g.task_text), "variants": task_variants})

        return results

    @staticmethod
    def _preconfigure_doc() -> Document:
        doc = Document()
        geometry_options = {"tmargin": "1cm", "lmargin": "2cm"}
        doc = Document(geometry_options=geometry_options)
        doc.preamble.append(Command("usepackage", "helvet"))
        doc.preamble.append(Command("pagenumbering", "gobble"))
        doc.packages.add(Package("babel", options=["russian"]))
        return doc

    @staticmethod
    def create_variant_pdf(results, variant_idx, file_path):
        doc = GeneratorSystem._preconfigure_doc()

        task_idx = 1
        doc.append(Command("noindent"))
        doc.append(f"Вариант {(variant_idx + 1)}")
        for result in results:
            doc.append(NewLine())
            doc.append(f"{task_idx}) {result['task_text']}")
            doc.append(NewLine())
            doc.append(
                NoEscape(
                    rreplace(
                        latex(
                            parse_expr(result["variants"][variant_idx], evaluate=False),
                            itex=True,
                            mode="equation",
                        ),
                        "$$",
                        " = ?$$",
                        1,
                    )
                )
            )
            task_idx += 1

        doc.generate_pdf(file_path, clean=True, clean_tex=True)

    @staticmethod
    def create_variant_answers_pdf(results, variant_idx, file_path):
        doc = GeneratorSystem._preconfigure_doc()

        doc.append(Command("noindent"))

        doc.append("Ответы")
        doc.append(NewLine())
        doc.append(NewLine())

        task_idx = 1
        doc.append(f"Вариант {(variant_idx + 1)}")
        for result in results:
            doc.append(NewLine())
            doc.append(f"{task_idx}) {result['task_text']}")
            doc.append(NewLine())

            expr = parse_expr(result["variants"][variant_idx], evaluate=False)
            doc.append(
                NoEscape(
                    latex(
                        Eq(expr, nsimplify(expr.doit()), evaluate=False),
                        itex=True,
                        mode="equation",
                    )
                )
            )
            task_idx += 1

        doc.generate_pdf(file_path, clean=True, clean_tex=True)

    @staticmethod
    def create_result_pdf(results, file_path):
        doc = GeneratorSystem._preconfigure_doc()

        doc.append(Command("noindent"))
        for variant_idx in range(1, len(results[0]["variants"]) + 1):
            task_idx = 1
            doc.append(f"Вариант {(variant_idx)}")
            for task in results:
                doc.append(NewLine())
                doc.append(f"{task_idx}) {task['task_text']}")
                doc.append(NewLine())
                doc.append(
                    NoEscape(
                        rreplace(
                            latex(
                                parse_expr(
                                    task["variants"][variant_idx - 1], evaluate=False
                                ),
                                itex=True,
                                mode="equation",
                            ),
                            "$$",
                            " = ?$$",
                            1,
                        )
                    )
                )
                task_idx += 1
            doc.append(NewLine())

        doc.append(NewPage())

        doc.append("Ответы")
        doc.append(NewLine())
        doc.append(NewLine())

        for variant_idx in range(1, len(results[0]["variants"]) + 1):
            task_idx = 1
            doc.append(f"Вариант {(variant_idx)}")
            for task in results:
                doc.append(NewLine())
                doc.append(f"{task_idx}) {task['task_text']}")
                doc.append(NewLine())
                expr = parse_expr(task["variants"][variant_idx - 1], evaluate=False)
                doc.append(
                    NoEscape(
                        latex(
                            Eq(expr, nsimplify(expr.doit()), evaluate=False),
                            itex=True,
                            mode="equation",
                        )
                    )
                )
                task_idx += 1
            doc.append(NewLine())

        doc.generate_pdf(file_path, clean=True, clean_tex=True)
