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
import { Field } from "../../../components/Controls"
import { T } from "../../../components/Translations"
import { Flag } from "preact-feather"

const NetworkSetup = () => {
    const { setup } = useUiContext()
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

    const updateNavigation = (status) => {
        if (status.haserrors) {
            setup.setCanContinue(false)
        } else {
            setup.setCanContinue(true)
        }
    }

    const applyChanges = () => {
        const status = checkStatus()
        if (status.haserrors || !status.hasmodified) {
            console.log("Nothing to update")
            return
        }
        console.log("Update settings")
        //TODO: update in memory && esp EEPROM
    }

    function checkStatus() {
        let stringified = JSON.stringify({ data: featuresList.current })
        let hasmodified =
            stringified.indexOf('"hasmodified":true') == -1 ? false : true
        let haserrors =
            stringified.indexOf('"haserror":true') == -1 ? false : true
        return { hasmodified, haserrors }
    }

    const generateValidation = (fieldData) => {
        let validation = {
            message: <Flag size="1rem" />,
            valid: true,
            modified: true,
        }
        if (fieldData.type == "text") {
            if (fieldData.cast == "A") {
                if (
                    !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                        fieldData.value
                    )
                )
                    validation.valid = false
            } else {
                if (typeof fieldData.min != undefined) {
                    if (fieldData.value.trim().length < fieldData.min) {
                        validation.valid = false
                    } else if (typeof fieldData.minSecondary != undefined) {
                        if (
                            fieldData.value.trim().length <
                                fieldData.minSecondary &&
                            fieldData.value.trim().length > fieldData.min
                        ) {
                            validation.valid = false
                        }
                    }
                }

                if (fieldData.max) {
                    if (fieldData.value.trim().length > fieldData.max) {
                        validation.valid = false
                    }
                }
            }
        } else if (fieldData.type == "number") {
            if (fieldData.max) {
                if (fieldData.value > fieldData.max) {
                    validation.valid = false
                }
            }
            if (fieldData.min) {
                if (fieldData.value < fieldData.min) {
                    validation.valid = false
                }
            }
        } else if (fieldData.type == "select") {
            const index = fieldData.options.findIndex(
                (element) => element.value == parseInt(fieldData.value)
            )
            if (index == -1) {
                validation.valid = false
            }
        }
        if (!validation.valid) {
            validation.message = T("S42")
        }
        fieldData.haserror = !validation.valid
        if (fieldData.value == fieldData.initial) {
            fieldData.hasmodified = false
        } else {
            fieldData.hasmodified = true
        }
        updateNavigation(checkStatus())
        if (!fieldData.hasmodified && !fieldData.haserror) return null
        return validation
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
                elementsList.push(fieldData)
            }
        })
        setFeaturesSetup(elementsList)
        featuresList.current = elementsList
        setup.setApplyChanges(applyChanges)
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
                                setvalidation(generateValidation(fieldData))
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
