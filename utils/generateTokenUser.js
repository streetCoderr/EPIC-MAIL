const generateTokenUser = (user) => ({
  userId: user._id,
  name: `${user.firstName} ${user.lastName}`,
  role: user.role
})

module.exports = generateTokenUser