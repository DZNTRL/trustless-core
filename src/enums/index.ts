import  { ETags } from "./Etags"
import { ResponseMessages } from "./ResponseMessages"

export interface IEnums {
    ETags: typeof ETags
    ResponseMessages: typeof ResponseMessages
}

export const Enums: IEnums = {
    ETags,
    ResponseMessages
}

export default Enums