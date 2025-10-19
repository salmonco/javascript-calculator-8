const ERROR_PREFIX = "[ERROR] ";

/**
 * "[ERROR]"로 시작하는 메시지 출력
 * @param message
 * @throws error prefix가 추가된 메시지
 */
export const throwError = (message) => {
  throw new Error(`${ERROR_PREFIX}${message}`);
};
