# OSDMemo
Web-based memo app, supports encryption

## Key Feature
- Memo Create / Read / Update / Delete
- Search memo 
- Encrypt Memo / Save encryption key to keychain
- Supports Markdown syntax
- Save location where memo have been written

## Modules
1. Backend
  - Node.js + Koa.js
2. Frontend
  - React.js
  - Axios
3. Database
  - MongoDB (without electron)
  - LevelDB (with electron)
4. Design
  - Material Design by Google
## Installation
### Prequisites
- Node.js 
1. Clone repo via `git clone https://github.com/thy2134/OSDMemo.git && cd OSDMemo`
2. Run `npm install`
3. Run `./node_modules/.bin/electron-rebuild --version=1.4.3` in order to run LevelDB properly
4. run `./node_modules/.bin/electron .`
