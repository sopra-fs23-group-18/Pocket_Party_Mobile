# Pocket Party Mobile

## Setup your development environement 

Follow the instructions form the React Native Documentation closely:
- [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

## Install dependencies

In the root folder run following command:

```bash
npm install
```

**On ios only** (Make sure to close the project in XCode)
```bash
cd ios && pod install
```

## Start metro
For starting the metro server run following command: 
```bash
npm start
```

## Building and installing app on device
Now it's time to start the simulator/ emulator or connect a real device via usb to your computer.
Make sure if you use a real device, that developer mode has been activated on the smartphone and the phone is connected to the machine in debug mode

**For Android** run 

```bash
npx react-native run-android
```
**For iOS** run 

```bash
npx react-native run-ios
```

## Connecting to backend
In order to get a connection to the backend server which runs locally on your host machine do the following steps according to your deployment target

### Android Emulator

Change the `devUrl` in the `util/getDomain.ts` file to following:

```typescript
const devUrl = "ws://10.0.2.2:8080"
```

### Android real device
Eiter change the `devUrl` in the `util/getDomain.ts` file to following if your in the same network:

```typescript
const devUrl = "ws://{ip of your machine}:8080"
```
Or eable port forwarding. For that chrome or chromium must be installed and your phone has to be connected via cable:
- Open Chrome / Chromium
- Type `chrome://inspect` in the url tab
- Check the box with label `discover usb devices`
- Click on button `Port forwarding` to go to the port forwardign settings
- Make sure following entry exists:
    - Port `8080`
    - Ip address and Port `localhost:8080`
- Check the box with the label `Enable port forwarding`
- Go to the browser on the smartphone and open the link `http://localhost:8080` if it states application running your ready to go
- else enable port forwarding through the cable by running following command
```bash
adb reverse tcp:8080 tcp:8080
```

### iOS simulator

Nothing to do you're ready to go.

### iOS device 

Change the `devUrl` in the `util/getDomain.ts` file to following:

```typescript
const devUrl = "ws://{your local hostname}.local:8080"
```

## Installing the release 

Currently we only can provide releases for android due to a non existing money flow for an paid apple developer account, which would be needed to distribute apps to the iOS platform.

- For android install the signed apk from the github release tab and install it on the device.