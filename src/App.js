import { Calculator } from "./Calculator.js";
import { InputParser } from "./InputParser.js";
import { printResult, readLineAsync } from "./io.js";

class App {
  async run() {
    const input = await readLineAsync();

    const inputParser = new InputParser(input);
    const numbers = inputParser.getNumbers();

    const calculator = new Calculator(numbers);
    const result = calculator.sum();

    printResult(result);
  }
}

export default App;
