
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