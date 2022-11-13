import { ServicesContent } from "../Services/ServicesContent"
import { useEffect, useState } from "react";
import axios from "axios";
import './Workflows.css'

export const WorkflowContent = (props) => {
    const [actionServices, setActionServices] = useState([])
    const [actionTriggers, setActionTrigger] = useState([])
    const [actionProperties, setActionProperties] = useState([])
    const [selectedProperty, setSelectedProperty] = useState(undefined)
    const [selectedOperator, setSelectedOperator] = useState(undefined)
    const [conditionText, setConditionText] = useState("")
    const [conditionSeparator, setConditionSeparator] = useState("&&")
    const [conditionState, setConditionState] = useState("newCondition")
    const [reactionServices, setReactionServices] = useState([])
    const [reactions, setReactions] = useState([])

    let someOperator = 0

    const operators = [{name: "equal", type: "string", value: "=="},{name: "in", type: "string", value: "in"},
        {name: "equal", type: "number", value: "=="}, {name: "superior", type: "number", value: ">"}, {name: "superior or equal", type: "number", value: ">="},
        {name: "inferior", type: "number", value: "<"}, {name: "inferior or equal", type: "number", value: "<="}]

    useEffect(() => {
        if (props.inCreation === false) {
            setActionServices(actionServices.map(element => {
                element.active = false
                return (element)
            }))
            setActionTrigger([])
            setActionProperties([])
            setSelectedProperty(undefined)
            setSelectedOperator(undefined)
        }
        loadActionServices()
    }, [props.services, props.inCreation])

    const loadActionServices = async () => {
        {
            ServicesContent.map((val, key) => {
                if (props.services.find(element => element.name === val.name && element.state === "connected") !== undefined) {
                    if (actionServices.find(element => element.name === val.name) === undefined)
                        setActionServices(current => [...current, { name: val.name, logo: val.logo, active: false }])
                }
            })
        }
    }

    const loadReactionServices = async () => {
        {
            ServicesContent.map(async (val, key) => {
                if (props.services.find(element => element.name === val.name && element.state === "connected") !== undefined) {
                    if (reactionServices.find(element => element.name === val.name) === undefined) {
                        await setReactionServices(current => [...current, { name: val.name, logo: val.logo }])
                    }
                }
            })
        }
    }

    const setServiceActive = async (service) => {
        if (service.name !== props.actionServiceActive) {
            await setActionServices(await actionServices.map(element => {
                if (element.name === service.name) {
                    element.active = true
                    if (props.actionServiceActive !== undefined) {
                        setActionServices(actionServices.map(element => {
                            if (element.name === props.actionServiceActive)
                                element.active = false
                            return (element)
                        }))
                    }
                    props.setActionServiceActive(element.name)
                }
                return (element)
            }))
            await props.setConditions("")
            await props.setReactionServiceActive(undefined)
            await props.setReactionActive(undefined)
            await props.setActionTriggerActive(undefined)
            await loadServiceTriggers(service)
            await props.setActionParameters([])
        }
    }

    const loadServiceTriggers = async (service) => {
        try {
            const res = await axios.get("/service/" + service.name + "/actions",
                { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

            await setActionTrigger(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const setTriggerActive = async (trigger) => {
        try {
            if (trigger.name !== props.actionTriggerActive) {
                const res = await axios.get("/service/" + props.actionServiceActive + "/action/" + trigger.name,
                    { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

                await props.setActionTriggerActive(trigger.name)
                await setActionProperties([])
                let SelectedProperty = 0
                await props.setActionParameters([])
                Object.keys(res.data.parameters).map(element => {
                    props.setActionParameters(current => [...current, { name: element, value: "", type: res.data.parameters[element] }])
                })
                await Object.keys(res.data.properties).map(element => {
                    if ((typeof res.data.properties[element]) === "object") {
                        Object.keys(res.data.properties[element]).map(nestedElement => {
                                setActionProperties(current => [...current,
                                    { name: element + "." + nestedElement, value: undefined, type: res.data.properties[element][nestedElement] }])
                                if (selectedProperty === undefined && SelectedProperty === 0) {
                                    setSelectedProperty(element + "." + nestedElement)
                                    SelectedProperty = 1
                                }
                        })
                    } else {
                        setActionProperties(current => [...current, { name: element, value: undefined, type: res.data.properties[element] }])
                        if (selectedProperty === undefined && SelectedProperty === 0) {
                            setSelectedProperty(element)
                            SelectedProperty = 1
                        }
                    }
                })
                someOperator = 0
            }
            await props.setConditions("")
            await loadReactionServices()
        } catch (error) {
            console.log(error)
        }
    }

    const getSelectedPropertyType = () => {
        let type = ""
        actionProperties.map(element => {
            if (element.name === selectedProperty)
                type = element.type
        })
        return ("type: " + type)
    }

    const addCondition = async () => {
        if (props.conditions === "") {
            await props.setConditions("( \"" + conditionText + "\" " + selectedOperator + " Action." + selectedProperty)
        } else {
            if (conditionState === "newCondition")
                await props.setConditions(props.conditions + " ) " + conditionSeparator + " ( \"" + conditionText + "\" " + selectedOperator + " Action." + selectedProperty)
            else
                await props.setConditions(props.conditions + " " + conditionSeparator + " \"" + conditionText + "\" " + selectedOperator + " Action." + selectedProperty)
        }
    }

    const clearCondition = () => {
        props.setConditions("")
    }

    const setServiceReactionActive = async (service) => { 
        try {
            if (service.name !== props.reactionServiceActive) {
                const res = await axios.get("/service/" + service.name + "/reactions",
                    { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

                await props.setReactionActive(undefined)
                await props.setReactionServiceActive(service.name)
                await setReactions(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const setActiveReaction = async (reaction) => {
        try {
            if (reaction.name !== props.reactionActive) {
                const res = await axios.get("/service/" + props.reactionServiceActive + "/reaction/" + reaction.name,
                    { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

                await props.setReactionActive(reaction.name)
                await props.setReactionParameters([])
                Object.keys(res.data.parameters).map(element => {
                    props.setReactionParameters(current => [...current, { name: element, value: "", type: res.data.parameters[element] }])
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const changeReactionParameterValue = (parameter, event) => {
        props.setReactionParameters(props.reactionParameters.map(element => {
            if (element.name === parameter.name)
                element.value = event.target.value
            return (element)
        }))
    }

    const changeActionParameterValue = (parameter, event) => {
        props.setActionParameters(props.actionParameters.map(element => {
            if (element.name === parameter.name)
                element.value = event.target.value
            return (element)
        }))
    }

    const checkActionParameters = () => {
        let valueUndefined = 0
        props.actionParameters.map(element => {
            if (element.value === "")
                valueUndefined = 1
        })
        if (props.actionTriggerActive === undefined || valueUndefined === 1)
            return (false)
        return (true)
    }

    const checkIfThereIsActionParameters = () => {
        let checkGood = 0
        props.actionParameters.map(element => {
            checkGood = 1
        })
        if (checkGood === 1)
            return (true)
        return (false)
    }

    return (
        <div className="WorkflowContent">
            <div className="WorkflowInformations">
                <div className="Parameters">
                    <p>Title</p>
                    <input className="TriggerInput" placeholder={"title"} onChange={(event) => {props.setTitle(event.target.value)}}></input>
                </div>
                <div className="Parameters">
                    <p>Description</p>
                    <input className="TriggerInput" placeholder={"description"} onChange={(event) => {props.setDescription(event.target.value)}}></input>
                </div>
            </div>
            <div className='WorkflowBlock'>
                <p className="WorkflowBlockTitle">Action Services</p>
                <div className="ActionServices">
                    {actionServices.map((service, key) => {
                        return (
                            <div className="WorkflowService" key={key} onClick={() => setServiceActive(service)}
                                style={service.active?{boxShadow: "0px 0px 0px 2px #f10c23 inset"}:undefined}>
                                <div style={{display: "flex", justifyContent: "center"}}> 
                                    <img src={require("../../img/" + service.logo + ".png")} className="ServiceLogo" alt="Service_Logo" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='WorkflowBlockTrigger' style={props.actionServiceActive === undefined?{display: "none"}:undefined}>
                <p className="WorkflowBlockTitle">Action Triggers</p>
                <div className="ActionServices">
                    {actionTriggers.map((trigger, key) => {            
                        return (
                            <div className="WorkflowService" key={key} onClick={() => setTriggerActive(trigger)}
                                style={trigger.name === props.actionTriggerActive?{boxShadow: "0px 0px 0px 2px #f10c23 inset"}:undefined}>
                                <p className="TextInPanel">{trigger.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='WorkflowBlock' style={checkIfThereIsActionParameters() ? undefined : {display: "none"}}>
                <p className="WorkflowBlockTitle">Reaction Parameters</p>
                <div className="ActionServices">
                    {Object.keys(props.actionParameters).map((parameter, key) => {
                        return (
                            <div className="Parameters" key={key}>
                                <p>{props.actionParameters[parameter].name}</p>
                                <input className="TriggerInput" placeholder={"type: " + props.actionParameters[parameter].type}
                                    onChange={(event) => {changeActionParameterValue(props.actionParameters[parameter], event)}}></input>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='WorkflowBlock' style={props.actionTriggerActive === undefined?{display: "none"}:undefined}>
                <p className="WorkflowBlockTitle">Conditions</p>
                <p className="WorkflowOptionalTitle">* This part is optional</p>
                <p className="TriggerSubTitle">Properties</p>
                <select className="TriggerDropDown" onChange={(event) => setSelectedProperty(event.target.value)}>
                    {actionProperties.map((trigger, key) => {
                        let splittedName = trigger.name.split('.')
                        let triggerName = ""

                        splittedName.map((element, index) => {
                            if (index !== 0)
                                triggerName += " "
                            triggerName += element
                        })
                        return (
                            <option value={trigger.name} key={key}>{triggerName}</option>
                        )
                    })
                    }
                </select>
                <p className="TriggerSubTitle">Condition & Comparison Operator</p>
                <div className="TriggerCondition">
                    <div className="TriggerInputBackground">
                        <input className="TriggerInput" placeholder={getSelectedPropertyType()}
                            onChange={(event) => setConditionText(event.target.value)}></input>
                    </div>
                    <select className="ConditionDropDown" onChange={(event) => setSelectedOperator(event.target.value)}>
                        {operators.map((element, key) => {
                            if ("type: " + element.type === getSelectedPropertyType()) {
                                if (selectedOperator === undefined && someOperator === 0) {
                                    setSelectedOperator(element.value)
                                    someOperator = 1
                                }
                                return (
                                    <option value={element.value} key={key}>{element.name}</option>
                                )
                            }
                        })}
                    </select>
                </div>
                <p className="TriggerSubTitle" style={props.conditions === "" ? {display: "none"} : undefined}>Condition Separator</p>
                <div className="ConditionSeparator" style={props.conditions === "" ? {display: "none"} : undefined}>
                    <select className="LastConditionDropDown" onChange={(event) => setConditionState(event.target.value)}>
                        <option value="newCondition">new condition</option>
                        <option value="continueCondition">continue last condition</option>
                    </select>
                    <select className="ConditionDropDown" onChange={(event) => setConditionSeparator(event.target.value)}>
                        <option value="&&">and</option>
                        <option value="||">or</option>
                    </select>
                </div>
                <div className="TriggerCondition">
                    <div className="ConditionSubmitButton"
                        style={conditionText !== "" ? undefined : {backgroundColor: "#171717", pointerEvents: "none"}} onClick={addCondition}>
                        <p>ADD</p>
                    </div>
                    <div className="ConditionSubmitButton" onClick={clearCondition} style={props.conditions === "" ? {display: "none"} : undefined}>
                        <p>CLEAR ALL</p>
                    </div>
                </div>
            </div>
            <div className='WorkflowBlockReaction' style={checkActionParameters() ? undefined : {display: "none"}}>
                <p className="WorkflowBlockTitle">Reaction Services</p>
                <div className="ActionServices">
                    {reactionServices.map((service, key) => {
                        return (
                            <div className="WorkflowService" key={key}
                                style={service.name === props.reactionServiceActive?{boxShadow: "0px 0px 0px 2px #f10c23 inset"}:undefined}
                                onClick={() => {setServiceReactionActive(service)}}>
                                <div style={{display: "flex", justifyContent: "center"}}> 
                                    <img src={require("../../img/" + service.logo + ".png")} className="ServiceLogo" alt="Service_Logo" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='WorkflowBlockTrigger' style={props.reactionServiceActive === undefined?{display: "none"}:undefined}>
                <p className="WorkflowBlockTitle">Reactions</p>
                <div className="ActionServices">
                    {reactions.map((reaction, key) => {            
                        return (
                            <div className="WorkflowReaction" key={key} onClick={() => setActiveReaction(reaction)}
                            style={props.reactionActive === reaction.name?{boxShadow: "0px 0px 0px 2px #f10c23 inset"}:undefined}>
                                    <p className="TextInPanel">{reaction.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='WorkflowBlock' style={props.reactionActive === undefined?{display: "none"}:undefined}>
                <p className="WorkflowBlockTitle">Reaction Parameters</p>
                <div className="ActionServices">
                    {Object.keys(props.reactionParameters).map((parameter, key) => {
                        return (
                            <div className="Parameters" key={key}>
                                <p>{props.reactionParameters[parameter].name}</p>
                                <input className="TriggerInput"placeholder={"type: " + props.reactionParameters[parameter].type}
                                onChange={(event) => {changeReactionParameterValue(props.reactionParameters[parameter], event)}}></input>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}