class Cbu {
    accountNumber: string
    bankCode: string
    branchCode: string
    firstVerificationPatternArray: number[]
    secondVerificationPatternArray: number[]

    constructor(accountNumber: string, branchCode: string) {
        this.accountNumber = accountNumber;
        this.bankCode = "999";
        this.branchCode = branchCode;
        this.firstVerificationPatternArray = [7, 1, 3, 9, 7, 1, 3];
        this.secondVerificationPatternArray = [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3];
    }

    public calculateDigit(verificationPatternArray: number[], codeDigitsArray: string[]) {
        let sum1 = 0;
        verificationPatternArray.forEach((multiple, index) => {
            sum1 += parseInt(codeDigitsArray[index]) * multiple;
        });
        const lastDigit = JSON.stringify(sum1).split("")[JSON.stringify(sum1).length - 1];
        const delta = 10 - parseInt(lastDigit);
        return JSON.stringify(delta);
    }

    public getFirstVerificationDigit(): string {
        const codeDigitsArray = [...this.bankCode.split(""), ...this.branchCode.split("")];

        return this.calculateDigit(this.firstVerificationPatternArray, codeDigitsArray);
    }

    public getSecondVerificationDigit(): string {
        const codeDigitsArray = [...this.accountNumber.split("")];

        return this.calculateDigit(this.secondVerificationPatternArray, codeDigitsArray);
    }

    public getCbu(): string {
        if (!this.branchCode || !this.accountNumber) {
            throw new Error("Invalid branch code");
        }

        const firstVerificationCode = this.getFirstVerificationDigit();
        const secondVerificationCode = this.getSecondVerificationDigit();
        return `${this.bankCode}${this.branchCode}${firstVerificationCode}${this.accountNumber}${secondVerificationCode}`;
    }

    public verifyCbu(cbu: string): boolean {
        const firstVerificationCode = this.calculateDigit(this.firstVerificationPatternArray, cbu.substr(0, 7).split(""));
        const secondVerificationCode = this.calculateDigit(this.secondVerificationPatternArray, cbu.substr(8, 13).split(""));

        return firstVerificationCode === cbu[7] && secondVerificationCode === cbu[21];
    }
}

export default Cbu;