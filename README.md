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
export FACEBOOK_APP_ID="[facebook app id]"
export FACEBOOK_APP_SECRET="[facebook app secret]"
export GOOGLE_CLIENT_ID="[google client id]"
export GOOGLE_CLIENT_SECRET="[google client secret]"
export LINKEDIN_API_KEY="[lindedin api key]"
export LINKEDIN_SECRET_KEY="[linkedin secret key]"
export GITHUB_CLIENT_ID="[github client id]"
export GITHUB_CLIENT_SECRET="[github client secret]"
export TWILIO_ACCOUNT_SID="[twilio account sid]"
export TWILIO_AUTH_TOKEN="[twilio auth token]"
export EXPRESS_SESSION_KEY="[express session key]"
export PORT=3001
```

### launch the application
```
npm start
```

open browse in http://localhost:3001
