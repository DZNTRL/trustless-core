import { IResponse } from "../interfaces/IResponse"
export class Response<T> implements IResponse<T> {
    Message: string = ""
    Data: T | null = null
    IsError: boolean = false
    constructor(Data: T = null, Message: string = "", IsError: boolean = false) {
        this.Data = Data    
        this.Message = Message
        this.IsError = IsError
    }   
}