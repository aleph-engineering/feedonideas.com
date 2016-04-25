# FOI

## How to launch
git clone https://github.com/aleph-engineering/feedonideas.com.git

### install npm packages
```
npm install
```

### install mongodb
```
sudo apt-get install mongodb -qyy
```

### Set environment variables
```
export FOI_FACEBOOK_APP_ID="[facebook app id]"
export FOI_FACEBOOK_APP_SECRET="[facebook app secret]"
export FOI_GOOGLE_CLIENT_ID="[google client id]"
export FOI_GOOGLE_CLIENT_SECRET="[google client secret]"
export FOI_LINKEDIN_API_KEY="[lindedin api key]"
export FOI_LINKEDIN_SECRET_KEY="[linkedin secret key]"
export FOI_GITHUB_CLIENT_ID="[github client id]"
export FOI_GITHUB_CLIENT_SECRET="[github client secret]"
export FOI_TWILIO_ACCOUNT_SID="[twilio account sid]"
export FOI_FOI_TWILIO_AUTH_TOKEN="[twilio auth token]"
export FOI_FOI_EXPRESS_SESSION_KEY="[express session key]"
export FOI_FOI_PORT=3001
```

### launch the application
```
npm start
```

open browse in http://localhost:3001
