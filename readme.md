# wat-base64
Encode and decode Base64 data using WebAssembly WAT. Includes code in JavaScript for web browser and NodeJS.

## Usage

This is an example of how to using the `base64-web.js` JavaScript class to encode an array of bytes into a base64 encoded string, and to then decode back again.

```javascript
import Base64Web from "./base64-web.js";

// Create base64 web object
const base64 = new Base64Web();

// Load the instance
await base64.load();

// Create array of data
let arrayBuffer = new Uint8Array(3);
arrayBuffer[0] = 0xB2;
arrayBuffer[1] = 0x37;
arrayBuffer[2] = 0xA5;

// Encode into a base64 string
let encoded = base64.encode(arrayBuffer);
console.log(encoded); // Output: yeTp

// Decode it back into an array
let decoded = base64.decode(encoded);
console.log(decoded); // Output: [0xB2, 0x37, 0xA5]
```

## Base64 Information

Each 3x bytes of data are encoded into 4x base64 characters. The table below shows the 3x bytes from right to left. The 3x bytes are seen as one long 24bit number. This is then split into 4x 6bit values. Each 6bit value number is converted into an ASCII character (see table below).

```
[0xB2, 0x37, 0xA5] => 'yeTp'

HEX:|      0xA5     |      0x37     |      0xB2     |
BIN:|1 0 1 0 0 1 0 1|0 0 1 1 0 1 1 1|1 0 1 1 0 0 1 0|
   :|1 0 1 0 0 1|0 1 0 0 1 1|0 1 1 1 1 0|1 1 0 0 1 0|
   :|   0x29    |    0x13   |    0x1E   |    0x32   |
B64:|    p      |     T     |     e     |     y     |
```

Each 6bit value has a range of values from `0` to `64`. Each value is converted into a character, ranging from `A` to `Z`, `a` to `z`, `0` to `9`, `+` and `/`. It also includes the special character `=` for padding. The table below shown the full list of 6bit value to base64 character.

|Bin|B64|ASCII| |Bin|B64|ASCII| |Bin|B64|ASCII| |Bin|B64|ASCII|
|---|:---:|:---:|---|---|:---:|:---:|---|---|:---:|:---:|---|---|:---:|:---:|
|000000|`A`|0x41| |010000|`Q`|0x51| |100000|`g`|0x67| |110000|`w`|0x77|
|000001|`B`|0x42| |010001|`R`|0x52| |100001|`h`|0x68| |110001|`x`|0x78|
|000010|`C`|0x43| |010010|`S`|0x53| |100010|`i`|0x69| |110010|`y`|0x79|
|000011|`D`|0x44| |010011|`T`|0x54| |100011|`j`|0x6A| |110011|`z`|0x7A|
|000100|`E`|0x45| |010100|`U`|0x55| |100100|`k`|0x6B| |110100|`0`|0x30|
|000101|`F`|0x46| |010101|`V`|0x56| |100101|`l`|0x6C| |110101|`1`|0x31|
|000110|`G`|0x47| |010110|`W`|0x57| |100110|`m`|0x6D| |110110|`2`|0x32|
|000111|`H`|0x48| |010111|`Z`|0x58| |100111|`n`|0x6E| |110111|`3`|0x33|
|001000|`I`|0x49| |011000|`Y`|0x59| |101000|`o`|0x6F| |111000|`4`|0x34|
|001001|`J`|0x4A| |011001|`Z`|0x5A| |101001|`p`|0x70| |111001|`5`|0x35|
|001010|`K`|0x4B| |011010|`a`|0x61| |101010|`q`|0x71| |111010|`6`|0x36|
|001011|`L`|0x4C| |011011|`b`|0x62| |101011|`r`|0x72| |111011|`7`|0x37|
|001100|`M`|0x4D| |011100|`c`|0x63| |101100|`s`|0x73| |111100|`8`|0x38|
|001101|`N`|0x4E| |011101|`d`|0x64| |101101|`t`|0x74| |111101|`9`|0x39|
|001110|`O`|0x4F| |011110|`e`|0x65| |101110|`u`|0x75| |111110|`+`|0x2B|
|001111|`P`|0x50| |011111|`f`|0x66| |101111|`v`|0x76| |111111|`/`|0x2F|

