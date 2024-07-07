import { IUserData } from "./iuser-data"

export interface ILoginReturnData {
    data: {
        user: IUserData;
        token: string;
        twoFactorAuthEnabled: boolean;
    };
    status: number;
    code: string;
    message: string;
    location: string;
}
