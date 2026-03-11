import {type Route} from './+types/api-setting-save'

const BASE_URL = 'http://localhost:1200/settings/save'

export const action = async ({request, context}: Route.ActionArgs) => {
  const formData = await request.formData()

  const data = formData.get('data') as string

  const parsedData = JSON.parse(data)

  console.log(parsedData)

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parsedData)
  })

  const messageResponse: {message: string; response: string} = await response.json()
  console.log({messageResponse})

  return {
    message: messageResponse.message,
    response: messageResponse.response
  }
}
