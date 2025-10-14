import { Console } from "@woowacourse/mission-utils";

// - "덧셈할 문자열을 입력해 주세요." 메시지 출력
const printIntro = () => {
  Console.print("덧셈할 문자열을 입력해 주세요.");
};

// - 쉼표(,) 또는 콜론(:)을 구분자로 등록
const DEFAULT_DELIMITERS = [",", ":"];

// - 구분자를 기준으로 분리
export const splitByDelimiters = (text, delimiters) => {
  const regex = new RegExp(delimiters.join("|"));
  return text.split(regex);
};

// - 각 숫자를 더하기
const sum = (numbers) => numbers.reduce((acc, cur) => acc + cur, 0);

const CUSTOM_DELIMITER_PATTERN = /^\/\/(.)\n/;

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

// - 사용자가 잘못된 값을 입력했는지 여부 판단
export const isValidInput = (text) => {
  if (isCustomDelimiterFormat(text)) {
    const customDelimiter = parseCustomDelimiter(text);
    const allDelimiters = getAllDelimiters(DEFAULT_DELIMITERS, customDelimiter);
    const replacedText = replaceTextByDelimiters(
      text.replace(CUSTOM_DELIMITER_PATTERN, ""),
      allDelimiters
    );
    return !Number.isNaN(Number(replacedText));
  }

  const replacedText = replaceTextByDelimiters(text, DEFAULT_DELIMITERS);
  return !Number.isNaN(Number(replacedText));
};

// - Error를 발생시킨 후 애플리케이션은 종료
// - 문자열이 허용된 구분자로 이루어져 있는지 판단
// - "//"와 "\n" 사이에는 하나의 문자가 들어와야 한다. 아무것도 안 들어오거나 2개 이상의 문자가 들어오면 에러 발생

class App {
  async run() {
    printIntro();
  }
}

export default App;
