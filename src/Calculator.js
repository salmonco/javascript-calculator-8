import { throwError } from "./throwError.js";

export class Calculator {
  #numbers;

  constructor(numbers) {
    this.#numbers = numbers;

    if (this.#isNegativeNumber()) {
      throwError("음수는 허용하지 않습니다.");
    }
  }

  /**
   * 각 숫자를 더하기
   * @returns 숫자들의 합
   */
  sum() {
    return this.#numbers.reduce((acc, cur) => acc + cur, 0);
  }

  /**
   * 숫자 배열에 음수가 있는지 여부 판단
   * @returns 음수 존재 여부
   */
  #isNegativeNumber() {
    return this.#numbers.some((number) => number < 0);
  }
}
