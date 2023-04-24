class Editor {
    constructor(screenRows, screenCols) {
        this.screenRows = screenRows
        this.screenCols = screenCols
        this.cursor = {x: 0, y: 0}
        this.rows = [] // {text: "text"}
        this.currentRow = ""
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

        // TODO: remove this process
        return buffer.join("")
    }

    setCurrentRow() {
        if(this.rows[this.cursor.y] !== undefined) {
            this.rows[this.cursor.y] = {text: this.currentRow}
        } else {
            this.rows.push({text: this.currentRow})
        }
        this.currentRow = ""
    }

    toolbar(key) {
        process.stdout.write(`\x1b[${this.screenCols};0H`) // Move cursor to last line
        process.stdout.write(`y: ${this.cursor.y}, x: ${this.cursor.x} // X: ${this.screenRows}, Y: ${this.screenCols}, CurrentRowLength: ${this.currentRow.length}`)
        process.stdout.write(`\x1b[${this.cursor.y + 1};${this.cursor.x + 1}H`) // Move cursor to last line

    }

    moveCursor(x, y) {
        this.cursor.x = x;
        this.cursor.y = y;

        let buffer = ["\x1b[?25l"]
        buffer.push(`\x1b[${this.cursor.y};${this.cursor.x}H`)
        buffer.push("\x1b[?25h") // Enable cursor back

        process.stdout.write(buffer.join(""))
    }

    moveCursorUp() {
        if(this.cursor.y != 0) {
            this.moveCursor(this.cursor.x, this.cursor.y - 1)
        }
    }

    moveCursorDown() {
        if(this.cursor.y < this.rows.length) {
            this.moveCursor(this.cursor.x, this.cursor.y + 1)
        }
    }

    moveCursorRight() {
        if(this.cursor.x <= this.currentRow.length) {
            this.moveCursor(this.cursor.x + 1, this.cursor.y)
        }
    }

    moveCursorLeft() {
        if(this.cursor.x > 0) {
            this.moveCursor(this.cursor.x - 1, this.cursor.y)
        }
    }
}

module.exports = Editor