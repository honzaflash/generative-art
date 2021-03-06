from random import choice, random, randint

found = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26]

primes = [2, 3, 5, 7, 11, 13, 17, 19, 23]

try:
    while True:
        x = found[randint(0,15)]
        while random() < 0.7:
            p = choice(primes)
            if p * x > 180:
                break
            x *= p
        if x < 180 and x not in found:
            found.append(x)
            found.sort()
            print(x, end=", ")
            
except KeyboardInterrupt:
    print()
    print(found)


GATHERED_OUTPUTS = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57, 60, 63, 64, 65, 66, 68, 69, 70, 72, 75, 76, 77, 78, 80, 81, 84, 85, 88, 90, 91, 92, 95, 96, 98, 99, 100, 102, 104, 105, 108, 110, 112, 114, 115, 117, 119, 120, 121, 125, 126, 128, 130, 132, 133, 135, 136, 138, 140, 143, 144, 147, 150, 152, 153, 154, 156, 160, 161, 162, 165, 168, 169, 170, 171, 175, 176]
