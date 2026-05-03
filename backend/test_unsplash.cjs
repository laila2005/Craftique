const https = require('https');
https.get('https://unsplash.com/photos/IyDlAY_9wAE', { headers: { 'User-Agent': 'curl/7.68.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/property="og:image"\s+content="(.*?)"/);
    if (match) console.log(match[1]);
    else console.log('No og:image found. Length:', data.length);
  });
});