The ending base64 string of characters will always be a multiple of 4 characters long. However the array being encoded does not always fit perfectly. Therefore we need to include padded.

There will either be no padding needed, 1 padding character, or 2 padding characters. Below is an example of what this looks like.

```
2 remaining bytes

[0xB2, 0x37] => 'yeD='

HEX:|               |      0x37     |      0xB2     |
BIN:|               |0 0 1 1 0 1 1 1|1 0 1 1 0 0 1 0|
   :|           |0 0 0 0 1 1|0 1 1 1 1 0|1 1 0 0 1 0|
   :|           |    0x03   |    0x1E   |    0x32   |
B64:|    =      |     D     |     e     |     y     |

1 remaining byte

[0xB2] => 'yC=='

HEX:|               |               |      0xB2     |
BIN:|               |               |1 0 1 1 0 0 1 0|
   :|           |           |0 0 0 0 1 0|1 1 0 0 1 0|
   :|           |           |    0x02   |    0x32   |
B64:|    =      |     =     |     C     |     y     |
```

## Test Data

Encode testing. This array will create a base64 string that contains all the possible characters.

```
000011 000010 000001 000000 (00) = 00001100 00100000 01000000 = 0x0C 0x20 0x40
000111 000110 000101 000100 (04) = 00011100 01100001 01000100 = 0x1C 0x61 0x44
001011 001010 001001 001000 (08) = 00101100 10100010 01001000 = 0x2C 0xA2 0x48
001111 001110 001101 001100 (12) = 00111100 11100011 01001100 = 0x3C 0xE3 0x4C
010011 010010 010001 010000 (16) = 01001101 00100100 01010000 = 0x4D 0x24 0x50
010111 010110 010101 010100 (20) = 01011101 01100101 01010100 = 0x5D 0x65 0x54
011011 011010 011001 011000 (24) = 01101101 10100110 01011000 = 0x6D 0xA6 0x58
011111 011110 011101 011100 (28) = 01111101 11100111 01011100 = 0x7D 0xE7 0x5C
100011 100010 100001 100000 (32) = 10001110 00101000 01100000 = 0x8E 0x28 0x60
100111 100110 100101 100100 (36) = 10011110 01101001 01100100 = 0x9E 0x69 0x64
101011 101010 101001 101000 (40) = 10101110 10101010 01101000 = 0xAE 0xAA 0x68
101111 101110 101101 101100 (44) = 10111110 11101011 01101100 = 0xBE 0xEB 0x6C
110011 110010 110001 110000 (48) = 11001111 00101100 01110000 = 0xCF 0x2C 0x70
110111 110110 110101 110100 (52) = 11011111 01101101 01110100 = 0xDF 0x6D 0x74
111011 111010 111001 111000 (56) = 11101111 10101110 01111000 = 0xEF 0xAE 0x78
111111 111110 111101 111100 (60) = 11111111 11101111 01111100 = 0xFF 0xEF 0x7C

[
   0x40, 0x20, 0x0C,
   0x44, 0x61, 0x1C,
   0x48, 0xA2, 0x2C,
   0x4C, 0xE3, 0x3C,
   0x50, 0x24, 0x4D,
   0x54, 0x65, 0x5D,
   0x58, 0xA6, 0x6D,
   0x5C, 0xE7, 0x7D,
   0x60, 0x28, 0x8E,
   0x64, 0x69, 0x9E,
   0x68, 0xAA, 0xAE,
   0x6C, 0xEB, 0xBE,
   0x70, 0x2C, 0xCF,
   0x74, 0x6D, 0xDF,
   0x78, 0xAE, 0xEF,
   0x7C, 0xEF, 0xFF
] 
=> 
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

```
