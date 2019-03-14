const [INC, MOVE, LOOP, PRINT] = "INC|MOVE|LOOP|PRINT".split("|"); // union types

const Tape = function() {
  let index = 0; // We will re initialize
  const tape = [0];

  return {
    inc: x => (tape[index] += x),
    move: x => {
      index += x;
      while (index >= tape.length) {
        tape.push(0);
      }
    },
    get: () => tape[index]
  };
};

const Operation = (operation, value) => ({ operation, value });

const parse = function(iterator) {
  const res = [];
  for (let sym of iterator) {
    switch (sym) {
      case "+":
        res.push(Operation(INC, 1));
        break;
      case "-":
        res.push(Operation(INC, -1));
        break;
      case ">":
        res.push(Operation(MOVE, 1));
        break;
      case "<":
        res.push(Operation(MOVE, -1));
        break;
      case ".":
        res.push(Operation(PRINT, 0));
        break;
      case "[":
        res.push(Operation(LOOP, parse(iterator)));
        break;
      case "]":
        return res;
    }
  }
  return res;
};

const run = (tape, operations) => {
  for (var i = 0; i < operations.length; i++) {
    const { operation, value } = operations[i];
    switch (operation) {
      case INC:
        tape.inc(value);
        break;
      case MOVE:
        tape.move(value);
        break;
      case LOOP:
        while (tape.get() > 0) {
          run(tape, value);
        }
        break;
      case PRINT:
        process.stdout.write(String.fromCharCode(tape.get()));
        break;
    }
  }
};

function StringIterator(value) {
  const input = value;
  let position = 0;

  return {
    [Symbol.iterator]: function() {
      return {
        next: function() {
          if (position > value.length - 1) {
            return { done: true };
          } else {
            return {
              value: input[position++],
              done: false
            };
          }
        }
      };
    }
  };
}

const text = require("fs")
  .readFileSync(process.argv[2].toString())
  .toString();

const iString = new StringIterator(text);
const instructions = parse(iString);
run(new Tape(), instructions);
