#!/usr/bin/env node
const readline = require("readline")
const Editor = require("./main")

let editor = new Editor(process.stdout.rows, process.stdout.columns)
process.stdout.write(editor.refreshScreen())

readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true)
process.stdin.on("keypress", (str, key) => {
    // console.log(key)
    switch(key.sequence) {
        case "\x1B[A": // UP
            editor.moveCursorUp()
            break
        case "\x1B[B": // DOWN
            editor.moveCursorDown()
            break
        case "\x1B[C": // RIGHT
            editor.moveCursorRight()
            break
        case "\x1B[D": // LEFT
            editor.moveCursorLeft()
            break
        case "\x7F": // BACKSPACE
            if(editor.cursor.x > 0) {
                process.stdout.write("\x1B[1000D") // Move all the way left
                process.stdout.write("\x1B[0K")    // Clear line
                editor.currentRow = editor.currentRow.slice(0, -1)
                editor.cursor.x -= 1
                process.stdout.write(editor.currentRow)
                process.stdout.write("\x1B[1000D") // Move all the way left again
                process.stdout.write(`\x1B[${editor.currentRow.length}C`) // Move cursor too index
            } else if (editor.cursor.x <= 0) {
                let previousLineIndex = editor.cursor.y - 1

                editor.cursor.x = editor.rows[previousLineIndex].text.length
                editor.cursor.y = previousLineIndex

                editor.moveCursor(editor.cursor.x, editor.cursor.y)
                editor.currentRow = editor.rows[previousLineIndex].text
                // editor.rows.pop() // Remove last array element
                process.stdout.write(editor.refreshScreen())
            }
            break
        case "\r": // ENTER
            editor.setCurrentRow()
            editor.cursor.y += 1
            editor.cursor.x = 0
            process.stdout.write(editor.refreshScreen())
            break
        default:
            editor.currentRow += str
            editor.cursor.x += 1
    }

    if (typeof str !== 'undefined')
    {
        process.stdout.write(str)
    }

    editor.toolbar(key)

    if(key.name == "m") {
        throw("Saindo")
    }
})
