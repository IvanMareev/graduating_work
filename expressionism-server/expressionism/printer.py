from sympy import latex, parse_expr, Eq, nsimplify

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


class Printer:
    @staticmethod
    def _rreplace(s, old, new, occurrence):
        li = s.rsplit(old, occurrence)
        return new.join(li)

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
        doc = Printer._preconfigure_doc()

        task_idx = 1
        doc.append(Command("noindent"))
        doc.append(f"Вариант {(variant_idx + 1)}")
        for result in results:
            doc.append(NewLine())
            doc.append(f"{task_idx}) {result['task_text']}")
            doc.append(NewLine())
            doc.append(
                NoEscape(
                    Printer._rreplace(
                        latex(
                            parse_expr(result["variants"][variant_idx], evaluate=False),
                            itex=True,
                            order="none",
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
        doc = Printer._preconfigure_doc()

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
                        order="none",
                        mode="equation",
                    )
                )
            )
            task_idx += 1

        doc.generate_pdf(file_path, clean=True, clean_tex=True)

    @staticmethod
    def create_result_pdf(results, file_path):
        doc = Printer._preconfigure_doc()

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
                        Printer._rreplace(
                            latex(
                                parse_expr(
                                    task["variants"][variant_idx - 1], evaluate=False
                                ),
                                itex=True,
                                order="none",
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
                            order="none",
                            mode="equation",
                        )
                    )
                )
                task_idx += 1
            doc.append(NewLine())

        doc.generate_pdf(file_path, clean=True, clean_tex=True)
