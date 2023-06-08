# Activator Fusion Shared

This is the official Vault shared resource supplied for Activator. 

## Installation
To build the shared you need NodeJS >= 10.0.0 and NPM >= 9.6.0 to be installed on our machine
```bash
npm run i
```

## Commands

`npm run prod` - creates production build, adds it to a ZIP archive
and puts it into the `/exports` folder

`npm run postbuild` - creates a file with SHA-1 checksums of the ore fusion files
 and places it within the `/dist` folder. This file is used on automatic shared update.
 To configure the script update the file `shared/src/fusion/builder/files-check-list.json`.
 The file contains the list of core fusion files. It can be a separate file or the whole
 directory with all its subdirectories.

`npm run start` - launches the "slide" type of the shared on `http://localhost:5001`. 
 Note: if you want your shared script to use the editor script from localhost, 
 please change the `isDevMode` field of the `/src/config.json` to `true`. 
 
`npm run start:email` - launches the "email" type of the shared on `http://localhost:5001`.
Note: if you want your shared script to use the editor script from localhost,
please change the `isDevMode` field of the `/src/config.json` to `true`

To use this shared in your document please replace your shared script with the local one.

  ```html
  <script src="http://localhost:5001/main.js"></script>
 ```
 
The script to be replaced:

on a slide
 ```html
<script src="../shared/src/getbundle.js"></script>
```
on an email
  ```html
 <script src="https://cdn.activator.cloud/fusion-email/1.9.6/dist/main.js"></script>
 ```

## Setup

```json
{
  "ie": true,
  "type": "slide",
  "excludedComponents": {
    "fusion": {
      "slide": ["fusion-chart"],
      "brief": [],
      "email": []
    },
    "customComponents": {
      "slide": ["product-logo"],
      "brief": [],
      "email": []
    }
  }
}
```
- @param {boolean} ie - should build for ie or not. Possible values true/false
- @param {string} type - setup type of build, Possible values "slide", "email", "all", "brief"
- @param {object<string>} excludedComponents - next component will be excluded from build. Client can't work with it.
- @param {object<string>} excludedComponents.(fusion|customComponents) - Area that will be excluded.

The parameter `type` can be overriden by specifying the `process.env.FUSION_BUILD_TYPE` variable

## Fusion Config
- @property {boolean} isDevMode - default `false` if set to `true` editor script from localhost will be injected
- @property {string} [editor] - non required property. Specify the version of the editor to be loaded,
if you want a version different from the one specified in the package.json.
- @property {object} targetResolutions - required property from 1.10.x. Specify what resolution Activator should support.
## Roadmap
ReadMe added from v.1.9.0.
Please use `migration-guide.md` for update to next versions.

