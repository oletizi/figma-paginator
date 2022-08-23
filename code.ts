function traverse({node}: { node: any }, pageNumbers: Array<TextNode>) {
    if ("children" in node) {
        if (node.name == "PAGE NUMBER COMPONENT") {
            let child = node.children[0]
            let checkVisibility = false
            let visible = true
            // XXX: This visibility check doesn't work and I'm not sure why.
            if (checkVisibility) {
                const nodes = []
                nodes.push(child)

                let parent = child.parent
                while (parent != null) {
                    nodes.push(parent)
                    parent = parent.parent
                }
                for (const node of nodes) {
                    if (!node.visible) {
                        visible = false
                        break
                    }
                }
            }
            if (visible) {
                pageNumbers.push(child)
            }
        }
        for (const child of node.children) {
            traverse({node: child}, pageNumbers)
        }
    }
}

function pageNumberCompare(a: TextNode, b: TextNode): number {
    let rv = 0;
    const abox = a.absoluteBoundingBox, bbox = b.absoluteBoundingBox
    if (abox != null && bbox != null) {
        console.log(`A(x, y): ${abox.x}, ${bbox.y}`)
        console.log(`B(x, y): ${bbox.x}, ${bbox.y}`)
        rv = abox.y - bbox.y
        console.log(`first compare: ${rv}`)
        if (rv == 0) {
            rv = abox.x - bbox.x
            console.log(`second compare: ${rv}`)
        }
    }
    return rv
}

async function renumber(pageNumbers: Array<TextNode>) {
    let pageCount: number = 0
    for (const pageNumber of pageNumbers) {
        pageCount++
        const fontName = pageNumber.fontName as FontName
        await figma.loadFontAsync(fontName)
        const box = pageNumber.absoluteBoundingBox
        if (box != null) {
            console.log(`${pageCount}: (x,y): ${box.x}, ${box.y}`)
        } else {
            console.log(`${pageCount}: NULL BOUNDING BOX`)
        }
        pageNumber.characters = pageCount.toString()
    }
}

async function doStuff() {
    // Paginate
    let pageNumbers = new Array<TextNode>()
    traverse({node: figma.root}, pageNumbers) // start the traversal at the root
    pageNumbers.sort(pageNumberCompare)
    await renumber(pageNumbers)
}

doStuff().finally(() => figma.closePlugin())

