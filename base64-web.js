/**
 * Base64 for use in a web browser.
 */
export default class Base64  {
    /**
     * Fetch and load the WASM file.
     * @return {Promise} A promise.
     */
    async load() {
        // Set memory page size (1 page = 64kb)
        this._memoryPageSize = 1;

        // Create memory to the starting page size
        this._memory = new WebAssembly.Memory({ initial: this._memoryPageSize });

        // Create Uint8Array of the memory buffer
        this._memoryUint8Array = new Uint8Array(this._memory.buffer);

        // Set options
        const options = {
            import: {
                memory: this._memory
            }
        }

        // Load in and create instance of base64.wasm file
        this._wasm = await WebAssembly.instantiateStreaming(fetch('base64.wasm'), options);
    }

    /**
     * Encode the given data into a base64 string.
     * @param {ArrayBuffer} arrayBuffer The data to encode.
     * @return {String} The base64 encoded string of the data given.
     */
    encode(arrayBuffer) {
        // Set array length (in bytes)
        const arrayLength = arrayBuffer.length;

        // Set base64 length (that will be created, in bytes)
        const base64Length = Math.ceil(arrayLength / 3) * 4;

        // Set total memory needed (include encode lookup array at the start)
        const totalMemorySize = 64 + arrayLength + base64Length;

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
        const base64Offset = 64 + arrayLength;
        
        // Copy the array buffer into the WASM memory
        this._memoryUint8Array.set(arrayBuffer, arrayOffset);

        // Encode the array into base64
        this._wasm.instance.exports.encode(arrayOffset, arrayLength, base64Offset, base64Length);

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
     * @param {Boolean} [trusted] Is the encoded data from a trusted source (quicker) or are extra checks required (slower).
     * @return {ArrayBuffer} The array of data that was encoded in the string.
     */
    decode(base64, trusted) {
        // Set the base length (in bytes)
        const base64Length = base64.length;

        // If not divisible by 4 (i.e. there are remainders)
        if (base64Length % 4) throw new Error('Base64 length must only be divisible by 4');

        // Set array length (that will be created, in bytes)
        const arrayLength = Math.ceil(base64Length / 4) * 3;

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
        
        // Copy the base64 text into the WASM memory
        this._memoryUint8Array.set(base64Memory, base64Offset);

        // Decode the base64 text into array
        this._wasm.instance.exports.decode(base64Offset, base64Length, arrayOffset, arrayLength);

        // Create Uint8Array from the WASM memory containing array buffer
        const arrayBuffer = new Uint8Array(this._memory.buffer, arrayOffset, arrayLength);

        // Return the array buffer result
        return arrayBuffer;
    }
}
