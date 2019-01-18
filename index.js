const driveX = require('decorated-google-drive');
const request = require('request');

module.exports = function (googleapis, googleCred) {
  
  function preValidate(params){
    if (params && params.state && params.code && params.scope){
      if (typeof(params.state)==='string'){
        params.state = JSON.parse(params.state);
      }
      return true;
    }
  }

  async function getTokens(params) {
    if (params && params.code) {
      const oAuth2Client = new googleapis.auth.OAuth2(
        googleCred.key,
        googleCred.secret,
        googleCred.redirect
      );
      const { tokens } = await oAuth2Client.getToken(params.code);
      return tokens;
    }
    throw new Error("open-from-google-drive:getDriveTokens missing params.code");
  }

  async function open({params=null, fields='*', maxSize=0}){
    if (preValidate(params)){
      const tokens = await getTokens(params);
      const drive = driveX(googleapis, request, googleCred, tokens);
      const r = {drive};
      const user = await drive.x.aboutMe();
      r.user = user;
      const state = params.state;
      const fileId = (state.ids && state.ids[0]) || state.id;
      const fileResponse = await drive.files.get({fileId, fields});
      r.file = fileResponse && fileResponse.data;
      if ((+maxSize > 0) && 
        (r.file && r.file.size) &&
        (+(r.file.size) <= +maxSize )){
          r.contents = await drive.x.contents(fileId);
      }
      return r;
    }
    return null;
  }

  return {
      open
  };

};
