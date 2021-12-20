// Lets do some TDD (i will try :D)

import Auth from '../utils/auth';
import Cbu from '../utils/cbu';

describe('CBU generation tests', () => {
    const accountNumber = "0000000000121";
    const branchCode = "0001";
    const cbu = new Cbu(accountNumber, branchCode);

    test('Account number has length of 13', (done) => {
        const accountNumber = Auth.getAccountNumber("121");
        expect(accountNumber).toBe("0000000000121");
        done();
    });

    test("Should generate cbu first verification digit", (done) => {
        const firstVerificationDigit = cbu.getFirstVerificationDigit();
        expect(firstVerificationDigit).toBe("8");
        done();
    });

    test("Should generate cbu second verification digit", (done) => {
        const secondVerificationDigit = cbu.getSecondVerificationDigit();
        expect(secondVerificationDigit).toBe("8");
        done();
    });

    test("Should generate cbu", done => {
        const cbuGenerated = cbu.getCbu();
        expect(cbuGenerated).toBe("9990001800000000001218");
        done();
    });

    test("Should verify a valid cbu", done => {
        const cbuGenerated = "9991234300000000000055";
        expect(cbu.verifyCbu(cbuGenerated)).toBe(true);
        done();
    });
});