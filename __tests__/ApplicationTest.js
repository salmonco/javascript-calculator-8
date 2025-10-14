import { MissionUtils } from "@woowacourse/mission-utils";
import App, {
  isCustomDelimiterFormat,
  isValidInput,
  parseCustomDelimiter,
  replaceTextByDelimiters,
  splitByDelimiters,
} from "../src/App.js";

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

describe("문자열 계산기", () => {
  test("커스텀 구분자 사용", async () => {
    const inputs = ["//;\\n1"];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ["결과 : 1"];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test("예외 테스트", async () => {
    const inputs = ["-1,2,3"];
    mockQuestions(inputs);

    const app = new App();

    await expect(app.run()).rejects.toThrow("[ERROR]");
  });

  test("구분자를 기준으로 분리", () => {
    expect(splitByDelimiters("1,2:3", [",", ":"])).toEqual(["1", "2", "3"]);
    expect(splitByDelimiters("1;2,3:4", [",", ":", ";"])).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
  });

  test(`"//"와 "\n" 사이에 위치하는 문자 파싱`, () => {
    expect(parseCustomDelimiter("//v\\n1,2;3")).toBe("v");
    expect(parseCustomDelimiter("//6\\n1,2;3")).toBe("6");
    expect(() => parseCustomDelimiter("//\\n1,2;3")).toThrow(
      "[ERROR] 커스텀 구분자 형식이 올바르지 않습니다."
    );
    expect(() => parseCustomDelimiter("//abc\\n1,2;3")).toThrow(
      "[ERROR] 커스텀 구분자 형식이 올바르지 않습니다."
    ); // NOTE: 커스텀 구분자로 2개 이상의 문자는 허용하지 않음
  });

  test("replaceTextByDelimiters", () => {
    expect(replaceTextByDelimiters("1,2:3", [",", ":"])).toBe("123");
    expect(replaceTextByDelimiters("1;2,3:4", [",", ":", ";"])).toBe("1234");
  });

  test("isCustomDelimiterFormat", () => {
    expect(isCustomDelimiterFormat("//;\\n1;2;3")).toBe(true);
    expect(isCustomDelimiterFormat("1,2:3")).toBe(false);
  });

  test("사용자가 잘못된 값을 입력했는지 여부 판단", () => {
    expect(isValidInput("1,2:3")).toBe(true);
    expect(isValidInput("1;2,3:4")).toBe(false);

    expect(isValidInput("1,2;3a")).toBe(false);
    expect(isValidInput("1,2;-3")).toBe(false); // NOTE: 음수는 허용하지 않음

    expect(isValidInput("//;\\n1;2;3")).toBe(true);
    expect(isValidInput("//v\\n1v2:3")).toBe(true);

    expect(isValidInput("//;\\n1;2;3a")).toBe(false);
    expect(isValidInput("//;\\n1;2,-3")).toBe(false);
    expect(isValidInput("//\\n1;2;3")).toBe(false);
  });
});
