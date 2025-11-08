// src/common/filters/helpers/extract-validation-message.ts

export function extractValidationMessage(responseBody: unknown): string {
  let messages: string[] = [];

  if (typeof responseBody === 'string') {
    messages = [responseBody];
  } else if (
    responseBody &&
    typeof responseBody === 'object' &&
    'message' in responseBody
  ) {
    const msg = (responseBody as { message?: string | string[] }).message;
    if (Array.isArray(msg)) {
      messages = msg;
    } else if (typeof msg === 'string') {
      messages = [msg];
    }
  }

  return messages.length > 0 ? messages.join(', ') : 'Validation failed';
}
