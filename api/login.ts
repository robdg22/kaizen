export default function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const sitePassword = process.env.SITE_PASSWORD
  
  if (!sitePassword) {
    return new Response('Password not configured', { status: 500 })
  }

  return request.formData().then(data => {
    const password = data.get('password')
    
    if (password === sitePassword) {
      // Create response and set auth cookie
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': 'site-auth=authenticated; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/'
        }
      })
    } else {
      // Wrong password, redirect back to login with error
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/login?error=1'
        }
      })
    }
  })
}
