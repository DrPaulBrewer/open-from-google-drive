# open-from-google-drive

Helper partially implementing 'open with' for integrated, installed 3rd party Google Drive Apps 

## Background

Google Drive API v3 allows a 3rd party developer to create a Google Drive App that can be installed
into a customer's/end user's Google Drive.  These apps can have a webhook executed when the customer right clicks 
on a file in Drive and selects "Open With" and then the app from a dropdown menu.  The webhook will receive query parameters for an
OAuth2 code, a fileId, etc., that corresponds to the customer's open file request.

## Installation

    npm i open-from-google-drive -S
    npm i googleapis -S

## Operational Hints

    const googleapis = require('googleapis').google;
    const googlecred = {  
      key: 'YOUR_DRIVE_API_ACCESS_KEY',
      secret: 'YOUR DRIVE API_ACCESS_SECRET'
      redirect: 'YOUR OAUTH2 REDIRECT URL'
    };
    const opener = require('open-from-google-drive');
    const open = opener(googleapis,googlecred).open;
    // open is used in your HTTP request handler
    // this will vary somewhat by framework
    async function handler(req,reply){
      const { user, file, contents } = await open(
       {
        params: (req.params || req.query), 
        fields: '*',   
        maxSize: 1024*1024
       }
      );
      // further processing of user, file metadata, or file contents
    }

This helper will:

* exchange the "code" for an OAuth2 refresh/access token
* use these tokens to populate a Google Drive Client (provided by googleapis and decorated-google-drive)
* use the drive client to return the accessing user, and the file metadata 
* optionally retrieve the file contents, if the file is less than a developer selectable maxSize

## Copyright

Copyright 2019 Paul Brewer, Economic and Financial Technology Consulting LLC <dr
paulbrewer@eaftc.com>

## License

The MIT license

## No relationship to Google, Inc.

This software is not a product of Google, Inc.

Google Drive[tm] is a trademark of Google Inc.
