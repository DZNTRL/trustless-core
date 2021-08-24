export enum ETags {
    any = "any",
    content = "content"
}
  
export interface IEnums {
    ETags: typeof ETags
}

export enum ResponseMessages {
    OK = 0,
    NoRecordsUpdated = 1,
    NotFound = 2,
    DataError = 3
}