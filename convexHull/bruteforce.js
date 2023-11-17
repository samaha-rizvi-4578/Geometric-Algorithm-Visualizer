var width = 600; // Define the width of the SVG visualization
var height = 400; // Define the height of the SVG visualization
var points = []; // Array to store the generated points
var hull = []; // Array to store the convex hull points

// Set the speed variable based on the initial value of the speed input
var speed = parseInt(document.getElementById("speed").value) || 3;

// Function to generate points
function generatePoints() {
    var numPoints = parseInt(document.getElementById("numPoints").value) || 100;

    points = [];
    for (let i = 0; i < numPoints; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        points.push({ x: x, y: y });
    }
    visualizePoints(); // Call a function to visualize the generated points
}

// Function to visualize points
function visualizePoints() {
    // Visualize the points
    var colorPoints = d3.select("#colorPoints").node().value;

    // Create an SVG and draw the points
    var svg = d3.select("#visualization")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("fill", colorPoints);
}

// Function to visualize the convex hull
function visualizeConvexHull() {
    // Clear previous visualization
    d3.select("#visualization").selectAll("*").remove();

    hull = bruteForceConvexHull(points);

    // Visualize the convex hull
    visualizeHull();
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
                    if (!checkSameSide(x1, y1, x2, y2, x, y)) {
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

// Function to check if points are on the same side
function checkSameSide(x1, y1, x2, y2, x, y) {
    let a = -(y2 - y1);
    let b = x2 - x1;
    let c = -(a * x1 + b * y1);
    let d = a * x + b * y + c;

    return d > 0;
}

// Function to visualize the hull
function visualizeHull() {
    var colorHull = d3.select("#colorHull").node().value;
    var colorPoints = d3.select("#colorPoints").node().value;

    // Create an SVG and draw the points
    var svg = d3.select("#visualization")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("fill", colorPoints);

    // Draw the edges of the convex hull
    svg.selectAll("line")
        .data(hull)
        .enter().append("line")
        .attr("x1", function(d) { return d[0].x; })
        .attr("y1", function(d) { return d[0].y; })
        .attr("x2", function(d) { return d[1].x; })
        .attr("y2", function(d) { return d[1].y; })
        .style("stroke", colorHull);
}

// Update the speed variable when the speed input changes
document.getElementById("speed").addEventListener("input", function () {
    speed = parseInt(this.value) || 3;
});

// Function to display points within the convex hull
function displayPointsInHull() {
    console.log("Points within the convex hull: ", hull);
}

// ... (rest of the existing code)
