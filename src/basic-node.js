'use strict';

/**
 * @param {string|null} val
 * @constructor
 */
const BasicNode = function (val = null) {
    /**
     * @type {string}
     */
    this.val = val;
    /**
     * @type {BasicNode[]}
     */
    this.children = [];
    /**
     *
     * @type {BasicNode|null}
     */
    this.parent = null;

    /**
     * Sets the parent node of this node.
     * @param {BasicNode} node
     */
    this.setParentNode = function (node) {
        this.parent = node;
        node.children[node.children.length] = this;
    }

    /**
     * Gets the parent node of this node.
     * @returns {BasicNode|null}
     */
    this.getParentNode = function () {
        return this.parent;
    }

    /**
     * Adds a child node of this node.
     * @param {BasicNode} node
     */
    this.addChild = function (node) {
        node.parent = this;
        this.children[this.children.length] = node;
    }

    /**
     * Gets the array of child nodes of this node.
     * @returns {BasicNode[]}
     */
    this.getChildren = function () {
        return this.children;
    }

    /**
     * Removes all the children of this node.
     */
    this.removeChildren = function () {
        for (let child of this.children) {
            child.parent = null;
        }
        this.children = [];
    }

    /**
     * Recursively counts the number of all descendants, from children down, and
     * returns the total number.
     */
    this.getTotalDescendantCount = function () {
        let count = 0;
        for (let child of this.children) {
            count += child.getTotalDescendantCount();
        }
        return count + this.children.length;
    }
};

module.exports = BasicNode;
