# OSDMemo
Web-based memo app

## Key Feature
- Memo Create / Read / Update / Delete
- Search memo 
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
3. Run `npm rebuild --runtime=electron --target=1.4.3 --disturl=https://atom.io/download/atom-shell --build-from-source` in order to run LevelDB properly
4. run `./node_modules/.bin/electron .`

## Packages
- Bundles Package for macOS. See 'releases' tab.
