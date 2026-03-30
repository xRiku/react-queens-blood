# Local network setup

Use this when you want to play from two different devices on the same LAN.

## 1) Start the app

From the repo root:

```sh
npm install
npm run dev
```

Default ports:

- Web client: `5173`
- Server: `4000`

## 2) Allow LAN access to the web app

Expose the web app port (`5173`) on the machine running the project.

Then open this URL on the second device:

`http://<HOST_MACHINE_IP>:5173`

## 3) Find your host machine IP

Linux:

```sh
ifconfig | grep 192.168
```

<img src="../.github/linux_ip.png">

Windows:

```sh
ipconfig
```

Use the `IPv4 Address` value.

<img src="../.github/windows_ip.png">

## 4) Create and join room

- Device A: create room and share 6-digit code
- Device B: join using code and player name
- Both players confirm in ready room to start
