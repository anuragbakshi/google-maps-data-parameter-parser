import { BasicNode } from "./basic-node";

/**
 * Protocol Buffer implementation, which extends the functionality of Node
 * while specifically typing the stored value
 *
 * @param {string|number} id
 * @param {string} type
 * @param {string} value
 * @extends {BasicNode}
 * @constructor
 */
export class PrBufNode extends BasicNode<{
    id: number;
    type: string;
    value: string;
}> {
    constructor(id: string | number, type: string, value: string) {
        super({ id: Number(id), type, value });
    }

    id() {
        return this.val.id;
    }

    type() {
        return this.val.type;
    }

    value() {
        return this.val.value;
    }

    /**
     * Compares the number of descendants with the value specified in the map element.
     * If all the children have not yet been added, we continue adding to this element.
     */
    findLatestIncompleteNode() {
        //if it's a branch (map) node ('m') and has room,
        //or if it's the root (identified by having a null parent), which has no element limit,
        //then return this node
        if (
            (this.val.type === "m" &&
                this.val.value > this.getTotalDescendantCount()) ||
            undefined === this.parent
        ) {
            return this;
        } else {
            return this.parent.findLatestIncompleteNode();
        }
    }
    /**
     * Parses the input URL 'data' protocol buffer parameter into a tree
     */
    static create(urlToParse: string): PrBufNode | null {
        let rootNode = null;
        let re = /data=!([^?&]+)/;
        let dataArray = urlToParse.match(re);
        if (!dataArray || dataArray.length < 1) {
            re = /mv:!([^?&]+)/;
            dataArray = urlToParse.match(re);
        }
        if (dataArray && dataArray.length >= 1) {
            rootNode = new PrBufNode();
            let workingNode = rootNode;
            //we iterate through each of the elements, creating a node for it, and
            //deciding where to place it in the tree
            let elemArray = dataArray[1].split("!");
            for (let i = 0; i < elemArray.length; i++) {
                const elemRe = /^([0-9]+)([a-z])(.+)$/;
                const elemValsArray = elemArray[i].match(elemRe);
                if (elemValsArray && elemValsArray.length > 3) {
                    const elemNode = new PrBufNode(
                        parseInt(elemValsArray[1]),
                        elemValsArray[2],
                        elemValsArray[3]
                    );
                    workingNode.addChild(elemNode);
                    workingNode = elemNode.findLatestIncompleteNode();
                }
            }
        }
        return rootNode;
    }
}
