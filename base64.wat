(;
    Base64 encoding and decoding.
;)
(module
    ;; Import memory for string data and quick lookups
    (import "import" "memory" (memory 1))

    
    (data (i32.const 0) 
        ;; The first 64 bytes are for encoding
        "\41\42\43\44\45\46\47\48\49\4A\4B\4C\4D\4E\4F\50"
        "\51\52\53\54\55\56\57\58\59\5A\61\62\63\64\65\66"
        "\67\68\69\6A\6B\6C\6D\6E\6F\70\71\72\73\74\75\76"
        "\77\78\79\7A\30\31\32\33\34\35\36\37\38\39\2B\2F"

        ;; The next 256 bytes are for decoding
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

        ;; The array memory limit (to the last 3 byte block)
        (local $lastArrayMemory i32)

        ;; The current base memory offset
        (local $baseMemory i32)

        ;; The array data memory value
        (local $arrayData i32)

        ;; Padding count
        (local $paddingCount i32)


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
            local.get $arrayOffset
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
    (;
        ;; Parameters
        (param $base64Offset i32)
        (param $base64Length i32)
        (param $arrayOffset i32)
        (param $arrayLength i32)
        ;; Locals
        (local $base64 i32)
        (local $array i32)

;)



    )

)
