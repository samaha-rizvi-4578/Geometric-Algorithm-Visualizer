
const line1 = generateRandomLinePoints();
const line2 = generateRandomLinePoints();
visualizeLines(line1, line2);



function generateLines() {
    const numLines = parseInt(document.getElementById("numLines").value, 10);
    const lines = [];

    for (let i = 0; i < numLines; i++) {
        const line = generateRandomLinePoints();
        lines.push(line);
    }

    visualizeLines(lines);
    const result = doLinesIntersectParametric(line1, line2);
document.getElementById("result").innerText = "Do the points intersect with the polygon? " + result;

}

function visualizeLines(lines) {
    const svg = d3.select("#visualization");
    
    // Clear previous lines
    svg.selectAll("*").remove();

    lines.forEach(line => {
        // Visualize line
        svg.append("line")
            .attr("x1", line[0][0])
            .attr("y1", line[0][1])
            .attr("x2", line[1][0])
            .attr("y2", line[1][1])
            .attr("stroke", getRandomColor());
    });
    const result = doLinesIntersectParametric(line1, line2);
document.getElementById("result").innerText = "Do the points intersect with the polygon? " + result;

}

function generateRandomLinePoints() {
    const x1 = Math.random() * 300;
    const y1 = Math.random() * 300;
    const x2 = Math.random() * 300;
    const y2 = Math.random() * 300;
    return [[x1, y1], [x2, y2]];
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// Function to check if two line segments intersect using parametric approach
function doLinesIntersectParametric(lines) {
    const numLines = lines.length;

    for (let i = 0; i < numLines - 1; i++) {
        const line1 = lines[i];
        const [x1, y1] = line1[0];
        const [x2, y2] = line1[1];

        for (let j = i + 1; j < numLines; j++) {
            const line2 = lines[j];
            const [x3, y3] = line2[0];
            const [x4, y4] = line2[1];

            const ua_num = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
            const ua_denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

            const ub_num = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
            const ub_denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

            const ua = ua_denom !== 0 ? ua_num / ua_denom : Number.MAX_VALUE;
            const ub = ub_denom !== 0 ? ub_num / ub_denom : Number.MAX_VALUE;

            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                return true; // Intersection found
            }
        }
    }

    return false; // No intersection found
}
