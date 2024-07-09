export class Token {
    private _token!: string;
    private _tokenType!: string;
    private _tokenExpirationDate!: Date;
    private expiresIn!: number;

    constructor(tokenCode: string) {
        this.setTokenData(tokenCode);
    }

    setTokenData(code: string) {
        let token: any = JSON.parse(code.replace(/\\|\//g, ''));
        this._token = token['access_token'];
        this.expiresIn = 2147483647;
        this.expiresIn = +token['expires_in'];
        this._tokenExpirationDate = new Date(new Date().getTime() + 2147483647);
        // this.expiresIn = +token['expires_in'];
        // this._tokenExpirationDate = new Date(
        //   new Date().getTime() + this.expiresIn * 1000
        // );
        this._tokenType = token['token_type'];
    }
}
