export class BasicNode<T> {
    children: this[] = [];
    parent?: this;

    constructor(public val: T) {}

    /**
     * Sets the parent node of this node.
     */
    setParentNode(node: this) {
        this.parent = node;
        node.children[node.children.length] = this;
    }

    /**
     * Gets the parent node of this node.
     */
    getParentNode() {
        return this.parent;
    }

    /**
     * Adds a child node of this node.
     */
    addChild(node: this) {
        node.parent = this;
        this.children[this.children.length] = node;
    }

    /**
     * Gets the array of child nodes of this node.
     */
    getChildren() {
        return this.children;
    }

    /**
     * Removes all the children of this node.
     */
    removeChildren() {
        for (let child of this.children) {
            delete child.parent;
        }

        this.children = [];
    }

    /**
     * Recursively counts the number of all descendants, from children down, and
     * returns the total number.
     */
    getTotalDescendantCount() {
        let count = 0;
        for (let child of this.children) {
            count += child.getTotalDescendantCount();
        }

        return count + this.children.length;
    }
}
