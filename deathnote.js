const get_cookies_and_redirect = require('./cas-ha/getcookiesandredirect')

async function get_notes_page() {
  const fetched = await get_cookies_and_redirect()
  console.log(fetched)
}

get_notes_page()