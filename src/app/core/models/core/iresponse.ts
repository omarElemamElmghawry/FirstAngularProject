export interface IResponse<dataType> {
    data: dataType;
    status: number;
    code: any;
    message: any;
    location: any;
}
