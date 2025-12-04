import type {Route} from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    {title: 'New React Router App'},
    {name: 'description', content: 'Welcome to React Router!'}
  ]
}

//on mac
export default function Home() {
  return (
    <>
      <div>ciao</div>
    </>
  )
}
