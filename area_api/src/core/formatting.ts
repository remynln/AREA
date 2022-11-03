import { ParsingError } from "./errors";

function getPropertyFromArray(arr: string[], property: any): string | number | undefined {
    if (!property)
        return undefined
    if (arr.length == 0) {
        if (typeof property == 'string' || typeof property == 'number')
            return property;
        else
            return undefined
    }
    let prop = arr.shift()
    return getPropertyFromArray(arr, property[prop || ''])
}

export function formatContent(content: string, actionProperties: any) {
    var searchPos = 0
    var endPos = 0

    while (true) {
        searchPos = content.indexOf("[", searchPos) + 1 || -1
        if (searchPos == -1)
            break
        if (searchPos > 1 && content[searchPos - 2] == '\\')
            continue
        endPos = content.indexOf("]", searchPos) || -1
        if (endPos == -1) {
            throw new ParsingError(`Expected ']' after '['`, searchPos - 1)
        }
        let substr = content.substring(searchPos, endPos)
        if (!/^[a-zA-Z0-9.]+$/i.test(substr)) {
            throw new ParsingError(`invalid characters in property get [${substr}]`, searchPos - 1)
        }
        let splitted = substr.split('.')
        if (splitted[0] != 'Action') {
            throw new ParsingError(`Only properties from action is available in property get [${substr}]`, searchPos - 1)
        }
        splitted.shift()
        var property = getPropertyFromArray(splitted, actionProperties)
        if (!property)
            throw new ParsingError(`property not found in property get [${substr}]`, searchPos - 1)
        content = content.substring(0, searchPos - 1)
            + property.toString()
            + content.substring(endPos + 1)
    }
    return content
}



// the conditions must be ordered by str length
const CONDITION_OP_STR = {
     '==': (v1: string, v2: string) => v1 == v2,
     '!=': (v1: string, v2: string) => v1 != v2,
     'in': (v1: string, v2: string) => v2.includes(v1),
}

const CONDITION_OP_NBR = {
    '==': (v1: number, v2: number) => v1 == v2,
    '!=': (v1: number, v2: number) => v1 != v2,
    '<=': (v1: number, v2: number) => v1 <= v2,
    '>=': (v1: number, v2: number) => v1 >= v2,
    '<': (v1: number, v2: number) => v1 < v2,
    '>': (v1: number, v2: number) => v1 > v2
}

function deleteQuotedThings(str: string, start: number = 0): string {
    let quoteStart = str.indexOf('"', 0)
    if (quoteStart == -1)
        return str
    let quoteEnd = str.indexOf('"', quoteStart + 1)
    if (quoteEnd == -1)
        throw new ParsingError(`Missing quote close in condition`, quoteStart)
    return deleteQuotedThings(
        str.substring(0, quoteStart) +
        "_".repeat(1 + quoteEnd - quoteStart) +
        str.substring(quoteEnd + 1)
    )
}

function checkParsedCondition(
    v1: string,
    op: string, type: string,
    v2: string, actionProperties: any,
    substringIndex: number
) {
    var values = []
    for (let v of [v1, v2]) {
        if (v.startsWith('"')) {
            if (!type.includes('string'))
                throw new ParsingError(`${v} have invalid type 'string' for operator ${op}`, substringIndex)
            values.push(v.substring(1, v.length - 1))
        } else if (!Number.isNaN(Number(v))) {
            if (!type.includes("number")) {
                throw new ParsingError(`Invalid type 'int' of '${v}' for operator '${op}'`, substringIndex)
            }
            values.push(Number(v))
        } else {
            let splitted = v.split('.')
            if (splitted[0] != 'Action')
                throw new ParsingError(`Only properties from action is available in property get '${v}'`, substringIndex)
            splitted.shift()
            let property = getPropertyFromArray(splitted, actionProperties)
            if (!property)
                throw new ParsingError(`property not found in property get '${v}'`, substringIndex)
            if (!type.includes(typeof property)) {
                throw new ParsingError(`Invalid property type ${typeof property} of '${property} for operator ${op}'`, substringIndex)
            }
            values.push(property)
        }
    }
    if (typeof values[0] == 'number' && typeof values[1] == 'number') {
        return CONDITION_OP_NBR[op as keyof typeof CONDITION_OP_NBR](values[0], values[1])
    }
    if (typeof values[0] == 'string' && typeof values[1] == 'string') {
        return CONDITION_OP_STR[op as keyof typeof CONDITION_OP_STR](values[0], values[1])
    }
    throw new ParsingError(`incompatible types ${typeof values[0]} of ${values[0]} and ${typeof values[1]} of ${values[1]}`, substringIndex)
}

