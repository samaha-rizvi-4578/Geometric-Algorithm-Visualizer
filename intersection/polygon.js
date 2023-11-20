let points = [];
let polygon = [];
let svg;

function generatePoints() {
    const numPoints = document.getElementById("numPoints").value;
    points = [];

    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 1000;
        const y = Math.random() * 400;
        points.push([x, y]);
    }

    visualizePoints();
}

function visualizePoints() {
    svg.selectAll(".point").remove();

    svg.selectAll(".point")
        .data(points)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 3)
        .style("fill", "blue");
}

function visualizePolygon() {
    const numVertices = points.length;
    if (numVertices < 3) {
        alert("A polygon must have at least 3 vertices.");
        return;
    }

    polygon = convexHull(points);
    visualizePoints();
    visualizeConvexHull();

    const pointsInsidePolygon = points.filter(point => isInsidePolygon(point, polygon));
    document.getElementById("pointsInsidePolygon").textContent = " Points Inside Polygon: " + pointsInsidePolygon.length;
}

function visualizeConvexHull() {
    svg.selectAll(".polygon-line").remove();

    const lineFunction = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveLinearClosed);

    svg.append("path")
        .attr("d", lineFunction(polygon))
        .attr("class", "polygon-line")
        .style("stroke", "green")
        .style("stroke-width", 2)
        .style("fill", "none");
}

function convexHull(points) {
    // Implementation of the Gift Wrapping Algorithm
    const n = points.length;

    if (n < 3) {
        return [];
    }

    // Find the point with the lowest y-coordinate
    let pivot = 0;
    for (let i = 1; i < n; i++) {
        if (points[i][1] < points[pivot][1]) {
            pivot = i;
        }
    }

    const hull = [];
    let endpoint;

    do {
        hull.push(points[pivot]);
        endpoint = (pivot + 1) % n;

        for (let i = 0; i < n; i++) {
            if (orientation(points[pivot], points[i], points[endpoint]) === 2) {
                endpoint = i;
            }
        }

        pivot = endpoint;
    } while (pivot !== 0);

    return hull;
}

function orientation(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) {
        return 0;  // colinear
    }
    return val > 0 ? 1 : 2;  // clock or counterclockwise
}

function clearVisualization(){
    svg.selectAll(".point").remove();
    svg.selectAll(".polygon-line").remove();
    document.getElementById("pointsInsidePolygon").textContent = " Points Inside Polygon: 0";
}

// Initialize the SVG
document.addEventListener("DOMContentLoaded", function() {
    svg = d3.select("#visualization");
});
