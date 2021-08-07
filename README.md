# Metaball

Draws several circles to canvas that can be moved by mouse. Determines the clustering of the circles (groups of circles that intersect/touch). Draws a continuous circumferential perimeter around the circles of a cluster. Perimeter is a sequential array of clockwise arcs from point to point.

**Status**: Working

### Issues

1. An edge-case exists whereby the starting point for the array of arcs is contained inside a negative space formed by the circles. Instead of drawing the outer perimeter, it draws the interior "donut hole".
1. Could use some clean-up, specifically regarding the arc scanner.

### Steps

1. Run `npm start`
1. Click and drag circles to change clustering
1. Release mouse to draw perimeters