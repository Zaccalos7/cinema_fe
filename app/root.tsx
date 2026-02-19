import {Outlet, Links, Meta, Scripts, ScrollRestoration} from 'react-router'
import './app.css'
import './mainstyle.css'

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="w-screen h-screen flex flex-col">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

const Root = () => {
  return <Outlet />
}

export default Root
