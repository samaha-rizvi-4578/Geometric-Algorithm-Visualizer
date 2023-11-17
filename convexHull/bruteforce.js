// Variables to store width, height, points, hull, and speed
var width = 1000;
var height = 400;
var points = [];
var hull = [];
var speed = parseInt(document.getElementById("speed").value) || 3;

// Function to generate random points
function generatePoints() {
    var numPoints = parseInt(document.getElementById("numPoints").value) || 10;

    points = [];
    for (let i = 0; i < numPoints; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        points.push({ x: x, y: y });
    }
    visualizePoints();
}

// Function to visualize points on the SVG
function visualizePoints() {
    var svg = d3.select("#visualization")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("circle").remove(); // Clear previous points

    svg.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("fill", "black"); // Fixed color to black
}

// Function to visualize the convex hull
function visualizeConvexHull() {
    d3.select("#visualization").selectAll("line").remove(); // Clear previous hull edges

    hull = bruteForceConvexHull(points);

    visualizeHull();
}

// Function to visualize the convex hull on the SVG
function visualizeHull() {
    var svg = d3.select("#visualization")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("circle").remove(); // Clear previous points

    // Draw points
    svg.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("fill", "black"); // Fixed color to black

    // Draw edges of the convex hull
    svg.selectAll("line")
        .data(hull)
        .enter().append("line")
        .attr("x1", function (d) { return d[0].x; })
        .attr("y1", function (d) { return d[0].y; })
        .attr("x2", function (d) { return d[1].x; })
        .attr("y2", function (d) { return d[1].y; })
        .style("stroke", "red"); // Fixed color to red

    // Update the points in hull field
    document.getElementById("pointsInHull").innerText = "Points in Hull: " + hull.length;
}

// Function for the brute-force convex hull
function bruteForceConvexHull(points) {
    var hull = [];

    // Iterate through all pairs of points
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            let x1 = points[i].x, y1 = points[i].y;
            let x2 = points[j].x, y2 = points[j].y;

            let isHullEdge = true;

            // Check all other points to see if they fall on the same side
            for (let k = 0; k < points.length; k++) {
                if (k != i && k != j) {
                    let x = points[k].x, y = points[k].y;
                    let orientation = ccw(x1, y1, x2, y2, x, y);

                    if (orientation === 0) {
                        // Points are collinear, choose the one farthest from the line
                        let dist1 = Math.hypot(x - x1, y - y1);
                        let dist2 = Math.hypot(x - x2, y - y2);

                        if (dist1 > dist2) {
                            isHullEdge = false;
                            break;
                        }
                    } else if (orientation < 0) {
                        // Points are not on the same side
                        isHullEdge = false;
                        break;
                    }
                }
            }

            // If all points are on the same side, this edge is part of the hull
            if (isHullEdge) {
                hull.push([points[i], points[j]]);
            }
        }
    }

    return hull;
}

// CCW (Counter-Clockwise) orientation test
function ccw(x1, y1, x2, y2, x, y) {
    return (((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1)));
}

// Update the speed variable when the speed input changes
document.getElementById("speed").addEventListener("input", function () {
    speed = parseInt(this.value) || 3;
});

// Add event listeners for the buttons
document.getElementById("generatePointsButton").addEventListener("click", generatePoints);
document.getElementById("visualizeConvexHullButton").addEventListener("click", visualizeConvexHull);

