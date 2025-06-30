import { RecipeVariantProps } from "@/styled-system/css";
import { sva } from "@/styled-system/css/sva.mjs";
import Link from "next/link";

const headerStyles = sva({
    slots: ["root", "title"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            borderRadius: "xl",
            p: "4",
            bgColor: "slate.1",
            boxShadow: "md",
        },
        title: {},
    },
    variants: {
        size: {
            big: {
                root: {
                    height: "72px",
                },
                title: {
                    fontSize: "3xl",
                    fontWeight: "medium",
                },
            },
            small: {
                root: {
                    height: "52px",
                },
                title: {
                    fontSize: "2xl",
                    fontWeight: "medium",
                },
            },
        },
    },
    defaultVariants: { size: "big" }, // Установлен размер по умолчанию на "big"
});

type HeaderProps = RecipeVariantProps<typeof headerStyles> & {};

const Header = (props: HeaderProps) => {
    const styles = headerStyles(props); // Применяем стили с учетом переданных props
    return (
        <header className={styles.root}>
            <Link href={"/"}>
                <h1 className={styles.title}>Генератор HTML-макетов</h1>
            </Link>
        </header>
    );
};

export default Header;
