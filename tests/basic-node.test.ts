import { test, expect } from "@jest/globals";
import { BasicNode } from "../src/basic-node";

const parentNode = new BasicNode(null);
const childNode1 = new BasicNode(null);
const childNode2 = new BasicNode(null);
const childNode3 = new BasicNode(null);
childNode1.setParentNode(parentNode);
childNode2.setParentNode(parentNode);
childNode3.setParentNode(childNode2);

test("Expects node to be ", () => {
    expect(childNode1).toBeInstanceOf(BasicNode);
});

test("Expects parent node to match", () => {
    expect(childNode1.getParentNode()).toBe(parentNode);
});

test("Expect parent node to have 2 children", () => {
    expect(parentNode.getChildren().length).toBe(2);
});
test("Expect child node to have 1 child", () => {
    expect(childNode2.getChildren().length).toBe(1);
});

test("Expect parent node to have 3 total descendants", () => {
    expect(parentNode.getTotalDescendantCount()).toBe(3);
});

test("Expect parent node to have 0 total descendants after cleanup", () => {
    parentNode.removeChildren();
    expect(parentNode.getTotalDescendantCount()).toBe(0);
});
