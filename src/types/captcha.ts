interface ITurnstileSuccess {
  success: true;
  challenge_ts: string;
  hostname: string;
  "error-codes": (keyof typeof TurnstileErrorCodes)[];
  action: string;
  cdata: string;
}
interface ITurnstileError {
  success: false;
  "error-codes": (keyof typeof TurnstileErrorCodes)[];
}
export type ITurnstileResponse = ITurnstileSuccess | ITurnstileError;

export const TurnstileErrorCodes = {
  "missing-input-secret": "Captcha secret key was not provided",
  "invalid-input-secret": "Captcha secret key is invalid",
  "missing-input-response": "Captcha token was not provided",
  "invalid-input-response": "Captcha token is invalid or expired",
  "bad-request": "Request is malformed or invalid",
  "timeout-or-duplicate": "Captcha token is expired or already used",
  "internal-error": "Something went wrong on Turnstile's end, please try again later",
} as const;
