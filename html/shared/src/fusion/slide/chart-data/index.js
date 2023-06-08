import { html, css, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionApi } from '../../api';
import {
  applyMixins,
  ModeTrackable,
  SlideComponentBase,
} from '../../mixins';

class FusionChartData extends applyMixins(FusionBase, [
  ModeTrackable,
  SlideComponentBase,
]) {
  static get properties() {
    return {
      legend: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'chartData',
        value: 'Placebo',
        prop: true,
      },
      values: {
        type: String,
        fieldType: 'String',
        propertyGroup: 'chartData',
        value: '0.085,0.18,0.145,0.2,0.23,0.22,0.21,0.2,0.2,0.185',
        prop: true,
      },
      type: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'chartData',
        value: 'bar',
        prop: true,
        selectOptions: [
          'area',
          'area-spline',
          'area-step',
          'bar',
          'donut',
          'gauge',
          'line',
          'pie',
          'scatter',
          'spline',
          'step',
        ],
      },
      'chart-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'chartData',
        value: 'rgba(0, 86, 250, 1)',
      },
      groups: {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chartData',
        value: false,
        prop: true,
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-chart-data',
      componentUIName: 'Chart Data',
      componentCategory: 'data',
      componentDescription: 'Provides chart component with configurable data values',
      isRootNested: false,
      nestedComponents: [],
      resizable: false,
      draggable: false,
      rotatable: false,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.connectedActions();
  }

  connectedActions() {
    if (!this.hasAttribute('chart-data-id')) {
      this.setAttribute('chart-data-id', FusionApi.generateId());
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.emitCustomEvent('remove');
  }

  update(changedProps) {
    super.update(changedProps);
    this.emitCustomEvent('update');
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 30px;
          z-index: 2;
        }
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}):before {
          content: '';
          position: absolute;
          width: 30px;
          height: 100%;
          left: 50%;
          background: var(--chart-color);
          transform: translateX(-50%);
        }
      `,
    ];
  }

  render() {
    super.render();
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionChartData };
