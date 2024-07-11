import { css, cx } from "@/styled-system/css";
import { center } from "@/styled-system/patterns/center";

const Footer = () => {
    return (
        <footer className={cx(center(), css({ p: 0 }))}>
            {/* Some content here if need */}
        </footer>
    );
};

export default Footer;
