def rasterise(radius):
    count = 0
    for y in range(minY, maxY):
        for x in range(minX, maxX):
            w = sqrt(x ** 2 + y ** 2)
            if w < radius:
                count += 1
    return count
        
for diameter in range(4, 20):
    r = diameter / 2
    num_pixels = rasterise(r)
    ideal_area = pi * r ** 2
    err = num_pixels / ideal_area - 1
    print(f"{r}\t{ideal_area:.2f}\t{num_pixels}\t{err*100:.2f}")