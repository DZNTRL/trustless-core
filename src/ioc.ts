import { User as UserRepo } from "./repos/User"
import { IUser as IUserRepo } from "pro-web-common/dist/js/interfaces/repo/IUser"
import { RepoArgs } from "./RepoArgs"

export interface IInjections {
    UserRepo: IUserRepo
}

export const defaultInjections: (repoArgs: RepoArgs) => IInjections = ({pool}) => {
    return {
        UserRepo: new UserRepo({pool})
    }
}
