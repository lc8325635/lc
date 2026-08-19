for x in range(256):
    colour = rgb(0, x, 0)
    Pen(colour).rectangle((x - 128, -100), (x - 127, 100))
