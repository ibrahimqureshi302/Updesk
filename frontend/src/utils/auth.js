export const setAccessToken = (token) => {
  localStorage.setItem('accessToken', token)
}

export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const setRefreshToken = (token) => {
  localStorage.setItem('refreshToken', token)
}

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken')
}

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}