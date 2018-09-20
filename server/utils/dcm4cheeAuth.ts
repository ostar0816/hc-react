import axios from 'axios';
import https from 'https';
import querystring from 'querystring';
import config from 'config';

export async function getToken(clientSecret) {
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  const url = config.get<string>('dcm4chee.keycloakUrl');
  const result = await instance.post(
    url,
    querystring.stringify({
      grant_type: 'client_credentials',
      client_id: 'curl',
      client_secret: clientSecret,
    }),
  );

  return result.data.access_token;
}
