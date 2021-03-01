export const validateRegisterInput = (
  userName,
  email,
  password,
  confirmPAssword
) => {
  const errors = {};
  if (userName.trim() === '') {
    errors.userName = 'Username must not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'Email must not; be empty';
  } else {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(regEx)) {
      errors.email = 'Emial must be a valid email adddress';
    }
  }
  if (password === '') {
    errors.password = 'Password must not empty';
  } else if (password !== confirmPAssword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInut = (userName, password) => {
  const errors = {};
  if (userName.trim() === '') {
    errors.userName = 'Username must not be empty';
  }
  if (password === '') {
    errors.password = 'Password must not empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
