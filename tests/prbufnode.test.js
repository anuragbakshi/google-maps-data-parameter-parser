const PrBufNode = require("../src/prbufnode");

const rootNode = PrBufNode.create("data=!1m4!1sa!1m1!2sb!1sc");

test("Expects rootNode to be valid PrBufNode", () => {
    expect(rootNode).toBeInstanceOf(PrBufNode);
});
test("Expects rootNode to have 5 total descendants", () => {
    expect(rootNode.getTotalDescendantCount()).toBe(5);
});
test("Expects rootNode to have 1 direct descendant", () => {
    expect(rootNode.getChildren()).toHaveLength(1);
});

test("Expects rootNode[0] to have 3 direct descendants", () => {
    expect(rootNode.getChildren()[0].getChildren()).toHaveLength(3);
});
test("Expects rootNode[0][0] to have 0 direct descendants", () => {
    expect(
        rootNode.getChildren()[0].getChildren()[0].getChildren()
    ).toHaveLength(0);
});
test('Expects rootNode[0][0] to have value: "a"', () => {
    expect(rootNode.getChildren()[0].getChildren()[0].value()).toBe("a");
});
test("Expects rootNode[0][1] to have 1 direct descendants", () => {
    expect(
        rootNode.getChildren()[0].getChildren()[1].getChildren()
    ).toHaveLength(1);
});
