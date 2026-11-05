clear(4) # The number in the brackets controls pixel size.

radius = 20
for y in range(graph.minY, graph.maxY):
    for x in range(graph.minX, graph.maxX):
        w = sqrt(x ** 2 + y ** 2)
        if w < radius:
            plot(x, y)

