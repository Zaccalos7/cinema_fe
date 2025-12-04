
import { createCookieSessionStorage } from "react-router";

const __createCookieSessionStorage = ({

  name = "_NEXT_RR_SESSION",
  sameSite = "lax",
  path = "/",
  httpOnly = true,
  secrets = ["0mekQ98jku"],
  secure = false

}) => {
  return createCookieSessionStorage({
    cookie: {
      name,
      sameSite,
      path,
      httpOnly,
      secrets,
      secure,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }
  })
}

export default __createCookieSessionStorage
