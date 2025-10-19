import { MissionUtils } from "@woowacourse/mission-utils";

const INPUT_MESSAGE = "덧셈할 문자열을 입력해 주세요.\n";

const OUTPUT_MESSAGE_PREFIX = "결과 : ";

export const readLineAsync = () =>
  MissionUtils.Console.readLineAsync(INPUT_MESSAGE);

export const printResult = (result) =>
  MissionUtils.Console.print(`${OUTPUT_MESSAGE_PREFIX}${result}`);
