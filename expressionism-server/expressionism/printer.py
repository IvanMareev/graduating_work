from sympy import parse_expr, Eq, nsimplify
from pylatex import Document, Command, NewLine, NewPage, Package, NoEscape
import os


class Printer:
    @staticmethod
    def _preconfigure_doc() -> Document:
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
        doc.append(f"Вариант {variant_idx + 1}")

        for result in results:
            doc.append(NewLine())
            doc.append(f"{task_idx}) {result['task_text']}")
            doc.append(NewLine())

            # Просто строковое представление выражения + " = ?"
            expr = parse_expr(result["variants"][variant_idx], evaluate=False)
            doc.append(NoEscape(f"\\texttt{{{str(expr)}}} = ?"))

            task_idx += 1

        doc.generate_pdf(file_path, clean=True, clean_tex=True)

    @staticmethod
    def create_variant_answers_pdf(results, variant_idx, file_path):
        doc = Printer._preconfigure_doc()

        doc.append(Command("noindent"))
        doc.append("Ответы")
        doc.append(NewLine())
        doc.append(NewLine())
        doc.append(f"Вариант {variant_idx + 1}")

        task_idx = 1
        for result in results:
            doc.append(NewLine())
            doc.append(f"{task_idx}) {result['task_text']}")
            doc.append(NewLine())

            expr = parse_expr(result["variants"][variant_idx], evaluate=False)
            solved_expr = Eq(expr, nsimplify(expr.doit()), evaluate=False)

            # Вывод решения в виде строки
            doc.append(NoEscape(f"\\texttt{{{str(solved_expr)}}}"))

            task_idx += 1

        doc.generate_pdf(file_path, clean=True, clean_tex=True)

    @staticmethod
    def create_result_pdf(results, file_path):
        doc = Printer._preconfigure_doc()

        doc.append(Command("noindent"))
        n_variants = len(results[0]["variants"])

        # Задания
        for variant_idx in range(n_variants):
            task_idx = 1
            doc.append(f"Вариант {variant_idx + 1}")
            for task in results:
                doc.append(NewLine())
                doc.append(f"{task_idx}) {task['task_text']}")
                doc.append(NewLine())

                expr = parse_expr(task["variants"][variant_idx], evaluate=False)
                doc.append(NoEscape(f"\\texttt{{{str(expr)}}} = ?"))

                task_idx += 1
            doc.append(NewLine())

        doc.append(NewPage())

        # Ответы
        doc.append("Ответы")
        doc.append(NewLine())
        doc.append(NewLine())

        for variant_idx in range(n_variants):
            task_idx = 1
            doc.append(f"Вариант {variant_idx + 1}")
            for task in results:
                doc.append(NewLine())
                doc.append(f"{task_idx}) {task['task_text']}")
                doc.append(NewLine())

                expr = parse_expr(task["variants"][variant_idx], evaluate=False)
                solved_expr = Eq(expr, nsimplify(expr.doit()), evaluate=False)

                doc.append(NoEscape(f"\\texttt{{{str(solved_expr)}}}"))

                task_idx += 1
            doc.append(NewLine())

        doc.generate_pdf(file_path, clean=True, clean_tex=True)
