import { IResponse } from "pro-web-common/dist/js/interfaces/IResponse"
import { ResponseMessages } from "../enums/ResponseMessages"

export class Response<T> implements IResponse<T> {    
    Message: string = ResponseMessages.OK.toString()
    Data: T | null = null
    IsError: boolean = false
    constructor(Data: T = null, Message: string = "", IsError: boolean = false) {
        this.Data = Data    
        this.Message = Message ? Message : this.Message
        this.IsError = IsError
    }   
}