import { IUserData } from "./iuser-data"

export interface IGetUserByPhoneNumberData {
    data: IUserData;
    status: number;
    code: string;
    message: string;
    location: string;
}