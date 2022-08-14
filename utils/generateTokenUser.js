const generateTokenUser = (user) => ({
  userId: user._id,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  role: user.role,
});

module.exports = generateTokenUser;
