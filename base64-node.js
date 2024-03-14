/**
 * Base64 for use in NodeJS.
 */
import { readFile } from "node:fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';

export default class Base64Node  {
    /**
     * Fetch and load the WASM file.
     * @return {Promise} A promise.
     */
    async load() {
        // Set memory page size (1 page = 64kb)
        this._memoryPageSize = 1;

        // Create memory to the starting page size
        this._memory = new WebAssembly.Memory({ initial: this._memoryPageSize });

        // Set options
        const options = {
            import: {
                memory: this._memory
            }
        }

        // Get current folder
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Read WASM data
        const wasmBuffer = await readFile(__dirname + '/base64.wasm');

        // Create WASM data from buffer
        const wasmData = new Uint8Array(wasmBuffer);

        // Instantiate the WASM data
        this._wasm = await WebAssembly.instantiate(wasmData, options);
    }

    /**
     * Encode the given data into a base64 string.
     * @param {ArrayBuffer} arrayBuffer The data to encode.
     * @return {String} The base64 encoded string of the data given.
     */
    encode(arrayBuffer) {
        // Convert into byte array
        const byteArray = new Uint8Array(arrayBuffer);

        // Set byte array length (in bytes)
        const byteArrayLength = byteArray.length;

        // Set base64 length (that will be created, in bytes)
        const base64Length = Math.ceil(byteArrayLength / 3) * 4;

        // Set total memory needed (include encode lookup array at the start)
        const totalMemorySize = 64 + byteArrayLength + base64Length;

        // Set bytes per page amount
        const bytesPerPage = 64 * 1024;

        // Set the page size required
        const pageSizeRequired = Math.ceil(totalMemorySize / bytesPerPage);

        // If we need to increase the memory page size
        if (pageSizeRequired > this._memoryPageSize) {
            // Grow the memory
            this._memory.grow(pageSizeRequired);

            // Reset the memory page size
            this._memoryPageSize = pageSizeRequired;
        }

        // Set memory offsets
        const arrayOffset = 64;
        const base64Offset = 64 + byteArrayLength;
        
        // Create Uint8Array of the memory buffer
        const memoryUint8Array = new Uint8Array(this._memory.buffer);

        // Copy the array buffer into the WASM memory
        memoryUint8Array.set(byteArray, arrayOffset);

        // Encode the array into base64
        this._wasm.instance.exports.encode(arrayOffset, byteArrayLength, base64Offset, base64Length);

        // Create Uint8Array from the WASM memory containing only the text
        const uint8ArrayText = new Uint8Array(this._memory.buffer, base64Offset, base64Length);

        // Create text decoder and decode the Uint8Array to (UTC-8) text
        const textDecoder = new TextDecoder("UTF-8");
        const base64 = textDecoder.decode(uint8ArrayText);

        // Return the base64 text result
        return base64;
    }

    /**
     * Decode the given base64 string into an array buffer.
     * @param {String} base64 The base64 encoded string.
     * @param {Boolean} [trusted=false] Is the base64 coming from a trusted source, or does it need validating first.
     * @return {ArrayBuffer} The array of data that was encoded in the string or null if invalid data.
     */
    decode(base64, trusted) {
        // Check parameter
        if (!base64) return null;
        if (typeof base64 !== 'string') return null;
        if (base64.length === 0) return null;

        // Set the base length (in bytes)
        const base64Length = base64.length;

        // If not divisible by 4 (i.e. there are remainders, therefore invalid)
        if (base64Length % 4) return null;

        // Set array length (that will be created, in bytes)
        let arrayLength = Math.ceil(base64Length / 4) * 3;

        // If padding used
        if (base64.endsWith('==') === true) arrayLength -= 2;
        else if (base64.endsWith('=') === true) arrayLength -= 1;

        // Set total memory needed (include decode lookup array at the start)
        const totalMemorySize = 256 + base64Length + arrayLength;

        // Set bytes per page amount
        const bytesPerPage = 64 * 1024;

        // Set the page size required
        const pageSizeRequired = Math.ceil(totalMemorySize / bytesPerPage);

        // If we need to increase the memory page size
        if (pageSizeRequired > this._memoryPageSize) {
            // Grow the memory
            this._memory.grow(pageSizeRequired);

            // Reset the memory page size
            this._memoryPageSize = pageSizeRequired;
        }

        // Set memory offsets
        const base64Offset = 256;
        const arrayOffset = 256 + base64Length;

        // Create text encoder and create the Uint8Array (UTC-8) of the base64 text
        let encoder = new TextEncoder();
        let base64Memory = encoder.encode(base64);
        
        // Create Uint8Array of the memory buffer
        const memoryUint8Array = new Uint8Array(this._memory.buffer);
        
        // Copy the base64 text into the WASM memory
        memoryUint8Array.set(base64Memory, base64Offset);

        // If not trusted
        if (trusted !== true) {
            // Validate the base64 data
            if (this._wasm.instance.exports.validate(base64Offset, base64Length) === 0) return null;
        }

        // Decode the base64 text into array
        this._wasm.instance.exports.decode(base64Offset, base64Length, arrayOffset, arrayLength);

        // Create Uint8Array from the WASM memory containing array buffer
        const arrayBuffer = new Uint8Array(this._memory.buffer, arrayOffset, arrayLength);

        // Return the array buffer result
        return arrayBuffer;
    }

    /**
     * Validate the given base64 string.
     * @param {String} base64 The base64 encoded string.
     * @return {Boolean} 
     */
    validate(base64) {
        // Check parameter
        if (!base64) return false;
        if (typeof base64 !== 'string') return false;
        if (base64.length === 0) return false;

        // Set the base length (in bytes)
        const base64Length = base64.length;

        // Set total memory needed (include validate lookup array at the start)
        const totalMemorySize = 256 + base64Length;

        // Set bytes per page amount
        const bytesPerPage = 64 * 1024;

        // Set the page size required
        const pageSizeRequired = Math.ceil(totalMemorySize / bytesPerPage);

        // If we need to increase the memory page size
        if (pageSizeRequired > this._memoryPageSize) {
            // Grow the memory
            this._memory.grow(pageSizeRequired);

            // Reset the memory page size
            this._memoryPageSize = pageSizeRequired;
        }

        // Create text encoder and create the Uint8Array (UTC-8) of the base64 text
        let encoder = new TextEncoder();
        let base64Memory = encoder.encode(base64);

        // Set memory offsets
        const base64Offset = 256;
        
        // Create Uint8Array of the memory buffer
        const memoryUint8Array = new Uint8Array(this._memory.buffer);

        // Copy the base64 text into the WASM memory
        memoryUint8Array.set(base64Memory, base64Offset);

        // Validate the base64 text
        const result = this._wasm.instance.exports.validate(base64Offset, base64Length);

        // If not valid
        if (result === 0) return false;

        // Return valid
        return true;
    }
}
