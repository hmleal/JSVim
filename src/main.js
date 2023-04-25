class Editor {
    constructor(screenRows, screenCols) {
        this.screenRows = screenRows
        this.screenCols = screenCols
        this.cursor = {x: 0, y: 0}
        this.rows = [{text: ""}]
    }

    get currentRowIndex() {
        return this.cursor.y
    }

    set currentRow(value) {
        if(value === -1) {
            this.rows[this.cursor.y].text  = this.rows[this.cursor.y].text.slice(0, -1)
        } else {
            this.rows[this.cursor.y].text += value
        }
    }

    get currentRow() {
        return this.rows[this.cursor.y]
    }

    refreshScreen() {
        let buffer = [
            "\x1b[?25l",  // disable cursor
            "\x1b[H",     // move cursor back to (0, 0)
        ]

        for(let i = 0; i < this.screenRows; i++) {
            buffer.push("\x1b[K")  // clean the current line

            // rows
            if (this.rows[i] !== undefined) {
                buffer.push(this.rows[i].text)
                buffer.push("\r\n")
                continue
            }

            // regular lines
            if(i < this.screenRows - 1) {
                buffer.push("~\r\n")
                continue
            }

            // last line
            // buffer.push(`y: ${this.cursor.y + 1}, x: ${this.cursor.x} + 1`)

            // if(i == Math.floor(this.screenRows / 3)) {
            //     let welcomeMessage = "Kilo editor -- version 1.0"
            //     let padding = Math.floor((this.screenCols - welcomeMessage.length) / 2)
            //     if(padding) {
            //         buffer.push("~")
            //         padding--;
            //     }
            //     while(padding--) { buffer.push(" ")}
            //     buffer.push(welcomeMessage)
            //     buffer.push("\n")
            // }

        }

        // move the cursor back to the original position
        buffer.push(`\x1b[${this.cursor.y + 1};${this.cursor.x + 1}H`)

        // enable cursor back
        buffer.push("\x1b[?25h")

        return buffer.join("")
    }

    toolbar() {
        process.stdout.write(`\x1b[${this.screenCols};0H`) // Move cursor to last line
        // process.stdout.write(`y: ${this.cursor.y}, x: ${this.cursor.x} // screenRows: ${this.screenRows}, screenCols: ${this.screenCols}`)
        process.stdout.write(`y: ${this.cursor.y}, x: ${this.cursor.x} // screenRows: ${this.screenRows}, screenCols: ${this.screenCols} // currentRow: ${this.currentRow.text}`)
        process.stdout.write(`\x1b[${this.cursor.y + 1};${this.cursor.x + 1}H`) // Move cursor back

    }

    moveCursor(x, y) {
        this.cursor.x = x;
        this.cursor.y = y;

        let buffer = ["\x1b[?25l"]
        buffer.push(`\x1b[${this.cursor.y};${this.cursor.x}H`)
        buffer.push("\x1b[?25h") // Enable cursor back

        return buffer.join("")
    }

    moveCursorUp() {
        if(this.cursor.y != 0) {
            let cursorX = this.rows[this.cursor.y - 1].text.length
            return this.moveCursor(cursorX, this.cursor.y - 1)
        }
        return ""
    }

    moveCursorDown() {
        if(this.cursor.y < this.rows.length - 1) {
            let cursorX = this.rows[this.cursor.y + 1].text.length

            return this.moveCursor(cursorX, this.cursor.y + 1)
        }
        return ""
    }

    moveCursorRight() {
        if(this.cursor.x <= this.currentRow.text.length - 1) {
            return this.moveCursor(this.cursor.x + 1, this.cursor.y)
        }
        return ""
    }

    moveCursorLeft() {
        if(this.cursor.x > 0) {
            return this.moveCursor(this.cursor.x - 1, this.cursor.y)
        }
        return ""
    }
}

module.exports = Editor