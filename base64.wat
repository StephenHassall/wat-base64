(;
    Base64 encoding and decoding.
;)
(module
    ;; Import memory for string data and quick lookups
    (import "import" "memory" (memory 1))


    ;; Encode lookup array
    (data $encodeLookupArray
        "\41\42\43\44\45\46\47\48\49\4A\4B\4C\4D\4E\4F\50"
        "\51\52\53\54\55\56\57\58\59\5A\61\62\63\64\65\66"
        "\67\68\69\6A\6B\6C\6D\6E\6F\70\71\72\73\74\75\76"
        "\77\78\79\7A\30\31\32\33\34\35\36\37\38\39\2B\2F"
    )

    ;; Decode lookup array
    (data $decodeLookupArray
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00" ;; 00 - 0F
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00" ;; 10 - 1F
        "\00\00\00\00\00\00\00\00\00\00\00\3E\00\00\00\3F" ;; 20 - 2F
        "\34\35\36\37\38\39\3A\3B\3C\3D\00\00\00\00\00\00" ;; 30 - 3F

        "\00\00\01\02\03\04\05\06\07\08\09\0A\0B\0C\0D\0E" ;; 40 - 4F
        "\0F\10\11\12\13\14\15\16\17\18\19\00\00\00\00\00" ;; 50 - 5F
        "\00\1A\1B\1C\1D\1E\1F\20\21\22\23\24\25\26\27\28" ;; 60 - 6F
        "\29\2A\2B\2C\2D\2E\2F\30\31\32\33\00\00\00\00\00" ;; 70 - 7F

        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00" ;; 80 - FF
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
        "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
    )

    ;; validate lookup array
    (data $validateLookupArray
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01" ;; 00 - 0F
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01" ;; 10 - 1F
        "\01\01\01\01\01\01\01\01\01\01\01\00\01\01\01\00" ;; 20 - 2F
        "\00\00\00\00\00\00\00\00\00\00\01\01\01\01\01\01" ;; 30 - 3F

        "\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00" ;; 40 - 4F
        "\00\00\00\00\00\00\00\00\00\00\00\01\01\01\01\01" ;; 50 - 5F
        "\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00" ;; 60 - 6F
        "\00\00\00\00\00\00\00\00\00\00\00\01\01\01\01\01" ;; 70 - 7F

        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01" ;; 80 - FF
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01"
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01"
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01"
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01"
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01"
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01"
        "\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01"
    )

    (;

    ;)
    (func (export "encode")
        ;; Parameters
        (param $arrayOffset i32)
        (param $arrayLength i32)
        (param $baseOffset i32)
        (param $baseLength i32)

        ;; The current array memory offset
        (local $arrayMemory i32)

        ;; The last array memory offset (to the last 3 byte block)
        (local $lastArrayMemory i32)

        ;; The current base memory offset
        (local $baseMemory i32)

        ;; The array data memory value
        (local $arrayData i32)

        ;; Padding count
        (local $paddingCount i32)

        ;; Put the decode lookup table array into memory (at zero offset)
        i32.const 0
        i32.const 0
        i32.const 64
        memory.init $encodeLookupArray

        ;; Workout the last memory offset to the last 3 byte block
        local.get $arrayLength
        i32.const 3
        i32.div_u
        i32.const 3
        i32.mul
        local.get $arrayOffset
        i32.add
        local.set $lastArrayMemory

        ;; Set array memory location
        local.get $arrayOffset
        local.set $arrayMemory

        ;; Set base memory location
        local.get $baseOffset
        local.set $baseMemory

        ;; Loop for every 3 bytes
        loop $encode_loop
        block $encode_block
            ;; Check last block limit
            local.get $arrayMemory
            local.get $lastArrayMemory
            i32.ge_u
            br_if $encode_block

            ;; Get get 4 bytes
            local.get $arrayMemory
            i32.load
            local.set $arrayData

            ;; We are only looking at the first 3 bytes of the 32 bit integer

            ;; Push the base memory offset onto the stack (it will be used later)
            local.get $baseMemory

            ;; Get first 6 bits
            local.get $arrayData
            i32.const 0x0000003F
            i32.and

            ;; Use this 6 bit value as the index to the encode table in memory
            i32.load8_u

            ;; Keep this first character (1) on the stack

            ;; Get second 6 bits
            local.get $arrayData
            i32.const 0x00000FC0
            i32.and
            i32.const 6
            i32.shr_u

            ;; Use this 6 bit value as the index to the encode table in memory
            i32.load8_u

            ;; Set second base 64 character to byte 32
            i32.const 8
            i32.shl

            ;; Keep this character (2) on the stack

            ;; Get third 6 bits
            local.get $arrayData
            i32.const 0x0003F000
            i32.and
            i32.const 12
            i32.shr_u

            ;; Use this 6 bit value as the index to the encode table in memory
            i32.load8_u

            ;; Set third base 64 character to byte 32
            i32.const 16
            i32.shl

            ;; Keep this character (3) on the stack

            ;; Get forth 6 bits
            local.get $arrayData
            i32.const 0x00FC0000
            i32.and
            i32.const 18
            i32.shr_u

            ;; Use this 6 bit value as the index to the encode table in memory
            i32.load8_u

            ;; Set forth base 64 character to byte 32
            i32.const 24
            i32.shl

            ;; We now have the 4 base64 characters on the stack. Put them together
            ;; into the into a single 32 bit integer
            i32.or
            i32.or
            i32.or

            ;; Store the 4 characters onto the base memory (in $baseMemory)
            i32.store

            ;; Increase the base memory offset by 4 bytes
            local.get $baseMemory
            i32.const 4
            i32.add
            local.set $baseMemory

            ;; Increase the array memory by 3 bytes
            local.get $arrayMemory
            i32.const 3
            i32.add
            local.set $arrayMemory

            ;; Loop again
            br $encode_loop
        end
        end

        ;; Workout the how many padding bytes are needed, padding count = 3 - (arrayLength % 3)
        i32.const 3
        local.get $arrayLength
        i32.const 3
        i32.rem_u
        i32.sub
        local.set $paddingCount

        ;; If no padding required
        local.get $paddingCount
        i32.eqz
        if
            ;; All done therefore we can stop here
            return
        end

        ;; Get get 4 bytes
        local.get $arrayOffset
        i32.load
        local.set $arrayData

        ;; Push the base memory offset onto the stack (it will be used later)
        local.get $baseMemory

        ;; Get first 6 bits
        local.get $arrayData
        i32.const 0x0000003F
        i32.and

        ;; Use this 6 bit value as the index to the encode table in memory
        i32.load8_u

        ;; Keep this first character (1) on the stack

        ;; If one padding byte needed
        local.get $paddingCount
        i32.const 1
        i32.eq
        if (result i32 i32 i32)
            ;; Get second 6 bits
            local.get $arrayData
            i32.const 0x00000FC0
            i32.and
            i32.const 6
            i32.shr_u

            ;; Use this 6 bit value as the index to the encode table in memory
            i32.load8_u

            ;; Set second base 64 character to byte 32
            i32.const 8
            i32.shl

            ;; Keep this character (2) on the stack

            ;; Get third 4 bits
            local.get $arrayData
            i32.const 0x0000F000
            i32.and
            i32.const 12
            i32.shr_u

            ;; Use this 6 bit value as the index to the encode table in memory
            i32.load8_u

            ;; Set third base 64 character to byte 32
            i32.const 16
            i32.shl

            ;; Keep this character (3) on the stack

            ;; Add one padding characters to the stack
            i32.const 0x3D000000
        else
            ;; Must require two paddding bytes

            ;; Get second 2 bits
            local.get $arrayData
            i32.const 0x000000C0
            i32.and
            i32.const 6
            i32.shr_u

            ;; Use this 6 bit value as the index to the encode table in memory
            i32.load8_u

            ;; Set second base 64 character to byte 32
            i32.const 8
            i32.shl

            ;; Keep this character (2) on the stack

            ;; Add two padding characters to the stack
            i32.const 0x003D0000
            i32.const 0x3D000000
        end
        
        ;; We now have the 4 base64 characters on the stack. Put them together
        ;; into the into a single 32 bit integer
        i32.or
        i32.or
        i32.or

        ;; Store the 4 characters onto the base memory (in $baseMemory)
        i32.store
    )

    (;

    ;)
    (func (export "decode")
        ;; Parameters
        (param $baseOffset i32)
        (param $baseLength i32)
        (param $arrayOffset i32)
        (param $arrayLength i32)

        ;; The current base memory offset
        (local $baseMemory i32)

        ;; The last base memory offset (to the last 4 byte block)
        (local $lastBaseMemory i32)

        ;; The current array memory offset
        (local $arrayMemory i32)

        ;; The base data memory value
        (local $baseData i32)

        ;; Put the decode lookup table array into memory (at zero offset)
        i32.const 0
        i32.const 0
        i32.const 256
        memory.init $decodeLookupArray

        ;; Workout the last memory offset to the last 4 byte block
        local.get $baseLength
        i32.const 4
        i32.div_u
        i32.const 4
        i32.mul
        local.get $baseOffset
        i32.add
        local.set $lastBaseMemory

        ;; Set base memory location
        local.get $baseOffset
        local.set $baseMemory

        ;; Set array memory location
        local.get $arrayOffset
        local.set $arrayMemory

        ;; Loop for every 4 bytes
        loop $encode_loop
        block $encode_block
            ;; Check last block limit
            local.get $baseMemory
            local.get $lastBaseMemory
            i32.ge_u
            br_if $encode_block

            ;; Get get 4 bytes
            local.get $baseMemory
            i32.load
            local.set $baseData

            ;; Push the array memory offset onto the stack (it will be used later)
            local.get $arrayMemory

            ;; Get first 8 bits
            local.get $baseData
            i32.const 0x000000FF
            i32.and

            ;; Use this 8 bit value as the index to the decode table in memory
            i32.load8_u

            ;; Keep this first 6 bits (1) on the stack

            ;; Get second 8 bits
            local.get $baseData
            i32.const 0x0000FF00
            i32.and
            i32.const 8
            i32.shr_u

            ;; Use this 8 bit value as the index to the decode table in memory
            i32.load8_u

            ;; Set second 6 bits of the 3 bytes
            i32.const 6
            i32.shl

            ;; Keep this 6 bits (2) on the stack

            ;; Get third 8 bits
            local.get $baseData
            i32.const 0x00FF0000
            i32.and
            i32.const 16
            i32.shr_u

            ;; Use this 8 bit value as the index to the decode table in memory
            i32.load8_u

            ;; Set third 6 bits of the 3 bytes
            i32.const 12
            i32.shl

            ;; Keep this 6 bits (3) on the stack

            ;; Get forth 8 bits
            local.get $baseData
            i32.const 0xFF000000
            i32.and
            i32.const 24
            i32.shr_u

            ;; Use this 8 bit value as the index to the decode table in memory
            i32.load8_u

            ;; Set third 6 bits of the 3 bytes
            i32.const 18
            i32.shl

            ;; Keep this 6 bits (4) on the stack

            ;; We now have the 4 6 bit parts on the stack. Put them together
            ;; into the into a single 32 bit integer (only the first 24 bits)
            i32.or
            i32.or
            i32.or

            ;; Store the 4 characters onto the base memory (in $arrayMemory)
            i32.store

            ;; Increase the array memory by 3 bytes
            local.get $arrayMemory
            i32.const 3
            i32.add
            local.set $arrayMemory

            ;; Increase the base memory offset by 4 bytes
            local.get $baseMemory
            i32.const 4
            i32.add
            local.set $baseMemory

            ;; Loop again
            br $encode_loop
        end
        end



    )

    (;

    ;)
    (func (export "validate")
        ;; Parameters
        (param $baseOffset i32)
        (param $baseLength i32)

        ;; Result
        (result i32)

        ;; The current base memory offset
        (local $baseMemory i32)

        ;; The last base memory offset (to the last 4 byte block)
        (local $lastBaseMemory i32)

        ;; The base data memory value
        (local $baseData i32)

        ;; The character value
        (local $character i32)

        ;; Put the validate lookup table array into memory (at zero offset)
        i32.const 0
        i32.const 0
        i32.const 256
        memory.init $validateLookupArray

        ;; Check length is not zero
        local.get $baseLength
        i32.eqz
        if
            ;; Return not valid
            i32.const 0
            return
        end

        ;; Check length is divisible by 4
        local.get $baseLength
        i32.const 4
        i32.rem_u
        if
            ;; Return not valid
            i32.const 0
            return
        end

        ;; Workout the last memory offset to the last (but one) 4 byte block
        local.get $baseLength
        i32.const 4
        i32.div_u
        i32.const 1
        i32.sub
        i32.const 4
        i32.mul
        local.get $baseOffset
        i32.add
        local.set $lastBaseMemory

        ;; Set base memory location
        local.get $baseOffset
        local.set $baseMemory

        ;; Loop for every 4 bytes
        loop $encode_loop
        block $encode_block
            ;; Check last block limit
            local.get $baseMemory
            local.get $lastBaseMemory
            i32.ge_u
            br_if $encode_block

            ;; Get get 4 bytes
            local.get $baseMemory
            i32.load
            local.set $baseData

            ;; Get first 8 bits
            local.get $baseData
            i32.const 0x000000FF
            i32.and

            ;; Use this 8 bit value as the index to the validate lookup table in memory
            i32.load8_u

            ;; If invalid then return not valid
            if
                i32.const 0
                return
            end

            ;; Get second 8 bits
            local.get $baseData
            i32.const 0x0000FF00
            i32.and
            i32.const 8
            i32.shr_u

            ;; Use this 8 bit value as the index to the validate lookup table in memory
            i32.load8_u

            ;; If invalid then return not valid
            if
                i32.const 0
                return
            end

            ;; Get third 8 bits
            local.get $baseData
            i32.const 0x00FF0000
            i32.and
            i32.const 16
            i32.shr_u

            ;; Use this 8 bit value as the index to the validate lookup table in memory
            i32.load8_u

            ;; If invalid then return not valid
            if
                i32.const 0
                return
            end

            ;; Get forth 8 bits
            local.get $baseData
            i32.const 0xFF000000
            i32.and
            i32.const 24
            i32.shr_u

            ;; Use this 8 bit value as the index to the validate lookup table in memory
            i32.load8_u

            ;; If invalid then return not valid
            if
                i32.const 0
                return
            end

            ;; Increase the base memory offset by 4 bytes
            local.get $baseMemory
            i32.const 4
            i32.add
            local.set $baseMemory

            ;; Loop again
            br $encode_loop
        end
        end

        ;; Get the last 4 byte block
        local.get $baseMemory
        i32.load
        local.set $baseData

        ;; Get first 8 bits
        local.get $baseData
        i32.const 0x000000FF
        i32.and

        ;; Use this 8 bit value as the index to the validate lookup table in memory
        i32.load8_u

        ;; If invalid then return not valid
        if
            i32.const 0
            return
        end

        ;; Get second 8 bits
        local.get $baseData
        i32.const 0x0000FF00
        i32.and
        i32.const 8
        i32.shr_u

        ;; Use this 8 bit value as the index to the validate lookup table in memory
        i32.load8_u

        ;; If invalid then return not valid
        if
            i32.const 0
            return
        end

        ;; Get third 8 bits
        local.get $baseData
        i32.const 0x00FF0000
        i32.and
        i32.const 16
        i32.shr_u

        ;; Set character
        local.set $character

        ;; If = character
        local.get $character
        i32.const 0x3D
        i32.eq
        if
            ;; Get forth 8 bits
            local.get $baseData
            i32.const 0xFF000000
            i32.and
            i32.const 24
            i32.shr_u

            ;; If not = character
            i32.const 0x3D
            i32.ne
            if
                ;; We have a = followed by something other than a = therefore this is not valid
                i32.const 0
                return
            end

            ;; This is a = followed by another = character and therefore valid
            i32.const 1
            return
        end

        ;; Use this character value as the index to the validate lookup table in memory
        local.get $character
        i32.load8_u

        ;; If invalid then return not valid
        if
            i32.const 0
            return
        end

        ;; Get forth 8 bits
        local.get $baseData
        i32.const 0xFF000000
        i32.and
        i32.const 24
        i32.shr_u

        ;; Set character
        local.set $character

        ;; If = character
        local.get $character
        i32.const 0x3D
        i32.ne
        if
            ;; Use this character value as the index to the validate lookup table in memory
            local.get $character
            i32.load8_u

            ;; If invalid then return not valid
            if
                i32.const 0
                return
            end
        end

        ;; Must be valid so set result
        i32.const 1
    )
)
