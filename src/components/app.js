/*
 app.js - ESP3D WebUI App file

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
import "../stylesheets/application.scss"
import { useEffect, useReducer } from "preact/hooks"
import { Esp3dVersion } from "./version"
import { SendGetHttp, SendPostHttp } from "./http"
import { setupWebSocket } from "./websocket"
import { DialogPage } from "./dialog"
import { setLang, T } from "./translations"
let isPreferencesLoaded = false

const default_preferences = '{"language":"en"}'

/*
 * Hook variable for communication with UI
 */
let globalstate
export let globaldispatch

const initialStateEventData = {
    showDialog: true,
    showPage: false,
    data: { type: "loading", message: T("S1") },
    error: 0,
}

/*
 * Load Firmware settings query success
 */
function loadPreferencesSuccess(responseText) {
    var data = {}
    try {
        data = JSON.parse(responseText)
        setLang(data.language)
        globaldispatch({
            type: "FORCE_RENDER",
        })
    } catch (e) {
        console.error("Parsing error:", e)
        globaldispatch({
            type: "FETCH_FW_ERROR",
            errorcode: e,
            errormsg: "S4",
        })
    }
}

/*
 * Load Firmware settings query error
 */
function loadPreferencesError(errorCode, responseText) {
    var blob = new Blob([default_preferences], { type: "application/json" })
    var file = new File([blob], "preferences.json")
    var formData = new FormData()
    var url = "/files"
    formData.append("path", "/")
    formData.append("myfile", file, "preferences.json")
    SendPostHttp(url, formData)
    globaldispatch({
        type: "FETCH_FW_ERROR",
        errorcode: errorCode,
    })
}

function loadPreferences() {
    isPreferencesLoaded = true
    const url = "/preferences.json?" + +"?" + Date.now()
    SendGetHttp(url, loadPreferencesSuccess, loadPreferencesError)
}

/*
 * Hook for communication with UI
 */
const reducerPage = (state, action) => {
    let msg = ""
    switch (action.type) {
        case "FORCE_RENDER":
            return {
                showDialog: false,
                showPage: true,
                error: 0,
                data: {},
            }
        case "FETCH_PREFERENCES":
            console.log("dispatch")
            return {
                showDialog: true,
                showPage: false,
                error: 0,
                data: { type: "loader", message: T("S7") },
            }
        case "WEBSOCKET_SUCCESS":
            if (!isPreferencesLoaded) {
                loadPreferences()
                return {
                    showDialog: true,
                    showPage: false,
                    error: 0,
                    data: { type: "loader", message: T("S7") },
                }
            } else
                return {
                    showDialog: false,
                    showPage: true,
                    error: 0,
                    data: {},
                }
        case "FETCH_FW_SUCCESS":
            return {
                showDialog: true,
                showPage: false,
                error: 0,
                data: { type: "loader", message: T("S2") },
            }
        case "WEBSOCKET_ERROR":
            msg = "S6"
        case "FETCH_FW_ERROR":
            msg = "S5"
            return {
                showDialog: true,
                showPage: false,
                error: action.errorcode,
                data: { type: "error", message: T(msg) },
            }
        case "DISCONNECT_ERROR":
            return {
                showDialog: true,
                showPage: true,
                error: action.errorcode,
                data: {
                    type: "disconnect",
                    message: T("S3"),
                },
            }
        default:
            return state
    }
}

/*
 * Load Firmware settings query success
 */
function loadConfigSuccess(responseText) {
    var data = {}
    try {
        data = JSON.parse(responseText)
        if (data.WebSocketIP && data.WebCommunication && data.WebSocketport) {
            globaldispatch({ type: "FETCH_FW_SUCCESS", payload: data })
            setupWebSocket(
                data.WebCommunication,
                data.WebSocketIP,
                data.WebSocketport
            )
        }
    } catch (e) {
        console.error("Parsing error:", e)
        globaldispatch({
            type: "FETCH_FW_ERROR",
            errorcode: e,
            errormsg: "S4",
        })
    }
}

/*
 * Load Firmware settings query error
 */
function loadConfigError(errorCode, responseText) {
    globaldispatch({
        type: "FETCH_FW_ERROR",
        errorcode: errorCode,
    })
}

/*
 * Load Firmware settings
 */
function loadConfig() {
    var d = new Date()
    var PCtime =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        "-" +
        String(d.getHours()).padStart(2, "0") +
        "-" +
        String(d.getMinutes()).padStart(2, "0") +
        "-" +
        String(d.getSeconds()).padStart(2, "0")
    const url =
        "/command?cmd=" + encodeURIComponent("[ESP800]" + "time=" + PCtime)
    SendGetHttp(url, loadConfigSuccess, loadConfigError)
}

/*
 * Main page
 */
const MainPage = ({ currentState }) => {
    if (currentState.showPage) {
        return (
            <div>
                <center>
                    ESP3D v<Esp3dVersion />
                    <br />
                    {T("lang")}
                </center>
            </div>
        )
    }
}

/*
 * App entry
 */
export function App() {
    ;[globalstate, globaldispatch] = useReducer(
        reducerPage,
        initialStateEventData
    )
    useEffect(() => {
        loadConfig()
    }, [])
    return (
        <div>
            <DialogPage currentState={globalstate} />
            <MainPage currentState={globalstate} />
        </div>
    )
}