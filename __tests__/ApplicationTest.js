import { MissionUtils } from "@woowacourse/mission-utils";
import App, { parseCustomDelimiter, splitByDelimiters } from "../src/App.js";

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
    expect(parseCustomDelimiter("//v\n1,2;3")).toBe("v");
    expect(parseCustomDelimiter("//6abc\n1,2;3")).toBe("6abc");
    expect(() => parseCustomDelimiter("//\n1,2;3")).toThrow(
      "[ERROR] 커스텀 구분자 형식이 올바르지 않습니다."
    );
  });
});
