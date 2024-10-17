const { range } = require("lodash");

class PsiDataExtractor {

    static extractPrivateParams(params) {
        const zeroString = '0000000000000000000000000000000000000000000000000000000000000000';
        let data = Buffer(params.slice()[5]).toString('hex');

        let args = data.substring(8);                               // The length in hex symbols for the method call is 8

        let argArray = [];                                          // Array containing the arguments in 32 Byte words
        let privateArgs = [];                                       // Array containing the private arguments
        let newDataStr = '';                                        // String containing the arguments with the private ones replaced by ‘0’
        let privateArgsStr = '';                                    // String containing the arguments including the private ones

        let i = 0;
        while (i < args.length) {
            argArray.push(args.substring(i, i + 64));               // Arguments are obtained in 32-byte words
            i += 64
        }

        privateArgs = argArray.slice(2, 2 + parseInt(argArray[1])); //Private arguments are obtained (argArray[1] is the size of the private arguments which start at position 2 - position 1 is the offset)

        for (i in range(0, 2)) {                                    // First 2 words are the ones that are not private
            newDataStr += argArray[i];
            privateArgsStr += argArray[i];
        }

        for (i in range(0, parseInt(argArray[1]))) {                // Private arguments are replaced by ‘0’
            newDataStr += zeroString;
        }

        const blindedTransaction = data.substring(0, 8) + newDataStr;

        for (i in range(0, privateArgs.length)) {
            privateArgsStr += privateArgs[i];
        }

        return [Buffer.from(blindedTransaction, 'hex'), Buffer.from(privateArgsStr, 'hex')];
    }

}

module.exports = PsiDataExtractor;