/*
 setup.js - ESP3D WebUI setup file

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
import { useEffect, useState, useRef } from "preact/hooks"
import { useUiContext, useSettingsContextFn } from "../../../contexts"
import { generateValidation } from "../../../tabs/features"
import { Field } from "../../../components/Controls"
import { T } from "../../../components/Translations"
import { showConfirmationModal } from "../../../components/Modal"

const NetworkSetup = () => {
    const { setup, toasts, modals } = useUiContext()
    const featuresList = useRef([])
    const [featuresSetup, setFeaturesSetup] = useState(featuresList.current)
    const networkElements = [
        {
            section: "network",
            subSection: "network",
            label: "hostname",
        },
        {
            section: "network",
            subSection: "sta",
            label: "SSID",
        },
        {
            section: "network",
            subSection: "sta",
            label: "pwd",
        },
    ]

    const resetChanges = () => {
        featuresList.current.map((element) => {
            element.value = element.initial
        })
        setup.setStepStatus({
            haserror: setup.stepStatus.haserrors,
            hasmodified: false,
        })
        console.log("reset settings")
    }

    const saveChanges = (nextFn) => {
        console.log("Save changes")
        featuresList.current.map((element) => {
            //TODO: save
            element.origin.value = element.value
            element.origin.initial = element.value
        })
        if (nextFn) nextFn()
    }

    const applyChanges = (nextFn = null) => {
        const status = checkStatus()
        if (status.haserrors) {
            console.log("Has error so stop")
            return
        }
        if (status.hasmodified) {
            //TODO: update in memory && esp EEPROM
            console.log("Update settings")
            console.log("Changes are not saved")
            showConfirmationModal({
                modals,
                title: T("S26"),
                content: T("S212"),
                button1: {
                    cb: () => {
                        if (nextFn) nextFn()
                        console.log("Discard changes")
                    },
                    text: T("S29"),
                },
                button2: {
                    cb: () => {
                        saveChanges(nextFn)
                    },
                    text: T("S27"),
                },
            })
        } else {
            if (nextFn) nextFn()
            console.log("Nothing to update")
        }
    }

    function checkStatus() {
        let stringified = JSON.stringify({ data: featuresList.current })
        let hasmodified =
            stringified.indexOf('"hasmodified":true') == -1 ? false : true
        let haserrors =
            stringified.indexOf('"haserror":true') == -1 ? false : true
        return { hasmodified, haserrors }
    }

    useEffect(() => {
        const elementsList = []
        networkElements.map((element) => {
            const currentElement = useSettingsContextFn.getFeatureElement(
                element.section,
                element.subSection,
                element.label
            )
            if (currentElement) {
                const fieldData = JSON.parse(JSON.stringify(currentElement))
                fieldData.section = element.section
                fieldData.subSection = element.subSection
                fieldData.value = fieldData.initial
                fieldData.origin = currentElement
                elementsList.push(fieldData)
            }
        })
        setFeaturesSetup(elementsList)
        featuresList.current = elementsList
        setup.setApplyChanges(applyChanges)
        setup.setResetChanges(resetChanges)
    }, [])
    return (
        <div>
            {featuresSetup &&
                featuresSetup.map((fieldData) => {
                    const [validation, setvalidation] = useState()
                    const { label, options, initial, subSection, ...rest } =
                        fieldData
                    const Options = options
                        ? options.reduce((acc, curval) => {
                              return [
                                  ...acc,
                                  {
                                      label: T(curval.label),
                                      value: curval.value,
                                  },
                              ]
                          }, [])
                        : null
                    return (
                        <Field
                            label={T(label)}
                            options={Options}
                            extra={
                                subSection == "sta" && label == "SSID"
                                    ? "scan"
                                    : null
                            }
                            {...rest}
                            setValue={(val, update) => {
                                if (!update) fieldData.value = val
                                setvalidation(
                                    generateValidation(fieldData, () => {
                                        setup.setStepStatus(checkStatus())
                                    })
                                )
                            }}
                            validation={validation}
                        />
                    )
                })}
        </div>
    )
}

const configSteps = [
    { title: "S211", description: null, content: <NetworkSetup /> },
]

export { configSteps }
