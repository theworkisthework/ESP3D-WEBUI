/*
 index.js - ESP3D WebUI Target file

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
import { iconsTarget } from "./icons"
import { files } from "./files"
import { processor } from "./processor"
import { defaultPanelsList } from "./panels"
import { MachineSettings } from "./MachineSettings"
import {
    InformationsControls,
    QuickButtonsBar,
    BackgroundContainer,
} from "./Controls"
import {
    TargetContextProvider,
    useTargetContext,
    useTargetContextFn,
} from "./TargetContext"
import realCommandsTable from "./realCommandsTable"
import variablesTable from "./variablesTable"
import { AppLogo } from "../../../components/Images/logo"
import { Eye as WebUILogo } from "preact-feather"
import { addObjectItem, removeObjectItem } from "../../../components/Helpers"

const Target = "HP-GL"
const webUIbuild = "H-1"
const Name = "ESP3D"
const fwUrl = [
    "https://github.com/luc-github/ESP3D/tree/3.0",
    "https://github.com/luc-github/ESP3D-TFT",
]

const restartdelay = 30
const variablesList = {
    commands: [...realCommandsTable, ...variablesTable],
    addCommand: (variable) =>
        addObjectItem(variablesList.commands, "name", variable),
    removeCommand: (name) =>
        removeObjectItem(variablesList.commands, "name", name),
    formatCommand: (command) => {
        if (command.trim().startsWith("[")) {
            return command.trim()
        } else {
            if (command.trim().endsWith(";")) {
                return command.trim()
            }
            return command.trim() + ";"
        }
    },
}
const eventsList = {
    evts: [],
    on: (event, fn) => {
        if (typeof eventsList.evts[event] === "undefined") {
            eventsList.evts[event] = []
        }
        addObjectItem(eventsList.evts[event], "fn", { fn: fn })
    },
    off: (event, fn) => {
        removeObjectItem(variablesList.evts[event], "fn", fn)
    },
    emit: (event, data) => {
        if (eventsList.evts[event])
            eventsList.evts[event].forEach((element) => {
                if (typeof element.fn === "function") element.fn(data)
            })
    },
}

export {
    MachineSettings,
    Target,
    fwUrl,
    Name,
    files,
    iconsTarget,
    processor,
    restartdelay,
    defaultPanelsList,
    TargetContextProvider,
    useTargetContext,
    useTargetContextFn,
    webUIbuild,
    InformationsControls,
    variablesList,
    eventsList,
    AppLogo,
    WebUILogo,
    QuickButtonsBar,
    BackgroundContainer,
}
