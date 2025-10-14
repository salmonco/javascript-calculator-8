import { MissionUtils } from "@woowacourse/mission-utils";

// - 쉼표(,) 또는 콜론(:)을 구분자로 등록
const DEFAULT_DELIMITERS = [",", ":"];

// - 구분자를 기준으로 분리
export const splitByDelimiters = (text, delimiters) => {
  const regex = new RegExp(delimiters.join("|"));
  return text.split(regex);
};

// - 각 숫자를 더하기
const sum = (numbers) => numbers.reduce((acc, cur) => acc + cur, 0);

const CUSTOM_DELIMITER_PATTERN = /^\/\/(.)\\n/;

// - "[ERROR]"로 시작하는 메시지 출력
const throwError = (message) => {
  throw new Error(`[ERROR] ${message}`);
};

// - "//"와 "\n" 사이에 위치하는 문자 파싱
export const parseCustomDelimiter = (text) => {
  const match = text.match(CUSTOM_DELIMITER_PATTERN);
  if (match) {
    return match[1];
  }
  throwError("커스텀 구분자 형식이 올바르지 않습니다.");
};

// - 커스텀 구분자를 등록
const getAllDelimiters = (originalDelimiters, customDelimiter) => [
  ...originalDelimiters,
  customDelimiter,
];

export const replaceTextByDelimiters = (text, delimiters) =>
  delimiters.reduce((acc, delimiter) => acc.replaceAll(delimiter, ""), text);

export const isCustomDelimiterFormat = (text) =>
  CUSTOM_DELIMITER_PATTERN.test(text);

// - 문자열이 허용된 구분자로 이루어져 있는지 판단
const isValidText = (text, delimiters) => {
  const replacedText = replaceTextByDelimiters(text, delimiters);
  return !Number.isNaN(Number(replacedText));
};

// - 사용자가 잘못된 값을 입력했는지 여부 판단
export const isValidInput = (text) => {
  if (isCustomDelimiterFormat(text)) {
    const customDelimiter = parseCustomDelimiter(text);
    const allDelimiters = getAllDelimiters(DEFAULT_DELIMITERS, customDelimiter);
    return isValidText(
      text.replace(CUSTOM_DELIMITER_PATTERN, ""),
      allDelimiters
    );
  }

  return isValidText(text, DEFAULT_DELIMITERS);
};

const getNumbers = (input) => {
  let numbers;
  if (isCustomDelimiterFormat(input)) {
    const customDelimiter = parseCustomDelimiter(input);
    const allDelimiters = getAllDelimiters(DEFAULT_DELIMITERS, customDelimiter);
    numbers = splitByDelimiters(
      input.replace(CUSTOM_DELIMITER_PATTERN, ""),
      allDelimiters
    );
  } else {
    numbers = splitByDelimiters(input, DEFAULT_DELIMITERS);
  }

  return numbers.map(Number);
};

class App {
  async run() {
    // NOTE: 커스텀 구분자를 입력하기 위해 \n을 입력하면 이스케이프 처리되어 \\n로 바뀜
    const input = await MissionUtils.Console.readLineAsync(
      "덧셈할 문자열을 입력해 주세요.\n"
    );

    if (!isValidInput(input)) {
      throwError("입력 값이 올바르지 않습니다.");
    }

    const numbers = getNumbers(input);
    const result = sum(numbers);
    MissionUtils.Console.print(`결과 : ${result}`);
  }
}

export default App;
