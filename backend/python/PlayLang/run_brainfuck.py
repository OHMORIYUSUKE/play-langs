import sys
# '>'   increment the pointer.
# '<'   decrement the pointer.
# '+'   increment the value at the pointer.
# '-'   decrement the value at the pointer.
# '.'   output the value at the  pointer as utf-8 character.
# ','   accept one byte of input, storing its value in the mem at the  pointer.
# '['   if the byte at the pointer is zero, then jump it to the matching ']'
# ']'   if the byte at the pointer is nonzero, then jump it buck to the matching '['
mem_size = 30000
mem = [0 for i in range(mem_size)]
ptr = 0

if __name__ == "__main__":
    args = sys.argv
    path = args[1]
    with open(path) as f:
        code = f.read()
    code_list = list(code)

    head = 0 #(tape reading) head
    while head < len(code_list):
        if code_list[head] == '+':
            mem[ptr] += 1

        elif code_list[head] == '-':
            mem[ptr] -= 1

        elif code_list[head] == '[':
            if mem[ptr] == 0:
                count = 1
                while count != 0:
                    head += 1
                    if head == len(code_list):
                        print("']' is missing")
                        sys.exit(1)
                    if code_list[head] == '[':
                        count += 1
                    elif code_list[head] == ']':
                        count -= 1
        elif code_list[head] == ']':
            if mem[ptr] != 0:
                count = 1
                while count != 0:
                    head -= 1
                    if head < 0:
                        print("'[' is missing")  
                    if code_list[head] == ']':
                        count += 1
                    elif code_list[head] == '[':
                        count -= 1
        elif code_list[head] == '.':
            #chr: char -> code point
            print(chr(mem[ptr]),end = "") #no line break
        elif code_list[head] == ',':
            #ord: code point -> char
            mem[ptr] = ord(sys.stdin.buffer.read(1))
        elif code_list[head] == '>':
            ptr += 1       
            if ptr > mem_size:
                print("overflow!")
                sys.exit(1)
        elif code_list[head] == "<":
            if ptr == 0:
                print("Can't decrement anymore")
            ptr -= 1
        else:
            pass #ignore other symbol

        head += 1   