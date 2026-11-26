clear(10)
pens = {}

def plot(x, y, colour = "#fff"):
    pen = pens.get(colour)
    if pen is None:
        pen = Pen(colour)
        pens[colour] = pen
    pen.plot(x, y)
