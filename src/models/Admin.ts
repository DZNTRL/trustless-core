import { MarkupTypes } from "pro-web-common/dist/js/enums/MarkupTypes"

export class Admin {
    id: number = 0
    title: string = ""
    slug: string = ""
    published: boolean = false
    markupType: MarkupTypes = MarkupTypes.html
    created: Date | null = null
    modified: Date | null = null
}