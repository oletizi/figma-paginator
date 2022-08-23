let count = 0

function traverse({node}: { node: any }, pageNumbers: Array<InstanceNode>) {
    if ("children" in node) {
        if (node.name == "PAGE NUMBER COMPONENT") {
            pageNumbers.push(node)
            // count++
            // console.log("PAGE NUMBER!!!")
            // console.log('bounds: ' + JSON.stringify(node.absoluteBoundingBox))
        }
        for (const child of node.children) {
            traverse({node: child}, pageNumbers)
        }
    }
}
let pageNumbers = new Array<InstanceNode>()
traverse({node: figma.root}, pageNumbers) // start the traversal at the root
console.log('Page count: ' + count)
figma.closePlugin()