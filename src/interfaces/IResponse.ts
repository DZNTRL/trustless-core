export interface IResponse<T> {
    Message: string
    IsError: boolean
    Data: T
}