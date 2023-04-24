const Editor = require("./main")

test('New line should be an empty string', () => {
    let editor = new Editor(10, 10)

    editor.rows = [{text: "Henrique"}]
    editor.setCurrentRow()
    expect(editor.currentRow).toBe("");
});

test('Press enter should update current line if exists', () => {
    let editor = new Editor(10, 10)

    editor.rows = [{text: "Henrique"}]
    editor.currentRow = "Henrique Leal"
    editor.setCurrentRow()
    expect(editor.currentRow).toBe("");
    expect(editor.rows[0].text).toBe("Henrique Leal");
});

test('Press arrow up', () => {
    let editor = new Editor(10, 10)

    editor.cursor.y = 11
    editor.moveCursorUp()

    expect(editor.cursor.y).toBe(10);
});