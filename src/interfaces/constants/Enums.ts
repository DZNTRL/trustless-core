export enum ETags {
    any = "any",
    content = "content"
}
  
export interface IEnums {
    ETags: typeof ETags
}

export enum PrivateResponseMessages {
    NoRecordsUpdated = "No Records Updated"
}