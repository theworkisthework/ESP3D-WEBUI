/*
 connection.js - ESP3D WebUI area file

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
import { Fragment, h } from "preact"
import { useEffect, useState, useRef } from "preact/hooks"
import { ViewContainerFn } from "."
import { ArrowRight, ArrowLeft, Check, XCircle } from "preact-feather"
import { ButtonImg } from "../components/Controls"
import { T } from "../components/Translations"
import { useUiContextFn, useUiContext, useSettingsContext } from "../contexts"
import { showConfirmationModal } from "../components/Modal"
import { Loading } from "../components/Controls"
import { formatStructure } from "../tabs/features/formatHelper"
import { useHttpQueue } from "../hooks"
import { espHttpURL } from "../components/Helpers"
import { configSteps } from "../targets"

/*
 * Local const
 *
 */
// This need to come from Target directory to be customized as need

const wizardFinalSteps = [{ title: "S210", description: "S209", content: "" }]

const steps = [...configSteps, ...wizardFinalSteps]

const SetupContainer = () => {
    const buttonNextRef = useRef()
    const [step, setStep] = useState(0)
    const { setup, modals, toasts, uisettings } = useUiContext()
    const { connectionSettings, featuresSettings } = useSettingsContext()
    const [isLoading, setIsLoading] = useState(true)
    const { createNewRequest, abortRequest } = useHttpQueue()
    const [canContinue, setCanContinue] = useState(setup.canContinue)
    const getFeatures = () => {
        setIsLoading(true)
        createNewRequest(
            espHttpURL("command", { cmd: "[ESP400]json=yes" }),
            { method: "GET" },
            {
                onSuccess: (result) => {
                    try {
                        const jsonResult = JSON.parse(result)

                        if (
                            !jsonResult ||
                            jsonResult.cmd != 400 ||
                            jsonResult.status == "error" ||
                            !jsonResult.data
                        ) {
                            toasts.addToast({
                                content: T("S194"),
                                type: "error",
                            })
                            return
                        }
                        const feat = formatStructure(jsonResult.data)

                        featuresSettings.current = { ...feat }
                    } catch (e) {
                        console.log(e, T("S21"))
                        toasts.addToast({ content: T("S21"), type: "error" })
                        ViewContainerFn.setShowSetup(false)
                    } finally {
                        setIsLoading(false)
                    }
                },
                onFail: (error) => {
                    setIsLoading(false)
                    console.log(error)
                    toasts.addToast({ content: error, type: "error" })
                },
            }
        )
    }
    const removeSetupFlag = () => {
        createNewRequest(
            espHttpURL("command", { cmd: "[ESP800]setup=1" }),
            { method: "GET" },
            {
                onSuccess: (result) => {
                    //Nothing to do
                },
                onFail: (error) => {
                    console.log(error)
                    toasts.addToast({ content: error, type: "error" })
                },
            }
        )
    }

    useEffect(() => {
        if (
            featuresSettings.current &&
            Object.keys(featuresSettings.current).length != 0
        ) {
            setIsLoading(false)
        } else {
            if (uisettings.getValue("autoload")) {
                getFeatures()
            } else setIsLoading(false)
        }
    }, [])

    return (
        <div class="empty fullscreen">
            <div class="centered text-primary">
                <ul class="step">
                    {steps.map((element, index) => {
                        return (
                            <li
                                class={`step-item ${
                                    index === step ? " active" : ""
                                }`}
                            >
                                <a
                                    href="#"
                                    onclick={(e) => {
                                        e.target.blur()
                                    }}
                                    class="tooltip"
                                    data-tooltip={element.name}
                                ></a>
                            </li>
                        )
                    })}
                </ul>
                {isLoading && <Loading large />}

                {!isLoading && (
                    <Fragment>
                        <div class="step-content">
                            <div class="m-2 title">{T(steps[step].title)}</div>
                            {steps[step].description && (
                                <div class="m-2">
                                    {T(steps[step].description)}
                                </div>
                            )}
                            {steps[step].content && (
                                <div class="m-2">{steps[step].content}</div>
                            )}
                        </div>
                        <div style="display:flex; justify-content: center;align-items: center;width:100%">
                            {step != steps.length - 1 && (
                                <ButtonImg
                                    m2
                                    icon={<XCircle />}
                                    label={T("S28")}
                                    onclick={() => {
                                        useUiContextFn.haptic()
                                        showConfirmationModal({
                                            modals,
                                            title: T("S26"),
                                            content: T("S205"),
                                            button1: {
                                                cb: () => {
                                                    if (
                                                        connectionSettings
                                                            .current.Setup ==
                                                        "Enabled"
                                                    ) {
                                                        showConfirmationModal({
                                                            modals,
                                                            title: T("S26"),
                                                            content: T("S206"),
                                                            button1: {
                                                                cb: () => {
                                                                    ViewContainerFn.setShowSetup(
                                                                        false
                                                                    )
                                                                },
                                                                text: T("S27"),
                                                            },
                                                            button2: {
                                                                cb: () => {
                                                                    ViewContainerFn.setShowSetup(
                                                                        false
                                                                    )
                                                                    removeSetupFlag()
                                                                },
                                                                text: T("S29"),
                                                            },
                                                        })
                                                    } else {
                                                        console.log(
                                                            "Setup canceled"
                                                        )
                                                        toasts.addToast({
                                                            content: T("S175"),
                                                            type: "warning",
                                                        })
                                                        ViewContainerFn.setShowSetup(
                                                            false
                                                        )
                                                    }
                                                },
                                                text: T("S27"),
                                            },
                                            button2: {
                                                text: T("S28"),
                                            },
                                        })
                                    }}
                                />
                            )}
                            {step > 0 && (
                                <Fragment>
                                    <ButtonImg
                                        m2
                                        icon={<ArrowLeft />}
                                        label={T("S164")}
                                        onclick={() => {
                                            useUiContextFn.haptic()
                                            setStep(step - 1)
                                        }}
                                    />
                                </Fragment>
                            )}

                            {setup.canContinue && (
                                <ButtonImg
                                    m2
                                    iconRight="1"
                                    icon={
                                        step === steps.length - 1 ? (
                                            <Check />
                                        ) : (
                                            <ArrowRight />
                                        )
                                    }
                                    label={
                                        step === steps.length - 1
                                            ? T("S202")
                                            : T("S163")
                                    }
                                    onclick={() => {
                                        useUiContextFn.haptic()
                                        if (step === steps.length - 1) {
                                            removeSetupFlag()
                                            ViewContainerFn.setShowSetup(false)
                                        } else {
                                            if (setup.applyChanges.current)
                                                setup.applyChanges.current()
                                            setStep(step + 1)
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export { SetupContainer }
