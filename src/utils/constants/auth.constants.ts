// the previous character class i.e. [a-zA-Z0-9_] must repeat at least 3 times and at most 20
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

// [^\s@] = any character except whitespace and @
const EMAIL_REGEX = /^(?=.{8,50}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;

// (?= ... ) is a lookahead.
// It means: "there must be … somewhere in the string."
// .*[A-Z] = any characters, followed by an uppercase letter (A–Z).
// 👉 This ensures the string has at least one uppercase letter.
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

export { USERNAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX };

// const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
