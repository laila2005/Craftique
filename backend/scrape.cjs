const https = require('https');
const options = {
  hostname: 'unsplash.com',
  path: '/s/photos/handmade-crafts',
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/"id":"(.*?)"/g);
    if (match) {
      const ids = [...new Set(match.map(s => s.replace(/"id":"|"/g, '')))].filter(id => id.length === 11 || id.includes('-'));
      console.log(ids.slice(0, 30).join(','));
    } else {
      console.log('No matches');
    }
  });
});
