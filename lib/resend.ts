import { Resend } from "resend";

let _resend: Resend | null | undefined;

function getResend(): Resend | null {
  if (_resend === undefined) {
    const apiKey = process.env.RESEND_API_KEY;
    _resend = apiKey ? new Resend(apiKey) : null;
  }

  return _resend;
}

export const RESEND_FROM = "noreply@melbcircle.com";
export { getResend as resend };