export function checkSimpleCondition(condition: string, substringIndex: number, actionProperties: any) {
    var type: string | undefined = undefined
    condition = condition.trim()
    var deletedQuote = deleteQuotedThings(condition)
    var operatorPos: number = -1
    var operator: string | undefined = undefined
    if (condition == "true" || condition == "false") {
        return condition == "true" ? true : false
    }
    for (let i in CONDITION_OP_NBR) {
        operatorPos = deletedQuote.indexOf(i)
        if (operatorPos != -1) {
            operator = i
            type = CONDITION_OP_STR[operator as keyof typeof CONDITION_OP_STR] ? 'number or string' : 'number'
            break;
        }
    }
    if (!operator) {
        for (let i in CONDITION_OP_STR) {
            operatorPos = deletedQuote.indexOf(i)
            if (operatorPos != -1) {
                type = 'string'
                operator = i
                break;
            }
        }
    }
    if (!type || !operator)
        throw new ParsingError(`No conditional operator`, substringIndex)
    return checkParsedCondition(
        condition.substring(0, operatorPos).trim(),
        operator, type,
        condition.substring(operatorPos + operator.length).trim(),
        actionProperties,
        substringIndex
    )
}

function getBetween(withoutQuoteCondition: string, opPos: number) {
    var res = [0, withoutQuoteCondition.length]
    for (let i = opPos - 2; i > 0; i--) {
        let curr = withoutQuoteCondition[i]
        if (curr.startsWith("&&") || curr.startsWith("||")) {
            res[0] = i + 2
            break;
        }
    }
    let endAnd = withoutQuoteCondition.indexOf("&&", opPos + 2)
    let endOr = withoutQuoteCondition.indexOf("||", opPos + 2)
    if (endAnd < endOr && endAnd != -1) {
        res[1] = endAnd
    } else if (endOr != -1) {
        res[1] = endOr
    }
    return res;
}

export function checkCondition(conditionStr: string, actionProperties: any): boolean {
    var condition = conditionStr.trim()
    var withoutQuotes = deleteQuotedThings(conditionStr)
    var openParenthesis = withoutQuotes.indexOf('(')
    while (openParenthesis != -1) {
        let closeParenthesis = withoutQuotes.indexOf(')')
        if (closeParenthesis == -1)
            throw new ParsingError(`Expected ')' after '('`, openParenthesis)
        let ret = checkCondition(condition.substring(openParenthesis + 1, closeParenthesis), actionProperties)
        condition = condition.substring(0, openParenthesis) +
            (ret ? " true " : " false ") +
            condition.substring(closeParenthesis + 1)
        withoutQuotes = deleteQuotedThings(condition)
        openParenthesis = withoutQuotes.indexOf('(', openParenthesis)
    }
    var and = withoutQuotes.indexOf("&&")
    while (and != -1) {
        let between = getBetween(withoutQuotes, and)
        let ret = checkSimpleCondition(condition.substring(between[0], and), between[0], actionProperties)
            && checkSimpleCondition(condition.substring(and + 2, between[1]), and + 2, actionProperties)
        condition = condition.substring(0, between[0]) +
            (ret ? " true " : " false ") +
            condition.substring(between[1])
        withoutQuotes = deleteQuotedThings(condition)
        and = withoutQuotes.indexOf('&&', and)
    }
    var or = withoutQuotes.indexOf("||")
    while (or != -1) {
        let between = getBetween(withoutQuotes, or)
        let ret = checkSimpleCondition(condition.substring(between[0], or), between[0], actionProperties)
            || checkSimpleCondition(condition.substring(or + 2, between[1]), or + 2, actionProperties)
        condition = condition.substring(0, between[0]) +
            (ret ? " true " : " false ") +
            condition.substring(between[1])
        withoutQuotes = deleteQuotedThings(condition)
        or = withoutQuotes.indexOf('||', or)
    }
    return checkSimpleCondition(condition, 0, actionProperties)
}

function concretisePropertyType(actionPropertiesType: any): any
{
    var actionProperties: any = {}

    for (let i in actionPropertiesType) {
        if (actionPropertiesType[i] == 'string')
            actionProperties[i] = "abc" as string
        else if (actionPropertiesType[i] == 'number')
            actionProperties[i] = 1 as number
        else
            actionProperties[i] = concretisePropertyType(actionPropertiesType[i])
    }
    return actionProperties
}

export function checkConditionSyntax(
    conditionStr: string,
    actionPropertiesType: any
) {
    checkCondition(conditionStr, concretisePropertyType(actionPropertiesType))
}