import { oceStorage } from './oce.storage';
import config from '../../config.json';

const { oce } = config;

/**
 * @typedef {Object} OceSurveyObj
 * @property {Array} choices
 * @property {String} fullName
 * @property {String} label
 * @property {Array} screens
 * @property {Array} decisions
 * @property {String} startElementReference
 */

/**
 * class OceSurveyManager - service for working with OCE surveys.
 * Allows to get survey, update it and save back in OCE
 */
export class OceSurveyManager {
  static initSurvey() {
    if (this.isSurveyMissed()) {
      this.getSurveyFlowJson();
    } else {
      // window storage to avoid missing answer on current slide
      window.survey = this.getStoredSurvey();
    }
  }

  /**
   * @description function is used for saving survey.
   */
  static surveyFlowJsonForCallHandler() {
    window.CLMPlayer.getSurveyFlowJsonForCall(window.survey);
  }

  static isSurveyMissed() {
    return !oceStorage.getOCEStateData().surveyJson;
  }

  /**
   * @param {OceSurveyObj} flowjson
   */
  static surveyFlowJsonHandler(flowjson) {
    // here we received survey
    window.survey = flowjson;
  }

  static updateStoredSurvey() {
    oceStorage.updateState('surveyJson', JSON.stringify(window.survey));
  }

  /**
   * @description function is used to retrieve the survey’s JSON from the server, this action triggers OCE event 'surveyflowjsonloaded'.
   */
  static getSurveyFlowJson() {
    window.CLMPlayer.getSurveyFlowJson({ developerName: oce.surveyDeveloperName });
  }

  static getStoredSurvey() {
    const { surveyJson } = oceStorage.getOCEStateData();
    return typeof surveyJson === 'string' ? JSON.parse(surveyJson) : surveyJson;
  }

  static getChoicesByPage(page) {
    const screen = window.survey.screens.find(({ label }) => label === page);
    return screen.fields.reduce((acc, field) => [...acc, ...field.choiceReferences], []);
  }

  static getSurveyAnswer(answerText, page) {
    const choicesByPage = this.getChoicesByPage(page);
    const choicesMatchName = window.survey.choices.filter(({ value }) => value.stringValue.trim() === answerText);
    return choicesMatchName.find(({ name }) => choicesByPage.includes(name));
  }

  static getSurveyQuestion(answerId) {
    let targetQuestion;
    window.survey.screens.forEach(({ fields }) => {
      fields.forEach((field) => {
        const { choiceReferences } = field;
        if (choiceReferences && choiceReferences.includes(answerId)) {
          targetQuestion = field;
        }
      });
    });
    return targetQuestion;
  }

  static updateQuestionAnswer(answerId, isSelected) {
    const question = this.getSurveyQuestion(answerId);
    if (question) {
      let { answer } = question;
      if (answer) {
        if (answer.includes(answerId) && !isSelected) {
          answer = answer.split(';').filter((item) => item !== answerId).join(';');
        } else if (!answer.includes(answerId)) {
          answer = `${answer};${answerId}`;
        }
      } else {
        answer = answerId;
      }
      question.answer = answer;
    }
    return window.survey;
  }

  /**
   * Update global survey object.
   * @param {Object} obj - Survey answer object
   * @param {String} obj.answer - Survey answer text
   * @param {String} obj.page - Survey page name
   * @param {Boolean} obj.isSelected - Is survey answer checked
   */

  static updateSurvey(obj) {
    const { answer, page, isSelected } = obj;
    const convertedAnswer = answer.replace(/\n/g, ' ').trim();
    if (window.survey) {
      const { name } = this.getSurveyAnswer(convertedAnswer, page);
      this.updateQuestionAnswer(name, isSelected);
      this.updateStoredSurvey();
    }
  }
}
