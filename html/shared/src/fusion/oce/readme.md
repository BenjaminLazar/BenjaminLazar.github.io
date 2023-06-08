#OCE surveys
For work with surveys need to create survey on OCE salesforce side, activate it and create invitation for survey.
Then need to get survey name and fill `surveyDeveloperName` value in `shared/src/config.json` file:
`  "oce": {
     "surveyDeveloperName": "your surevey developerName"
   }`
For updating survey need to use events and pass object, for example:
`const obj = {
       page: 'Question 1',
       answer: 'red',
       isSelected: true
 }
 document.dispatchEvent(new CustomEvent('updateSurvey', {
   detail: obj
 }));`
In the example above `Question 1` is survey page name from salesforce, `red` is answer value (one of the variants configured in salesforce), `isSelected` - flag to identify if user select or deselect answer.


#OCE navigation.
Support both navigation types (using slide document id or slide name)
Navigation by slide name is default, for case navigation by slide document id we have config file: `oce.navigation-config.json`.
This file will be filled automatically during export presentation zip from blackburn (for mono-sequence and multi-sequence OCE structure)
It will have next structure (example):
`{
  "navigationMap": {
    "1000": "test-slide",
    "1001": "test-slide-1"
  }
}`
For each presentation slide will be created key and value where key is slide document id and value is slide name.
As OCE allows navigation using file names - this file will allow to find corresponding slide name in case receiving document id as input for navigation.
