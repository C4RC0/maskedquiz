import React from "react";
import style from "../../game.css";

export default function HeartIcon(props) {
    return (
        <svg
            className={style.heartIcon}
            xmlns={"http://www.w3.org/2000/svg"}
            xmlnsXlink={"http://www.w3.org/1999/xlink"}
            width={"100%"}
            height={"100%"}
            viewBox={"0 0 1850 1550"}
        >
            <g transform="matrix(1,0,0,-1,16,1343.4237)">
                <path d="m 896,-128 q -26,0 -44,18 L 228,492 q -10,8 -27.5,26 Q 183,536 145,583.5 107,631 77,681 47,731 23.5,802 0,873 0,940 q 0,220 127,344 127,124 351,124 62,0 126.5,-21.5 64.5,-21.5 120,-58 55.5,-36.5 95.5,-68.5 40,-32 76,-68 36,36 76,68 40,32 95.5,68.5 55.5,36.5 120,58 64.5,21.5 126.5,21.5 224,0 351,-124 127,-124 127,-344 0,-221 -229,-450 L 940,-110 q -18,-18 -44,-18"/>
            </g>
        </svg>
    )
}
