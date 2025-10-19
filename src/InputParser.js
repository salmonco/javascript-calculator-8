import { throwError } from "./throwError.js";

export class InputParser {
  /**
   * 기본 구분자: 쉼표(,) 또는 콜론(:)
   */
  static #DEFAULT_DELIMITERS = [",", ":"];

  /**
   * 커스텀 구분자 패턴: "//<구분자>\\n"
   * - NOTE: 커스텀 구분자를 입력하기 위해 \n을 입력하면 이스케이프 처리되어 \\n로 바뀜
   */
  static #CUSTOM_DELIMITER_PATTERN = /^\/\/(.)\\n/;

  #input;

  #customDelimiter;

  #parsedInput;

  #allDelimiters;

  constructor(input) {
    this.#input = input;
    this.#customDelimiter = this.#parseCustomDelimiter();
    this.#parsedInput = this.#parseInput();
    this.#allDelimiters = this.#getAllDelimiters();

    if (!this.#isValidInput()) {
      throwError("입력 값이 올바르지 않습니다.");
    }
  }

  /**
   * 문자열에서 숫자 추출
   * @returns 추출된 숫자 배열
   */
  getNumbers() {
    const numbers = this.#splitByDelimiters();
    return numbers.map(Number);
  }

  /**
   * 커스텀 구분자 위치에 있는 문자 파싱
   * @returns 커스텀 구분자
   */
  #parseCustomDelimiter() {
    const match = this.#input.match(InputParser.#CUSTOM_DELIMITER_PATTERN);
    if (match) {
      return match[1];
    }
    throwError("커스텀 구분자 형식이 올바르지 않습니다.");
    return null;
  }

  /**
   * 커스텀 구분자 패턴을 제외한 인풋
   * @returns 파싱된 인풋 문자열
   */
  #parseInput() {
    if (this.#customDelimiter) {
      return this.#input.replace(InputParser.#CUSTOM_DELIMITER_PATTERN, "");
    }
    return this.#input;
  }

  /**
   * 모든 구분자 배열 반환
   * @returns 커스텀 구분자를 포함한 모든 구분자 배열
   */
  #getAllDelimiters() {
    if (this.#customDelimiter) {
      return [...InputParser.#DEFAULT_DELIMITERS, this.#customDelimiter];
    }
    return InputParser.#DEFAULT_DELIMITERS;
  }

  /**
   * 인풋 문자열이 허용된 구분자로 이루어져 있는지 여부 판단
   * @returns boolean
   */
  #isValidInput() {
    const replacedText = this.#replaceTextByDelimiters();
    return !Number.isNaN(Number(replacedText));
  }

  /**
   * 인풋을 구분자를 기준으로 분리
   * @returns 구분자로 분리된 배열
   */
  #splitByDelimiters() {
    const regex = new RegExp(this.#allDelimiters.join("|"));
    return this.#parsedInput.split(regex);
  }

  /**
   * 텍스트에서 구분자를 빈 문자열로 치환
   * @returns 치환된 문자열
   */
  #replaceTextByDelimiters() {
    return this.#allDelimiters.reduce(
      (acc, delimiter) => acc.replaceAll(delimiter, ""),
      this.#parsedInput
    );
  }
}
