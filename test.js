/**
 * Testing Base64 encoding and decoding functions.
 */
export default class Test {
    /**
     * Run all the tests. All output is to the console.
     * @param {Base64Web|Base64Node} base64 An instance of the base64.wasm file that has been loaded.
     */
    static run(base64) {
        // Run test functions
        //Test.testEncode(base64);
        Test.testDecode(base64);
        //Test.testValidate(base64);

        // Log all done
        console.log('Done');
    }

    /**
     * Test the encode function.
     */
    static testEncode(base64) {
        // Test 1 (3 bytes from readme example)
        let arrayBuffer = new Uint8Array(3);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        let result = base64.encode(arrayBuffer);
        if (result !== 'yeTp') { console.log('ERROR: testEncode 1 ' + result); return; }

        // Test 2 (2 bytes for padding from readme example)
        arrayBuffer = new Uint8Array(2);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeD=') { console.log('ERROR: testEncode 2 ' + result); return; }

        // Test 3 (1 byte for padding from readme example)
        arrayBuffer = new Uint8Array(1);
        arrayBuffer[0] = 0xB2;
        result = base64.encode(arrayBuffer);
        if (result !== 'yC==') { console.log('ERROR: testEncode 3 ' + result); return; }

        // Test 4 (2 loops)
        arrayBuffer = new Uint8Array(6);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        arrayBuffer[3] = 0xB2;
        arrayBuffer[4] = 0x37;
        arrayBuffer[5] = 0xA5;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeTpyeTp') { console.log('ERROR: testEncode 4 ' + result); return; }

        // Test 5 (1 loop and 2 bytes for padding)
        arrayBuffer = new Uint8Array(5);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        arrayBuffer[3] = 0xB2;
        arrayBuffer[4] = 0x37;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeTpyeD=') { console.log('ERROR: testEncode 5 ' + result); return; }

        // Test 6 (1 loop and 1 byte for padding)
        arrayBuffer = new Uint8Array(4);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        arrayBuffer[3] = 0xB2;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeTpyC==') { console.log('ERROR: testEncode 6 ' + result); return; }

        // Test 7 (3 loops)
        arrayBuffer = new Uint8Array(9);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        arrayBuffer[3] = 0xB2;
        arrayBuffer[4] = 0x37;
        arrayBuffer[5] = 0xA5;
        arrayBuffer[6] = 0xB2;
        arrayBuffer[7] = 0x37;
        arrayBuffer[8] = 0xA5;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeTpyeTpyeTp') { console.log('ERROR: testEncode 7 ' + result); return; }

        // Test 8 (2 loop and 2 bytes for padding)
        arrayBuffer = new Uint8Array(8);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        arrayBuffer[3] = 0xB2;
        arrayBuffer[4] = 0x37;
        arrayBuffer[5] = 0xA5;
        arrayBuffer[6] = 0xB2;
        arrayBuffer[7] = 0x37;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeTpyeTpyeD=') { console.log('ERROR: testEncode 8 ' + result); return; }

        // Test 9 (2 loop and 1 byte for padding)
        arrayBuffer = new Uint8Array(7);
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        arrayBuffer[3] = 0xB2;
        arrayBuffer[4] = 0x37;
        arrayBuffer[5] = 0xA5;
        arrayBuffer[6] = 0xB2;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeTpyeTpyC==') { console.log('ERROR: testEncode 9 ' + result); return; }

        // Test 10 (get all base64 character)
        arrayBuffer = new Uint8Array(48);
        arrayBuffer[0] = 0x40;
        arrayBuffer[1] = 0x20;
        arrayBuffer[2] = 0x0C;
        arrayBuffer[3] = 0x44;
        arrayBuffer[4] = 0x61;
        arrayBuffer[5] = 0x1C;
        arrayBuffer[6] = 0x48;
        arrayBuffer[7] = 0xA2;
        arrayBuffer[8] = 0x2C;
        arrayBuffer[9] = 0x4C;
        arrayBuffer[10] = 0xE3;
        arrayBuffer[11] = 0x3C;
        arrayBuffer[12] = 0x50;
        arrayBuffer[13] = 0x24;
        arrayBuffer[14] = 0x4D;
        arrayBuffer[15] = 0x54;
        arrayBuffer[16] = 0x65;
        arrayBuffer[17] = 0x5D;
        arrayBuffer[18] = 0x58;
        arrayBuffer[19] = 0xA6;
        arrayBuffer[20] = 0x6D;
        arrayBuffer[21] = 0x5C;
        arrayBuffer[22] = 0xE7;
        arrayBuffer[23] = 0x7D;
        arrayBuffer[24] = 0x60;
        arrayBuffer[25] = 0x28;
        arrayBuffer[26] = 0x8E;
        arrayBuffer[27] = 0x64;
        arrayBuffer[28] = 0x69;
        arrayBuffer[29] = 0x9E;
        arrayBuffer[30] = 0x68;
        arrayBuffer[31] = 0xAA;
        arrayBuffer[32] = 0xAE;
        arrayBuffer[33] = 0x6C;
        arrayBuffer[34] = 0xEB;
        arrayBuffer[35] = 0xBE;
        arrayBuffer[36] = 0x70;
        arrayBuffer[37] = 0x2C;
        arrayBuffer[38] = 0xCF;
        arrayBuffer[39] = 0x74;
        arrayBuffer[40] = 0x6D;
        arrayBuffer[41] = 0xDF;
        arrayBuffer[42] = 0x78;
        arrayBuffer[43] = 0xAE;
        arrayBuffer[44] = 0xEF;
        arrayBuffer[45] = 0x7C;
        arrayBuffer[46] = 0xEF;
        arrayBuffer[47] = 0xFF;
        result = base64.encode(arrayBuffer);
        if (result !== 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/') { console.log('ERROR: testEncode 10 ' + result); return; }

/*

        // Fill with values 0x00 to 0xFF
        for (let index = 0; index < 256; index++) arrayBuffer[index] = index;

        const base64Result = base64.encode(arrayBuffer);
*/
    }

    /**
     * Test the decode function.
     */
    static testDecode(base64) {
        // Set error
        let error = false;

        // Test 1 (3 bytes from readme example)
        let arrayBuffer = base64.decode('yeTp');
        if (arrayBuffer.length !== 3) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (arrayBuffer[2] !== 0xA5) error = true;
        if (error === true) { console.log('ERROR: testDecode 1'); return; }

        // Test 2 (2 bytes for padding from readme example)
        arrayBuffer = base64.decode('yeD=');
        if (arrayBuffer.length !== 2) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (error === true) { console.log('ERROR: testDecode 2'); return; }

        // Test 3 (1 byte for padding from readme example)
        arrayBuffer = base64.decode('yC==');
        if (arrayBuffer.length !== 1) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (error === true) { console.log('ERROR: testDecode 3'); return; }

        // Test 4 (2 loops)
        arrayBuffer = base64.decode('yeTpyeTp');
        if (arrayBuffer.length !== 6) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (arrayBuffer[2] !== 0xA5) error = true;
        if (arrayBuffer[3] !== 0xB2) error = true;
        if (arrayBuffer[4] !== 0x37) error = true;
        if (arrayBuffer[5] !== 0xA5) error = true;
        if (error === true) { console.log('ERROR: testDecode 4'); return; }

        // Test 5 (1 loop and 2 bytes for padding)
        arrayBuffer = base64.decode('yeTpyeD=');
        if (arrayBuffer.length !== 5) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (arrayBuffer[2] !== 0xA5) error = true;
        if (arrayBuffer[3] !== 0xB2) error = true;
        if (arrayBuffer[4] !== 0x37) error = true;
        if (error === true) { console.log('ERROR: testDecode 5'); return; }

        // Test 6 (1 loop and 1 byte for padding)
        arrayBuffer = base64.decode('yeTpyC==');
        if (arrayBuffer.length !== 4) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (arrayBuffer[2] !== 0xA5) error = true;
        if (arrayBuffer[3] !== 0xB2) error = true;
        if (error === true) { console.log('ERROR: testDecode 6'); return; }

        // Test 7 (3 loops)
        arrayBuffer = base64.decode('yeTpyeTpyeTp');
        if (arrayBuffer.length !== 9) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (arrayBuffer[2] !== 0xA5) error = true;
        if (arrayBuffer[3] !== 0xB2) error = true;
        if (arrayBuffer[4] !== 0x37) error = true;
        if (arrayBuffer[5] !== 0xA5) error = true;
        if (arrayBuffer[6] !== 0xB2) error = true;
        if (arrayBuffer[7] !== 0x37) error = true;
        if (arrayBuffer[8] !== 0xA5) error = true;
        if (error === true) { console.log('ERROR: testDecode 7'); return; }

        // Test 8 (2 loop and 2 bytes for padding)
        arrayBuffer = base64.decode('yeTpyeTpyeD=');
        if (arrayBuffer.length !== 8) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (arrayBuffer[2] !== 0xA5) error = true;
        if (arrayBuffer[3] !== 0xB2) error = true;
        if (arrayBuffer[4] !== 0x37) error = true;
        if (arrayBuffer[5] !== 0xA5) error = true;
        if (arrayBuffer[6] !== 0xB2) error = true;
        if (arrayBuffer[7] !== 0x37) error = true;
        if (error === true) { console.log('ERROR: testDecode 8'); return; }

        // Test 9 (2 loop and 1 byte for padding)
        arrayBuffer = base64.decode('yeTpyeTpyC==');
        if (arrayBuffer.length !== 7) error = true;
        if (arrayBuffer[0] !== 0xB2) error = true;
        if (arrayBuffer[1] !== 0x37) error = true;
        if (arrayBuffer[2] !== 0xA5) error = true;
        if (arrayBuffer[3] !== 0xB2) error = true;
        if (arrayBuffer[4] !== 0x37) error = true;
        if (arrayBuffer[5] !== 0xA5) error = true;
        if (arrayBuffer[6] !== 0xB2) error = true;
        if (error === true) { console.log('ERROR: testDecode 9'); return; }

        // Test 10 (get all base64 character)
        arrayBuffer = base64.decode('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');
        if (arrayBuffer.length !== 48) error = true;
        if (arrayBuffer[0] !== 0x40) error = true;
        if (arrayBuffer[1] !== 0x20) error = true;
        if (arrayBuffer[2] !== 0x0C) error = true;
        if (arrayBuffer[3] !== 0x44) error = true;
        if (arrayBuffer[4] !== 0x61) error = true;
        if (arrayBuffer[5] !== 0x1C) error = true;
        if (arrayBuffer[6] !== 0x48) error = true;
        if (arrayBuffer[7] !== 0xA2) error = true;
        if (arrayBuffer[8] !== 0x2C) error = true;
        if (arrayBuffer[9] !== 0x4C) error = true;
        if (arrayBuffer[10] !== 0xE3) error = true;
        if (arrayBuffer[11] !== 0x3C) error = true;
        if (arrayBuffer[12] !== 0x50) error = true;
        if (arrayBuffer[13] !== 0x24) error = true;
        if (arrayBuffer[14] !== 0x4D) error = true;
        if (arrayBuffer[15] !== 0x54) error = true;
        if (arrayBuffer[16] !== 0x65) error = true;
        if (arrayBuffer[17] !== 0x5D) error = true;
        if (arrayBuffer[18] !== 0x58) error = true;
        if (arrayBuffer[19] !== 0xA6) error = true;
        if (arrayBuffer[20] !== 0x6D) error = true;
        if (arrayBuffer[21] !== 0x5C) error = true;
        if (arrayBuffer[22] !== 0xE7) error = true;
        if (arrayBuffer[23] !== 0x7D) error = true;
        if (arrayBuffer[24] !== 0x60) error = true;
        if (arrayBuffer[25] !== 0x28) error = true;
        if (arrayBuffer[26] !== 0x8E) error = true;
        if (arrayBuffer[27] !== 0x64) error = true;
        if (arrayBuffer[28] !== 0x69) error = true;
        if (arrayBuffer[29] !== 0x9E) error = true;
        if (arrayBuffer[30] !== 0x68) error = true;
        if (arrayBuffer[31] !== 0xAA) error = true;
        if (arrayBuffer[32] !== 0xAE) error = true;
        if (arrayBuffer[33] !== 0x6C) error = true;
        if (arrayBuffer[34] !== 0xEB) error = true;
        if (arrayBuffer[35] !== 0xBE) error = true;
        if (arrayBuffer[36] !== 0x70) error = true;
        if (arrayBuffer[37] !== 0x2C) error = true;
        if (arrayBuffer[38] !== 0xCF) error = true;
        if (arrayBuffer[39] !== 0x74) error = true;
        if (arrayBuffer[40] !== 0x6D) error = true;
        if (arrayBuffer[41] !== 0xDF) error = true;
        if (arrayBuffer[42] !== 0x78) error = true;
        if (arrayBuffer[43] !== 0xAE) error = true;
        if (arrayBuffer[44] !== 0xEF) error = true;
        if (arrayBuffer[45] !== 0x7C) error = true;
        if (arrayBuffer[46] !== 0xEF) error = true;
        if (arrayBuffer[47] !== 0xFF) error = true;
        if (error === true) { console.log('ERROR: testDecode 10'); return; }
    }

    /**
     * Test the validate function.
     */
    static testValidate(base64) {
        // Test 1, invalid parameter
        if (base64.validate() === true) { console.log('ERROR: testValidate 1,1'); return; }
        if (base64.validate(null) === true) { console.log('ERROR: testValidate 1,2'); return; }
        if (base64.validate(123) === true) { console.log('ERROR: testValidate 1,3'); return; }
        if (base64.validate(true) === true) { console.log('ERROR: testValidate 1,4'); return; }
        if (base64.validate(new Date()) === true) { console.log('ERROR: testValidate 1,5'); return; }

        // Test 2, wrong length
        if (base64.validate('') === true) { console.log('ERROR: testValidate 2,1'); return; }
        if (base64.validate('a') === true) { console.log('ERROR: testValidate 2,2'); return; }
        if (base64.validate('abc') === true) { console.log('ERROR: testValidate 2,3'); return; }
        if (base64.validate('abcde') === true) { console.log('ERROR: testValidate 2,4'); return; }
        if (base64.validate('abcdef') === true) { console.log('ERROR: testValidate 2,5'); return; }
        if (base64.validate('abcdefg') === true) { console.log('ERROR: testValidate 2,6'); return; }

        // Test 3, valid length
        if (base64.validate('abcd') === false) { console.log('ERROR: testValidate 3,1'); return; }
        if (base64.validate('abcdefgh') === false) { console.log('ERROR: testValidate 3,2'); return; }
        if (base64.validate('abcdefghijkl') === false) { console.log('ERROR: testValidate 3,3'); return; }

        // Test 4, valid padding
        if (base64.validate('abc=') === false) { console.log('ERROR: testValidate 4,1'); return; }
        if (base64.validate('ab==') === false) { console.log('ERROR: testValidate 4,2'); return; }
        if (base64.validate('abcdefg=') === false) { console.log('ERROR: testValidate 4,3'); return; }
        if (base64.validate('abcdef==') === false) { console.log('ERROR: testValidate 4,4'); return; }

        // Test 5, invalid padding
        if (base64.validate('a===') === true) { console.log('ERROR: testValidate 5,1'); return; }
        if (base64.validate('abcde===') === true) { console.log('ERROR: testValidate 5,2'); return; }
        if (base64.validate('a=bc') === true) { console.log('ERROR: testValidate 5,3'); return; }
        if (base64.validate('ab=d') === true) { console.log('ERROR: testValidate 5,4'); return; }
        if (base64.validate('abcde=gh') === true) { console.log('ERROR: testValidate 5,5'); return; }
        if (base64.validate('abcdef=h') === true) { console.log('ERROR: testValidate 5,6'); return; }

        // Test 6, invalid characters
        if (base64.validate('$%^&') === true) { console.log('ERROR: testValidate 6,1'); return; }

        // Test 7, valid characters
        if (base64.validate('abcdefghijklmnopqrstuvwxyz12') === false) { console.log('ERROR: testValidate 7,1'); return; }
        if (base64.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZ12') === false) { console.log('ERROR: testValidate 7,2'); return; }
        if (base64.validate('0123456789+/') === false) { console.log('ERROR: testValidate 7,3'); return; }
        if (base64.validate('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/') === false) { console.log('ERROR: testValidate 7,4'); return; }

    }

}
