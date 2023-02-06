/*
 CMD-source.js - ESP3D WebUI Target file

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

const formatCapabilityLine = (acc, line) => {
    //TODO:
    //isolate description
    //sort enabled
    //sort disabled
    acc.push({ data: line })
    return acc
}

const formatEepromLine = (acc, line) => {
    //format G20 / G21
    //it is comment
    if (line.startsWith("$")) {
        //it is setting
        const data = line.split("=")
        acc.push({ type: "comment", value: data[0] })
        acc.push({
            type: "text",
            value: data[1],
            initial: data[1],
            cmd: data[0],
        })
    }

    return acc
}

const capabilities = {}

const commands = {
    eeprom: () => {
        return { type: "cmd", cmd: "$$" }
    },
    formatEeprom: (result) => {
        if (!result || result.length == 0) return []
        const res = result.reduce((acc, line) => {
            return formatEepromLine(acc, line)
        }, [])
        return res
    },
}

const responseSteps = {
    eeprom: {
        start: (data) => data.startsWith("$"),
        end: (data) => data.startsWith("ok"),
        error: (data) => {
            return data.indexOf("error") != -1
        },
    },
}

function capability() {
    const [cap, ...rest] = arguments
    if (capabilities[cap]) return capabilities[cap](...rest)
    //console.log("Unknow capability ", cap)
    return false
}

function command() {
    const [cmd, ...rest] = arguments
    if (commands[cmd]) return commands[cmd](...rest)
    //console.log("Unknow command ", cmd)
    return { type: "error" }
}

const CMD = { capability, command, responseSteps }

export { CMD }
