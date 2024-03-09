/**
 * Testing Base64 encoding and decoding functions.
 */
export default class Test {
    /**
     * Run all the tests. All output is to the console.
     * @param {Base64Web|Base64Node} base64 An instance of the base64.wasm file that has been loaded.
     */
    static run(base64) {
        // Test encode function
        Test.testEncode(base64);

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
        arrayBuffer = new Uint8Array(7);
        // 000011 000010 000001 000000
        // 
        arrayBuffer[0] = 0xB2;
        arrayBuffer[1] = 0x37;
        arrayBuffer[2] = 0xA5;
        arrayBuffer[3] = 0xB2;
        arrayBuffer[4] = 0x37;
        arrayBuffer[5] = 0xA5;
        arrayBuffer[6] = 0xB2;
        result = base64.encode(arrayBuffer);
        if (result !== 'yeTpyeTpyC==') { console.log('ERROR: testEncode 9 ' + result); return; }

/*

        // Fill with values 0x00 to 0xFF
        for (let index = 0; index < 256; index++) arrayBuffer[index] = index;

        const base64Result = base64.encode(arrayBuffer);
*/
    }
}
