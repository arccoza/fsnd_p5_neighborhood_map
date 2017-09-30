var print = console.log.bind(console)

// https://stackoverflow.com/questions/27457977/searching-wikipedia-using-api
// https://www.mediawiki.org/wiki/API:Opensearch
// REF: https://stackoverflow.com/a/43667416/1401702
// REF: https://www.mediawiki.org/wiki/Manual:CORS#Description
export default function wikiSearch(topic) {
  var opts = {
    method: 'GET',
    mode: 'cors',
  }

  return fetch(
    `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${topic}&limit=1&namespace=0&format=json&redirects=resolve`,
    opts)
  .then(resp => {
    if (resp.ok)
      return resp.json()
    else
      throw resp
  })
  .then(([title,,[summary],[link]]) => ({title, summary, link}))
}

// wikiSearch('Moses Mabhida Stadium').then(resp => print(resp)).catch(err => print(err))
