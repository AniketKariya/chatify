![chatify](https://raw.githubusercontent.com/AniketKariya/chatify/master/public/Logo.png "Chatify Logo")
#### Demo: [project-chatify](http://project-chatify.herokuapp.com/)
---
#### NOTE:
>The demo might not run as expected, as SSL certificate is not supplied. Location and video conferencing might fail. Latest browsers block GPS, 
 Video and Audio sensors for privacy reasons. To fix this, go to ```chrome://flags/#unsafely-treat-insecure-origin-as-secure``` if you're using chrome, or go to ```edge://flags/#unsafely-treat-insecure-origin-as-secure``` in case of Edge Chromium; and add project-chatify.herokuapp.com in the textbox and restart the browser.

----

### features:
* Global chat
* Create/join Personal rooms (under-development)
* Live Radios! (This wasn't in the list of functionalities to be implemented, but added it anyways)
* right-click on the message and click translate to translate message from any other language into English.
* Real-time communication (obviously, but the message history isn't saved. work in progress)
* Video Conferencing through WebRTC (still wondering to optimize even though it was the pain and most time-consuming)

### sending location
It's as accurate as your GPS let's it to be. It may not work in case if you have poor internet connection as timeout is 5 seconds. The resources are pretty scarce. Again, make sure to add site to treat-insecure-origin-as-secure if permissions are blocked.

### Contacts Integration failure: 
Google contact/people API Integration failed as accessing contacts and other personal details require to follow certain security criteria, one of that being with SSL certificate, and others with top level domain registries and other things. It requires to submit the application for a review and takes upto 4-6 weeks as mentioned on Google API console. So, had to omit contacts feature, as no other API was available.

### Speak-to-text is revoked from production build
Due to very-low accuracy rate. Will add it once find efficient method to get it done.

### profile & media sharing
profile backend is ready, front-end part is to be developed yet. media sharing will be implemented once I find the way to store it, as heroku server, unfortunately doesn't provide file storage for files other than websites.

---

**Documentation and API reference, though not required, will be updated soon.**

### Running on your local machine
```
git clone git@github.com:AniketKariya/chatify.git
cd chatify
npm install
```

make a folder named ```config``` and add a file consisting API keys. or replace environment variables with your API keys. (insecure)

to run development build
```npm run dev```
or production build
```npm run start```
