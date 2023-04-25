#!/usr/bin/env node
const readline = require("readline")
const Editor = require("./main")

let editor = new Editor(process.stdout.rows, process.stdout.columns)
process.stdout.write(editor.refreshScreen())

readline.emitKeypressEvents(process.stdin)

process.stdin.setRawMode(true)
process.stdin.on("keypress", (str, key) => {
    switch(key.sequence) {
        case "\x1B[A": // UP
            process.stdout.write(editor.moveCursorUp())
            break
        case "\x1B[B": // DOWN
            process.stdout.write(editor.moveCursorDown())
            break
        case "\x1B[C": // RIGHT
            process.stdout.write(editor.moveCursorRight())
            break
        case "\x1B[D": // LEFT
            process.stdout.write(editor.moveCursorLeft())
            break
        case "\x7F": // BACKSPACE
            if(editor.cursor.x > 0) {
                process.stdout.write("\x1B[1000D") // Move all the way left
                process.stdout.write("\x1B[0K")    // Clear line

                editor.cursor.x -= 1
                editor.currentRow = -1

                process.stdout.write(editor.currentRow.text)
                process.stdout.write("\x1B[1000D") // Move all the way left again
                process.stdout.write(`\x1B[${editor.cursor.x}C`) // Move cursor too index
            }
            break
        case "\r": // ENTER
            editor.cursor.x = 0
            editor.cursor.y += 1
            editor.rows.push({text: ""})

            process.stdout.write(editor.refreshScreen())
            break
        default:
            editor.cursor.x += 1
            editor.currentRow = str
            break
    }

    if (typeof str !== 'undefined')
    {
        process.stdout.write(str)
    }

    editor.toolbar()

    if(key.name == "m") {
        throw("Saindo")
    }
})
