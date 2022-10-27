
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
            throw Error(`Expected ']' after '[' at character ${searchPos - 1}`, { cause: "handled" })
        }
        let substr = content.substring(searchPos, endPos)
        if (!/^[a-zA-Z0-9.]+$/i.test(substr)) {
            throw Error(`invalid characters in property get [${substr}], at character ${searchPos - 1}`, { cause: "handled" })
        }
        let splitted = substr.split('.')
        if (splitted[0] != 'Action') {
            throw Error(`Only properties from action is available in property get [${substr}], at character ${searchPos - 1}`, { cause: "handled" })
        }
        splitted.shift()
        var property = getPropertyFromArray(splitted, actionProperties)
        if (!property)
            throw Error(`property not found in property get [${substr}], at character ${searchPos - 1}`, { cause: "handled" })
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
        throw Error(`Missing quote close in condition, at character ${quoteStart}`, { cause: "handled"})
    return deleteQuotedThings(
        str.substring(0, quoteStart) +
        "_".repeat(1 + quoteEnd - quoteStart) +
        str.substring(quoteEnd + 1)
    )
}

export function checkSimpleCondition(condition: string, substringIndex: number, actionProperties: any) {
    var type: string | undefined = undefined
    var deletedQuote = deleteQuotedThings(condition)
    var operatorPos: number = -1
    var operator: string | undefined = undefined

    for (let i in CONDITION_OP_NBR) {
        operatorPos = deletedQuote.indexOf(i)
        if (operatorPos != -1) {
            type = 'number'
            operator = i
            break;
        }
    }
    if (!type || !operator) {
        for (let i in CONDITION_OP_STR) {
            operatorPos = deletedQuote.indexOf(i)
            if (operatorPos != -1) {
                type = 'number'
                operator = i
                break;
            }
        }
    }
    if (!type || !operator)
        throw Error(`No conditional operator, at character ${substringIndex}`, { cause: "handled" })
    console.log(operator)
}