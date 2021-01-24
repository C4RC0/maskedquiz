import React, {useContext, useEffect} from "react";
import {WappContext} from "wapplr-react/dist/common/Wapp";

import Logo from "../Logo";

import style from "./template.css";

const logoFunctions = {};

export default function Template(props) {

    const context = useContext(WappContext);
    const {wapp} = context;

    wapp.styles.use(style);

    const {children, effect, logoOnClick} = props;

    const config = wapp.getTargetObject().config;
    const {siteName = "Wapplr", footerMenu = []} = config;

    const copyright = `${siteName} ${new Date().getFullYear()} ©`;

    function onScroll(e) {
        const header = document.querySelector("." + style.header);
        header.classList.toggle(style.sticky, window.scrollY > 0 )
        const hidden = !(window.scrollY > 0);

        if (!logoFunctions.disableControlOnScroll && logoFunctions.setType) {
            logoFunctions.setType({hidden});
        }
    }

    useEffect(function didMount(){
        if (effect){
            effect({
                setLogoType: function ({hidden, type, disableControlOnScroll}) {
                    if (typeof disableControlOnScroll !== "undefined"){
                        logoFunctions.disableControlOnScroll = disableControlOnScroll;
                    }
                    if (logoFunctions.setType) {
                        logoFunctions.setType({hidden, type})
                    }
                },
            })
        }

        window.addEventListener("scroll", onScroll);
        return function willUnmount() {
            window.removeEventListener("scroll", onScroll);
        }
    })

    return (
        <div className={style.page}>
            <header className={style.header}>
                <div className={style.innerHeader}>
                    <div className={style.logo}>
                        <Logo
                            id={"headerLogo"}
                            type={"oneLine"}
                            hidden={true}
                            effect={function (current) {
                                logoFunctions.setType = current.setType;
                            }}
                            href={"/"}
                            onClick={function (e) {
                                e.preventDefault();

                                if (logoOnClick){
                                    logoOnClick(e)
                                }

                            }}
                        />
                    </div>
                </div>
            </header>
            <main className={style.content}>{children}</main>
            <footer className={style.footer}>
                <div>
                    <div className={style.menu}>
                        {[...footerMenu.map(function (menu, key) {

                            const target = menu.target || "self";
                            const noReferrer = (target === "_blank") ? "noreferrer" : null;
                            const href = menu.href;

                            return (
                                <div key={key}>
                                    <a className={style.button}
                                       target={target}
                                       href={href}
                                       rel={noReferrer}
                                       onClick={function (e) {
                                           const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

                                           if (inner){
                                               e.preventDefault();

                                               wapp.client.history.push({
                                                   search:"",
                                                   href:"",
                                                   ...wapp.client.history.parsePath(href)
                                               });

                                           }
                                       }}
                                    >
                                        {menu.name}
                                    </a>
                                </div>
                            )

                        })]}
                    </div>
                    <div className={style.copyright}>
                        {copyright}
                    </div>
                </div>
            </footer>
        </div>
    )

}
