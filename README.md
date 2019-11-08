# Get a DM in Slack when mentioned in a Jira Comment!

## What is this App?
Read about how Group Nine created an application that sends us direct messages in Slack when we get mentioned in Jira comments: https://medium.com/group-nine-media-product-team/slack-notifications-for-jira-comments-1d57879bc149

## Setup Instructions
[![Step-by-Step video](https://img.youtube.com/vi/5X4-3rkkffo/0.jpg)](https://www.youtube.com/watch?v=5X4-3rkkffo)  
*step by step video on YouTube*

To setup this application you'll need:
- A Heroku account
- Admin access to your Slack instance
- Admin access to your Jira instance (this setup assumes you're using Jira Cloud)

1. **Setup a Slack application**
  - Go to https://api.slack.com/apps and click "Create New App"
  - Provide an Application Name ("Jira Comment Bot" seems to work well), and choose your Slack workspace from the dropdown
  - Click "Bot Users" in the "Features" section of the left-side navigation and then click "Add a Bot User"
  - Give your bot a display name and default user name and click "Add Bot User"
  - Go to "OAuth & Permissions" in the "Features section of the left-side navigation" and click "Install App to Workspace" (click Authorize on the confirmation screen)
  - Take note of the OAuth Access Token and Bot User OAuth Access Token, we'll need this later
2. **Create a Private / Public RSA Keypair for the Jira Application**
  - To create the key pair, open your terminal and type ```openssl genrsa -out privkey.pem 2048```
  - To extract the public key, type the following into your terminal ```openssl rsa -pubout -in privkey.pem -out pubkey.pem```
  - Open privkey.pem in your favorite text editor (privkey.pem should have been generated by the previous steps)
  - Go to https://www.base64encode.org/ and paste the contents of privkey.pem into the top section and click "Encode"
  - Take note of the base64 encoded string that was generated in the bottom section
3. **Setup the app on Heroku**
  - Create an account on Heroku: https://signup.heroku.com/ (a free solution for hosting applications)
  - Click this deploy button to deploy this app to Heroku 👉 [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/zivtech/jira-comment-slack-notification/tree/master)
  - When asked to enter values for environment variables, do the following...

    - APP_URL = the URL of this heroku application ("https://WHATEVER-YOU-NAMED-THIS.herokuapp.com/") the trailing slash is important  
    - JIRA_URL = the URL of your Jira application ("https://YOUR-JIRA-SUBDOMAIN.atlassian.net") the lack of a trailing slash is important  
    - RSA_PRIVATE_KEY = the base64 encoded string from step 2  
    - SLACKBOT_TOKEN = the Bot User OAuth Access Token from step 1
    - SLACKBOT_OAUTH_TOKEN = the OAuth Access Token from step 1
4. **Setup a Jira Application Link**
  - Go to https://YOUR-JIRA-SUBDOMAIN.atlassian.net/plugins/servlet/applinks/listApplicationLinks
  - Enter the URL of your heroku app and click "Create New Link" (if you get a "no response" error, just click Continue)
    
    - Application Name = whatever you'd like, or just use "Jira Comments in Slack"  
    - Application Type = Generic Application  
    - Service Provider Name = whatever you'd like  
    - Consumer Key = "neptune-the-dodle"  
    - Shared Secret = base64 encoded privatekey from step 2 
    - Request Token URL, Access Token URL, and Authorize URL = https://YOUR-HEROKU-APP-NAME.herokuapp.com/auth/atlassian-oauth  
    - Click "Continue"  
  - Click the Edit button next to your newly created apllication link in the list  
  - Go to the Incoming Authentication section in the modal  
    - Consumer Key = "neptune-the-dodle"  
    - Consumer Name =  whatever you'd like users to see when they auth with Jira ("Jira Comment Bot" could work)  
    - Description = optional description of what this app does  
    - Public Key = copy and paste the contents of pubkey.pem from step 2
    - Consumer Callback URL = https://YOUR-HEROKU-APP-NAME.herokuapp.com/auth/atlassian-oauth/callback/
5. **Setup Jira Webhook for Comments**
  - Go to https://YOUR-JIRA-SUBDOMAIN.atlassian.net/plugins/servlet/webhooks
  - Click "Create a Webhook"
    - Name = whatever you want ("Jira Comment Bot" could work)
    - Status = enabled
    - URL = https://YOUR-HEROKU-APP-NAME.herokuapp.com/comment-created
    - Check off "created" in the Comment section
    - Scroll down and click "Create"
6. **Add Features to Slack App**
  - Go back the Slack Application that you setup in step 1 (https://api.slack.com/apps, select your app from the list) and go to "Interactive Components" on the left-side navigation
    - Enter "https://YOUR-HEROKU-APP-NAME.herokuapp.com/response-from-slack" in the "Request URL" field & save
  - Go to "Event Subscriptions" in the "Request URL" field enter, https://YOUR-HEROKU-APP-NAME.herokuapp.com/msg-wake-up
    - Subscribe to the message.im event in the "Subscribe to Workspace Events" section
7. **Sign Up**
  - Sign up by messaging the bot you created with the word "signup" -- click the link that the bot responds with to Auth with Jira
8. **Usage**
  - @mention your username in a Jira comment to get a message in Slack
  
## Development
- When working locally, create a .env file in your local environment with the same Key=Value pairs that were used in Step 3 separated by new lines. Example: JIRA_URL='https://YOUR-URL.atlassian.net'  
- Start up Mongo with ```mongod``` in your terminal
- Install the heroku CLI to start your development environment with ```heroku local web```
