const line1 = generateRandomLinePoints();
const line2 = generateRandomLinePoints();
visualizeLines(line1, line2);


const result = doLinesIntersect(line1, line2);
console.log("Do the lines intersect?", result);

// Function to calculate the determinant of a 2x2 matrix
function determinant(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
}

// Function to check if two line segments intersect
function doLinesIntersect(line1, line2) {
    const [x1, y1] = line1[0];
    const [x2, y2] = line1[1];
    const [x3, y3] = line2[0];
    const [x4, y4] = line2[1];

    const det1 = determinant(x1 - x3, y1 - y3, x4 - x3, y4 - y3);
    const det2 = determinant(x2 - x3, y2 - y3, x4 - x3, y4 - y3);
    const det3 = determinant(x3 - x1, y3 - y1, x2 - x1, y2 - y1);
    const det4 = determinant(x4 - x1, y4 - y1, x2 - x1, y2 - y1);

    return (det1 * det2 < 0) && (det3 * det4 < 0);
}
// Function to generate random points for a line
function generateRandomLinePoints() {
    const x1 = Math.random() * 10;
    const y1 = Math.random() * 10;
    const x2 = Math.random() * 10;
    const y2 = Math.random() * 10;
    return [[x1, y1], [x2, y2]];
}

// Function to visualize the lines using D3.js
function visualizeLines(lines) {
    const svg = d3.select("#visualization");

    // Clear existing lines
    svg.selectAll("line").remove();

    // Visualize each line in the array
    lines.forEach((line, index) => {
        svg.append("line")
            .attr("x1", line[0][0] * 50)
            .attr("y1", line[0][1] * 50)
            .attr("x2", line[1][0] * 50)
            .attr("y2", line[1][1] * 50)
            .attr("stroke", `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`);
    });
    const result = checkIntersections(lines);
    document.getElementById("result").innerText = "Do the lines intersect? " + result;

}
function clearVisualization() {
    const svg = d3.select("#visualization");
    svg.selectAll("line").remove();
}

//for displaying message about interaction
function checkIntersections(lines) {
    const numLines = lines.length;

    // Check for intersections among all pairs of lines
    for (let i = 0; i < numLines - 1; i++) {
        for (let j = i + 1; j < numLines; j++) {
            if (doLinesIntersect(lines[i], lines[j])) {
                return true; // Intersection found
            }
        }
    }

    return false; // No intersections found
}

function generateLines() {
    const numLines = parseInt(document.getElementById("numLines").value, 10);
    const lines = [];

    for (let i = 0; i < numLines; i++) {
        const line = generateRandomLinePoints();
        lines.push(line);
    }

    visualizeLines(lines);
}


