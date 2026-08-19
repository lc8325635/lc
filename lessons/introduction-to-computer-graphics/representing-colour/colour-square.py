for y in range(256):
    for x in range(256):
        colour = rgb(0, y, x)
        Pen(colour).plot(x - 128, y - 128)
