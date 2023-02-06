/*
 logo.js - FluidNC logo file
 from https://raw.githubusercontent.com/wiki/bdring/FluidNC/images/logos/FluidNC.svg

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

import { h } from "preact"
import { useSettingsContext } from "../../../contexts/SettingsContext"

// import logo from "../../../../images/TP-Logo-Static.svg"

// const logoInline = <svg viewBox="0 0 174 289"  version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;">
// <g transform="matrix(1,0,0,1,-341.644,-155.5)">
//     <g id="TP-Logo-Static.svg" transform="matrix(1,0,0,1,428.644,300)">
//         <g transform="matrix(1,0,0,1,-87,-144.5)">
//             <g transform="matrix(1,0,0,1,-138,-80.5858)">
//                 <path id="logoPathID" d="M168,137.6L196.5,154L196.5,219.8L225,236.2L225,269.1L196.5,252.7L196.5,302C196.5,312.2 201.9,321.6 210.8,326.7L225,334.9L225,367.8L196.5,351.4C188.7,346.9 180.3,339.2 175.2,330.3C170,321.2 168,310.9 168,302.1L168,236.4L139.5,220L139.5,187.1L168,203.5L168,137.6L260.6,84.2C265.3,81.5 270.7,81.8 274.8,84.2L303.3,100.6C307.4,103 310.4,107.4 310.4,112.9L310.4,203.4C310.4,208.5 309.1,213.3 306.6,217.6C304.2,221.8 300.6,225.4 296.2,228L225,269.1L225,285.5C225,295.7 230.4,305.2 239.3,310.3L253.5,318.5L253.5,351.4L225,367.8L196.5,351.4C188.7,346.9 180.3,339.2 175.2,330.3C170,321.2 168,310.9 168,302.1L168,236.4L139.5,220L139.5,187.1L168,170.7L168,187.1L153.8,178.9L168,170.7L168,137.6L182.2,129.4L210.7,145.8L210.7,211.6L239.2,228L239.2,261L225,269.2L210.8,261L210.8,293.8C210.8,304 216.2,313.4 225.1,318.5L239.3,326.7L239.3,359.5L253.5,351.3L253.5,318.4L239.3,310.2C230.5,305.1 225,295.7 225,285.4L225,269L253.5,252.6L253.5,219.7L225,203.4L225,137.6L196.5,121.2L210.7,113L239.2,129.4L239.2,162.3L225,170.5L225,203.4L239.3,195.1L267.8,211.5L267.7,211.6L267.7,244.4L281.9,236.2L281.9,203.4L249.6,184.7C247.2,188.9 243.6,192.5 239.3,195L224.9,203.3L224.9,170.4L253.4,154L253.4,121.1L225,104.7L239.2,96.5L267.7,112.9L267.7,147.9C265.3,147.9 262.9,148.5 260.6,149.8L253.4,154L253.4,170.5C253.4,175.5 252.1,180.4 249.6,184.6L281.9,203.3L281.9,161.9C281.8,151.1 270,144.4 260.6,149.8L253.4,154L253.4,170.5L281.9,186.9L281.9,170.3L253.4,153.9L260.6,149.7C270,144.3 281.7,151 281.9,161.8L281.9,104.5L253.4,88.1L260.5,84C265.2,81.3 270.6,81.6 274.7,84L296.1,96.3L296.2,227.8" />
//             </g>
//         </g>
//     </g>
// </g>
// </svg>

/*
 *ESP3D Logo
 * default height is 50px
 */


const AppLogo = ({
    height = "50px",
    color = "currentColor",
    bgcolor = "white",
}) => {



    const { interfaceSettings } = useSettingsContext()
    if (
        interfaceSettings.current &&
        interfaceSettings.custom &&
        interfaceSettings.custom.logo
    )
        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: interfaceSettings.custom.logo
                        .replace("{height}", height)
                        .replaceAll("{color}", color)
                        .replaceAll("{bgcolor}", bgcolor),
                }}
            ></span>
        )
    else{
        const [logoHeight, _] = height.split("px")

        // jsx(
        //     'svg',
        //     { xmlns: 'http://www.w3.org/2000/svg' },
        //     null,
        //     { throwIfNamespace: false }
        //   )
        
        return (
            <svg class="terrapen-logo" width="100%" height="100%" viewBox="0 0 174 289" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" xmlnsSerif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;">
    <g transform="matrix(1,0,0,1,-341.644,-155.5)">
        <g id="TP-Logo-Static.svg" transform="matrix(1,0,0,1,428.644,300)">
            <g transform="matrix(1,0,0,1,-87,-144.5)">
                <g transform="matrix(1,0,0,1,-138,-80.5858)">
                    <path id="logoPathID" d="M168,137.6L196.5,154L196.5,219.8L225,236.2L225,269.1L196.5,252.7L196.5,302C196.5,312.2 201.9,321.6 210.8,326.7L225,334.9L225,367.8L196.5,351.4C188.7,346.9 180.3,339.2 175.2,330.3C170,321.2 168,310.9 168,302.1L168,236.4L139.5,220L139.5,187.1L168,203.5L168,137.6L260.6,84.2C265.3,81.5 270.7,81.8 274.8,84.2L303.3,100.6C307.4,103 310.4,107.4 310.4,112.9L310.4,203.4C310.4,208.5 309.1,213.3 306.6,217.6C304.2,221.8 300.6,225.4 296.2,228L225,269.1L225,285.5C225,295.7 230.4,305.2 239.3,310.3L253.5,318.5L253.5,351.4L225,367.8L196.5,351.4C188.7,346.9 180.3,339.2 175.2,330.3C170,321.2 168,310.9 168,302.1L168,236.4L139.5,220L139.5,187.1L168,170.7L168,187.1L153.8,178.9L168,170.7L168,137.6L182.2,129.4L210.7,145.8L210.7,211.6L239.2,228L239.2,261L225,269.2L210.8,261L210.8,293.8C210.8,304 216.2,313.4 225.1,318.5L239.3,326.7L239.3,359.5L253.5,351.3L253.5,318.4L239.3,310.2C230.5,305.1 225,295.7 225,285.4L225,269L253.5,252.6L253.5,219.7L225,203.4L225,137.6L196.5,121.2L210.7,113L239.2,129.4L239.2,162.3L225,170.5L225,203.4L239.3,195.1L267.8,211.5L267.7,211.6L267.7,244.4L281.9,236.2L281.9,203.4L249.6,184.7C247.2,188.9 243.6,192.5 239.3,195L224.9,203.3L224.9,170.4L253.4,154L253.4,121.1L225,104.7L239.2,96.5L267.7,112.9L267.7,147.9C265.3,147.9 262.9,148.5 260.6,149.8L253.4,154L253.4,170.5C253.4,175.5 252.1,180.4 249.6,184.6L281.9,203.3L281.9,161.9C281.8,151.1 270,144.4 260.6,149.8L253.4,154L253.4,170.5L281.9,186.9L281.9,170.3L253.4,153.9L260.6,149.7C270,144.3 281.7,151 281.9,161.8L281.9,104.5L253.4,88.1L260.5,84C265.2,81.3 270.6,81.6 274.7,84L296.1,96.3L296.2,227.8" style="fill:none;fill-rule:nonzero;stroke:black;stroke-width:3px;stroke-dasharray:1,1;"/>
                </g>
            </g>
        </g>
    </g>
</svg>
            // <svg class="terrapen-logo">{logoInline}</svg>
            // <img src={logoInline} alt="TerraPen Logo" height={logoHeight} />
        )}
        
}

export { AppLogo }