## Contributing
Pull requests are welcome from `detailer team`. 
For major changes, improvements, please open an issue first to discuss what you would like to change [trello board](https://trello.com/b/WmTUqOOJ/activator-issues)


## License
[MIT](https://choosealicense.com/licenses/mit/)

## Project structure
Since the project consists of the files, which will be modified by the client below is the project structure
with the notes whether the particular file can be modified or will be replaced by further shared updates:

| Path | Comment |
| ---- | ------- |
| `assets/**/*` | leave clients |
| `dist` | should be rebuilt after shared resource was updated |
| `fragmemts/**/*` | leave clients |
| `layouts/**/*` | leave clients |
| `lib/@webcomponents/webcomponentsjs/webcomponents-loader.js` | replace by newest |
| `lib/package.js` | replace by newest |
| `src/actions/*` | leave clients |
| `src/components/**/*` | leave clients |
| `src/vendor/*` | leave clients |
| `src/data/*` | leave clients |
| `src/reducers/*` | leave clients |
| `src/styles/*` | leave clients |
| `src/config.json` | update only version by newest |
| `getbundle.js` | replace by newest |
| `getpolyfills.js` | replace by newest |
| `src/main.js` | leave clients |
| `src/main.css` | leave clients |
| `src/store,js` | leave clients |
| `src/fusion/**/*` | replace by newest |
| `.eslintignore` | replace by newest |
| `.eslintrc.js` | replace by newest |
| `fusion.json` | leave clients |
| `MIGRATION GUIDE.md` | replace by newest |
| `package.json` | go deeply throw each key and make Object.assign(clientPackageJson, fusionPackageJson) |
| `package-lock.json` | leave clients |
| `postcss.config.js` | leave clients |
| `README.md` | replace by newest |
| `thumb.png` | leave clients |
| `webpack.config.js` | leave clients |

## Shared upgrade
There are four groups of files, which we should handle differently on shared update.
- files, which should be left to the client (e.g. shared/fusion.json, custom components etc.)
 => we just don't do anything with them;
- files, which should be replaced by the latest, as they are core fusion files
 (e.g. lib/package.js, fusion components etc.)
  => we check if the client haven't modified them and replace them with or without a warning;
- files, which were added and were missing in the previous version
(e.g. lib/ui/getbundle.js, shared/src/fusion/builder/checksums-generator.js) 
=> we shouldn't check them, but we should add them;
- files, which were removed in the latest version (e.g. shared/lib/@webcomponents/shadycss) 
=> we don't need to check them, but we should just remove them.
	
As the solution for the third problem we "enhance" the [json with files list](./src/fusion/builder/files-check-list.json), 
adding four sections:

Here is an example json file.	 
```json
{
  "ignored": [
    "*.html",
    "src/fusion/builder/*"
  ],
  "changed": [
    "src/fusion"
  ],
  "removed": [
    "lib/@webcomponents/shadycss"
  ],
  "added": [
    "lib/ui"
  ],
  "moved": [
    {
      "from": "src/fusion/static/analytics.json",
      "to": "src/data/analytics.json"
    }
  ]
}
```
Updating the shared we will go to this json and do the following: 
- "changed" => check and replace
- "ignored" => ignore files or file patterns from checksum generation
  (for now only whole paths, wildcards at the start OR the end can work)
- "removed" => remove
- "added" => add
- "moved" => change destination 

## Working with Vault documents

### Editing of the document
While editing the document in the Activator the toast messages appear notifying the user about 
the successful save requests. They appear after e.g. you add, remove or deselect an element. No requests 
are sent after the user changes something in an input (e.g. width) on the sidebar, because the element is saved
after you deselect it. 
 
 Please note if at some point you don't see any new toast messages in the above mentioned situations it may be 
a sign of a broken and hence a non-editable slide. try to reload the page, if after new save requests 
you still don't see any new messages, please contact us. This may happen because of the editor / shared resources 
versions mismatch or because of a broken HTML of the document.

### Direct editing of document's HTML
In some cases (like copying a part of a document, fixing HTML errors, replacing a script's source), 
user might edit the HTML of the document directly (e.g. via the `/source` page or in some code editor).
Currently, Activator is supporting direct HTML editing on the `/source` page. 
To go there replace the `/preview?...` part of the URL on the document page with `/source`. 
E.g. if you are on the page 
```
https://activator.cloud/document/51016/0/1/preview?mode=preview
```
 
go to 
```
https://activator.cloud/document/51016/0/1/source
```

Editable content of the document is placed inside the `<article>` tags on slides 
and inside the `<mj-body>` tag on the emails. The rest of the HTML markup 
should be edited with caution, since it may break the whole document.
You may add, remove or change components' HTML but please follow the rules:
- each component must have a **unique ID**
- you may add any other attributes or class names not declared for the particular component
- there are special components with `items` attribute, which generates their children 
(e.g. list, tab-group etc.). If you add or remove their children you must update the `items` attribute, 
so they are in sync. Please note, that in case of tab-group tab-group-button and tab-group-container 
are considered as 1 single item, so you need to add or remove them together. The tab-group-container 
has a special attribute `data-tab-id`, which points to its tab-group-button

# Content Scale
As of release 1.10.2, all slides must use the `iOS Resolution: Device For Default` 
setting in the `CLM properties` to properly scale the content.
