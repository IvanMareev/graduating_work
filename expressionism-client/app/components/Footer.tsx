import { css, cx } from "@/styled-system/css";
import { center } from "@/styled-system/patterns/center";

const Footer = () => {
    return (
        <footer className={cx(center(), css({ p: 0 }))}>
            {/* <p className={css({ color: "slate.9", fontSize: "xs" })}>Copyright by Maksim Rolshchikov ©</p> */}
        </footer>
    );
};

export default Footer;
