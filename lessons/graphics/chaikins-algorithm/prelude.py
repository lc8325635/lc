def _path(*pts):
    return [ Pt.of(x * 10 - 50, y * 10 - 50) for (x, y) in pts ]

square = _path( (10, 10), (10, -10), (-10, -10), (-10, 10) )
letter = {
    "a" : _path( (2, 5), (2, 6), (9, 6), (9, 0), (2, 0), (2, 4), (9, 4) ),
    "b" : _path( (2, 10), (2, 0), (9, 0), (9, 5), (2, 5) ),
    "c" : _path( (9, 6), (2, 6), (2, 0), (9, 0) ),
    "d" : _path( (9, 10), (9, 0), (2, 0), (2, 5), (9, 5) ),
    "e" : _path( (2, 4), (9, 4), (9, 6), (2, 6), (2, 0), (9, 0), (9, 1) ),
    "f" : _path( (9, 10), (5, 10), (5, 0), (2, 0), (2, 5), (7, 5) ),
    "g" : _path( (9, 3), (2, 3), (2, 6), (9, 6), (9, 0), (2, 0), (2, 1) ),
}

def chaikin(path, closed = False):
    if len(path) <= 2: return path

    if closed:
        path = path[:]
        path.append(path[0])

    new_path = []
    num_points = len(path)
    if not closed: new_path.append(path[0])
    
    for i in range(1, num_points):
        pt1 = path[i - 1]
        pt2 = path[i]
        new_path.append(pt1 * 0.75 + pt2 * 0.25)
        new_path.append(pt1 * 0.25 + pt2 * 0.75)

    if not closed: new_path.append(path[-1])
    return new_path
