import axios from "axios"
import { AreaError } from "~/core/errors"


export async function getPageId(token: string, pageUrl: string): Promise<string> {
    let res = await axios.post("https://api.notion.com/v1/search", {
        query: pageUrl,
        filter: {
            property: "object",
            value: "page"
        }
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "Notion-Version": "2022-06-28"
        }
    })
    for (let i of (res.data.results as any[])) {
        if ((i.url as string).includes(pageUrl)) {
            return i.id
        }
    }
    throw new AreaError(`Link '${pageUrl} does not exists'`, 404)
}