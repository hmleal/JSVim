const Editor = require("./main")

test("Typing append character to the current line", () => {
    let ed = new Editor(10, 10)
    ed.currentRow = "H"
    ed.currentRow = "e"

    expect(ed.currentRow.text).toBe("He")
});

test("Backspace remove the last character from the current line", () => {
    let ed = new Editor(10, 10)
    ed.currentRow = "Henrique"
    ed.currentRow = -1

    expect(ed.currentRow.text).toBe("Henriqu");
});