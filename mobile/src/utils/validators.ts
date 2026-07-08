export function validateEmail(email: string) {
  if (!email.trim()) {
    return "Email is required";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    return "Enter a valid email";
  }

  return "";
}

export function validatePassword(password: string) {
  if (!password.trim()) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return "";
}