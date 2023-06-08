import { html, css } from 'lit-element';
import { generate } from 'c3';
import { formatDefaultLocale, format } from 'd3-format';
import { FusionBase } from '../../base';
import {
  compileObjectFromContext,
  mergeObj,
  getValueObject,
  debounce, intersectMap,
} from '../../utils';
import { FusionApi } from '../../api';
import {
  applyMixins,
  SlideComponentBase,
} from '../../mixins';
import {
  Typography,
  Container,
  Dimensions,
  FieldDefinition,
} from '../../mixins/props';

const predefinedContext = require.context('d3-format/locale', true, /\.json$/);
const customContext = require.context('./locale', true, /\.json$/);
const predefinedLocales = compileObjectFromContext(predefinedContext);
const customLocales = compileObjectFromContext(customContext);
const locales = { ...predefinedLocales, ...customLocales };

class FusionChart extends applyMixins(FusionBase, [
  SlideComponentBase,
  Typography,
  Container,
  Dimensions,
  FieldDefinition,
]) {
  static get properties() {
    const {
      position,
      top,
      left,
      width,
      height,
      'font-family': fontFamily,
      'font-weight': fontWeight,
    } = super.properties;
    const localeNames = Object.keys(locales);
    return {
      position,
      top,
      left,
      width: {
        ...width,
        value: '800px',
        min: '400',
        availableUnits: [],
      },
      height: {
        ...height,
        value: '400px',
        min: '200',
        availableUnits: [],
      },
      locale: {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'chart',
        value: 'en-GB',
        selectOptions: localeNames,
      },
      'font-family': fontFamily,
      'show-labels': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chart',
        value: false,
        prop: true,
      },
      'labels-position': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'chart',
        value: 'outer',
        prop: true,
        selectOptions: [
          'outer',
          'inner',
        ],
      },
      'labels-inner-indent': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '0px',
      },
      'labels-font-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '10px',
      },
      'labels-font-weight': {
        ...fontWeight,
        propertyGroup: 'chart',
      },
      'labels-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'chart',
        value: 'rgba(0, 0, 0, 1)',
      },
      'show-legend': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chart',
        value: true,
        prop: true,
      },
      'legend-position': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'chart',
        value: 'inset',
        prop: true,
        selectOptions: [
          'bottom',
          'right',
          'inset',
        ],
      },
      'show-tooltip': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chart',
        value: true,
        prop: true,
      },
      'grouped-tooltip': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chart',
        value: true,
        prop: true,
      },
      'x-axis-type': {
        type: String,
        fieldType: 'Select',
        value: 'category',
        propertyGroup: 'chart',
        prop: true,
        selectOptions: [
          'category',
          'indexed',
        ],
      },
      'x-axis-tick-rotate': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '0px',
        prop: true,
      },
      'x-axis-tick-height': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '0px',
        prop: true,
      },
      'x-axis-font-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '10px',
      },
      'x-axis-font-weight': {
        ...fontWeight,
        propertyGroup: 'chart',
      },
      'x-axis-label-text': {
        type: String,
        fieldType: 'String',
        propertyGroup: 'chart',
        value: '',
        prop: true,
      },
      'x-axis-label-position': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'chart',
        value: 'outer-center',
        prop: true,
        selectOptions: [
          'inner-right',
          'inner-center',
          'inner-left',
          'outer-right',
          'outer-center',
          'outer-left',
        ],
      },
      'x-axis-label-font-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '10px',
      },
      'x-axis-label-font-weight': {
        fontWeight,
        propertyGroup: 'chart',
      },
      'x-axis-label-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'chart',
        value: 'rgba(0, 0, 0, 1)',
      },
      'y-axis-font-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '10px',
      },
      'y-axis-font-weight': {
        ...fontWeight,
        propertyGroup: 'chart',
      },
      'y-axis-label-text': {
        type: String,
        fieldType: 'String',
        propertyGroup: 'chart',
        value: '',
        prop: true,
      },
      'y-axis-label-position': {
        type: String,
        fieldType: 'Select',
        propertyGroup: 'chart',
        value: 'outer-middle',
        prop: true,
        selectOptions: [
          'inner-top',
          'inner-middle',
          'inner-bottom',
          'outer-top',
          'outer-middle',
          'outer-bottom',
        ],
      },
      'y-axis-label-font-size': {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'chart',
        value: '10px',
      },
      'y-axis-label-font-weight': {
        ...fontWeight,
        propertyGroup: 'chart',
      },
      'y-axis-label-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'chart',
        value: 'rgba(0, 0, 0, 1)',
      },
      'axis-rotate': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chart',
        value: false,
        prop: true,
      },
      'show-grid': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chart',
        value: false,
        prop: true,
      },
      'show-line-point': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'chart',
        value: false,
        prop: true,
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-chart',
      componentUIName: 'Chart',
      componentCategory: 'data',
      componentDescription: 'Fully configurable chart accepting any number of data series',
      nestedComponents: ['fusion-chart-data'],
    };
  }

  constructor() {
    super();
    this.series = [];
    this.drawChartBinded = this.drawChart.bind(this);
    this.updaterBinded = this.updateData.bind(this);
    this.removerBinded = this.removeData.bind(this);
    this.propsChange(this.setStaticPropsValues);
  }

  setStaticPropsValues(key, item) {
    if (item.prop) {
      this[key] = this.getAttribute(key);
    }
  }

  disconnectedCallback() {
    this.chart.destroy();
    this.shadowRoot.querySelector('slot:not([name])').removeEventListener('slotchange', this.drawChartBinded);
    this.querySelectorAll('fusion-chart-data').forEach((el) => el.removeEventListener('update', this.updaterBinded));
    this.querySelectorAll('fusion-chart-data').forEach((el) => el.removeEventListener('remove', this.removerBinded));
    this.chart.element.remove();
    super.disconnectedCallback();
  }

  revertAxis() {
    const tmp = this.chartOptions.axis.x.label.position;
    this.chartOptions.axis.x.label.position = this.chartOptions.axis.y.label.position;
    this.chartOptions.axis.y.label.position = tmp;
  }

  updateProps() {
    const currentProps = this.getPropsOptions();
    this.chartOptions = mergeObj(this.chartOptions, currentProps);
    if (this.chartOptions.axis.rotated) this.revertAxis();
    debounce(this.generateChart());
  }

  update(changedProps) {
    super.update(changedProps);
    if (changedProps.has('locale')) {
      const d3GroupSeparator = ',';
      formatDefaultLocale(locales[this.locale]);
      this.localeFormat = format(d3GroupSeparator);
    }
    if (this.chartOptions) {
      this.updateProps();
    }
  }

  checkSizes(changedProps) {
    const properties = intersectMap(changedProps, this.constructor.sizeTriggers);
    Array.from(properties.keys()).forEach((prop) => {
      const { num, unit } = getValueObject(this[prop]);
      const value = Math.max(num, this.constructor.properties[prop].min);
      this.setElementProp(prop, `${value}${unit}`);
      this.setAttribute(prop, `${value}${unit}`);
    });
    this.chartResize();
  }

  chartResize() {
    if (this.chart) {
      this.chart.resize();
      this.chart.internal.selectChart.style('max-height', 'none');
    }
  }

  static changeChartDataId(chartDataEl) {
    const chartDataId = FusionApi.generateId();
    chartDataEl.setAttribute('chart-data-id', chartDataId);
    FusionApi.saveAttributes(`#${chartDataEl.id}`, { ['chart-data-id']: chartDataId }, true);
    return chartDataId;
  }

  static checkChartDataIdDuplication(list) {
    list.reduce((ids, next) => {
      let id = next.getAttribute('chart-data-id');
      if (ids.includes(id)) {
        id = this.changeChartDataId(next);
      }
      ids.push(id);
      return ids;
    }, []);
    return list;
  }

  getChartDataList() {
    const list = [...this.querySelectorAll('fusion-chart-data')];
    return this.constructor.checkChartDataIdDuplication(list);
  }

  getSeriesIdList() {
    return this.series.map((s) => s.id);
  }

  drawChart() {
    this.chartDataList = this.mutateChartData();
    this.drawChartData();
  }

  mutateChartData() {
    const seriesIdList = this.getSeriesIdList();
    const chartDataList = this.getChartDataList();
    if (chartDataList.length > seriesIdList.length) {
      this.addItemToSerie([...chartDataList], seriesIdList);
    }
    return chartDataList;
  }

  addItemToSerie(chartDataList, seriesIdList) {
    const item = chartDataList.shift();
    if (item && !seriesIdList.includes(item.getAttribute('chart-data-id'))) {
      item.addEventListener('update', this.updaterBinded);
      item.addEventListener('remove', this.removerBinded);
      this.series.push(this.constructor.createSerie(item));
    }
    if (chartDataList.length > 0) this.addItemToSerie(chartDataList, seriesIdList);
  }

  updateData({ target }) {
    const index = this.getIndex(target.getAttribute('chart-data-id'));
    const newSerie = this.constructor.createSerie(this.chartDataList[index]);
    this.series.splice(index, 1, newSerie);
    this.drawChartData();
  }

  async removeData({ target }) {
    const index = this.getIndex(target.getAttribute('chart-data-id'));
    this.series.splice(index, 1);
    target.removeEventListener('update', this.updaterBinded);
    target.removeEventListener('remove', this.removerBinded);
    await this.updateComplete;
    this.generateChart();
  }

  getIndex(id) {
    return this.series.findIndex((i) => i.id === id);
  }

  static createSerie(el) {
    const id = el.getAttribute('chart-data-id');
    const legend = el.hasAttribute('legend') ? el.getAttribute('legend') : id;
    const values = el.hasAttribute('values') ? el.getAttribute('values').split(',').map((i) => Number(i)) : [];
    const color = el.getAttribute('chart-color');
    const type = el.getAttribute('type');
    const groups = el.getAttribute('groups') || false;
    return {
      id, legend, color, values, type, groups,
    };
  }

  drawChartData() {
    const {
      columns, colors, types, names, groups,
    } = this.gatheringData();
    this.chartOptions.data = {
      ...this.chartOptions.data, columns, colors, types, names, groups,
    };
    this.updateChart(this.chartOptions.data);
  }

  gatheringData() {
    const res = {
      types: {},
      colors: {},
      names: {},
    };
    const grouped = [];

    const columns = this.series.map((item) => {
      this.constructor.groupingData(item, grouped);
      res.types = this.constructor.dataAssign(res.types, item, 'type');
      res.colors = this.constructor.dataAssign(res.colors, item, 'color');
      res.names = this.constructor.dataAssign(res.names, item, 'legend');
      return [item.id, ...item.values];
    });
    return { ...res, ...{ columns, groups: [grouped] } };
  }

  updateChart(data) {
    this.chart.unload({
      done: () => {
        this.chart.load(data);
        this.chart.groups(data.groups);
      },
    });
  }

  static groupingData(item, grouped) {
    if (item.groups) {
      grouped.push(item.id);
    }
  }

  static dataAssign(data, item, prop) {
    return { ...data, [item.id]: item[prop] };
  }

  initChartOptions() {
    const graphOpt = this.getGraphOptions();
    const propsOpt = this.getPropsOptions();
    return mergeObj(propsOpt, graphOpt);
  }

  getGraphOptions() {
    const { shadowRoot, updateLabelsByPosition, id } = this;
    const updateLabelsBound = updateLabelsByPosition.bind(this);
    const el = shadowRoot.getElementById('chart');
    return {
      bindto: el,
      data: {
        columns: [],
        groups: [],
      },
      onresized() {
        this.selectChart.style('max-height', 'none');
      },
      onrendered() {
        const labels = this.main.selectAll(`.${this.CLASS.texts} .${this.CLASS.text}`);
        if (labels.data().length) {
          labels.classed(`custom-labels-${id}`, true);
          updateLabelsBound();
        }
      },
    };
  }

  getPropsOptions() {
    return {
      size: {
        height: getValueObject(this.height).num,
        width: getValueObject(this.width).num,
      },
      data: {
        labels: {
          format: this.localeFormat,
        },
      },
      legend: {
        show: this['show-legend'],
        position: this['legend-position'],
      },
      tooltip: {
        show: this['show-tooltip'],
        grouped: this['grouped-tooltip'],
        order: 'desc',
        format: this.localeFormat,
      },
      axis: {
        rotated: this['axis-rotate'],
        x: {
          label: {
            text: this['x-axis-label-text'],
            position: this['x-axis-label-position'],
          },
          type: this['x-axis-type'],
          tick: {
            rotate: getValueObject(this['x-axis-tick-rotate']).num,
            format: this.localeFormat,
          },
          height: getValueObject(this['x-axis-tick-height']).num,
        },
        y: {
          label: {
            text: this['y-axis-label-text'],
            position: this['y-axis-label-position'],
          },
          tick: {
            format: this.localeFormat,
          },
        },
      },
      grid: {
        y: {
          show: this['show-grid'],
        },
        x: {
          show: this['show-grid'],
        },
      },
      point: {
        show: this['show-line-point'],
      },
    };
  }

  generateChart() {
    this.chart = generate(this.chartOptions);
    this.drawChartData();
  }

  slotChanges() {
    this.shadowRoot.querySelector('slot:not([name])').addEventListener('slotchange', this.drawChartBinded);
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.slotChanges();
    this.chartOptions = this.initChartOptions();
    this.chartDataList = this.mutateChartData();
    this.generateChart();
  }

  updateLabelsByPosition() {
    const position = this.getChartRotation();
    if (this['labels-position'] === 'inner') {
      this.setLabelsPosition(position);
    }
  }

  getChartRotation() {
    return this['axis-rotate'] ? 'horizontal' : 'vertical';
  }

  setLabelsPosition(position) {
    const { coordinate, property, isNegative } = this.constructor.getLabelPresets()[position];
    const sign = isNegative ? '-' : '';
    const indent = getValueObject(this['labels-inner-indent']).num;
    const labels = Array.from(this.shadowRoot.querySelectorAll(`.custom-labels-${this.id}`));

    labels.map((text) => text.setAttribute(coordinate, `${sign}${text.getBBox()[property] + indent}`));
  }

  static getLabelPresets() {
    return {
      horizontal: {
        property: 'width',
        coordinate: 'dx',
        isNegative: true,
      },
      vertical: {
        property: 'height',
        coordinate: 'dy',
        isNegative: false,
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        :host #chart {
          margin: 0 auto;
          height: var(--height);
          font-family: var(--font-family);
          text-align: center;
          z-index: 1;
        }
        /*-- Chart --*/
        .c3 svg {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .c3 path, .c3 line {
          fill: none;
          stroke: #000000;
        }
        .c3 text {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }
        .c3-text {
          fill: var(--labels-color) !important;
          font-size: var(--labels-font-size);
          font-weight: var(--labels-font-weight);
        }
        .c3-axis-x {
          font-size: var(--x-axis-font-size);
          font-weight: var(--x-axis-font-weight);
        }
        .c3-axis-x-label {
          fill: var(--x-axis-label-color);
          font-size: var(--x-axis-label-font-size);
          font-weight: var(--x-axis-label-font-weight);
        }
        .c3-axis-y {
          font-size: var(--y-axis-font-size);
          font-weight: var(--y-axis-font-weight);
        }
         .c3-axis-y-label {
          fill: var(--y-axis-label-color);
          font-size: var(--y-axis-label-font-size);
          font-weight: var(--y-axis-label-font-weight);
        }
        .c3-legend-item-tile,
        .c3-xgrid-focus,
        .c3-ygrid,
        .c3-event-rect,
        .c3-bars path {
          shape-rendering: crispEdges;
        }
        .c3-chart-arc path {
          stroke: #ffffff;
        }
        .c3-chart-arc rect {
          stroke: white;
          stroke-width: 1;
        }
        .c3-chart-arc text {
          fill: #ffffff;
          font-size: 13px;
        }
        /*-- Axis --*/
        /*-- Grid --*/
        .c3-grid line {
          stroke: #aaaaaa;
        }
        .c3-grid text {
          fill: #aaaaaa;
        }
        .c3-xgrid, .c3-ygrid {
          stroke-dasharray: 3 3;
        }
        /*-- Text on Chart --*/
        .c3-text.c3-empty {
          fill: #808080;
          font-size: 2em;
        }
        /*-- Line --*/
        .c3-line {
          stroke-width: 1px;
        }
        /*-- Point --*/
        .c3-circle._expanded_ {
          stroke-width: 1px;
          stroke: white;
        }
        .c3-selected-circle {
          fill: white;
          stroke-width: 2px;
        }
        /*-- Bar --*/
        .c3-bar {
          stroke-width: 0;
        }
        .c3-bar._expanded_ {
          fill-opacity: 1;
          fill-opacity: 0.75;
        }
        /*-- Focus --*/
        .c3-target.c3-focused {
          opacity: 1;
        }
        .c3-target.c3-focused path.c3-line, .c3-target.c3-focused path.c3-step {
          stroke-width: 2px;
        }
        .c3-target.c3-defocused {
          opacity: 0.3 !important;
        }
        /*-- Region --*/
        .c3-region {
          fill: steelblue;
          fill-opacity: 0.1;
        }
        /*-- Brush --*/
        .c3-brush .extent {
          fill-opacity: 0.1;
        }
        /*-- Select - Drag --*/
        /*-- Legend --*/
        .c3-legend-item {
          font-size: 12px;
        }
        .c3-legend-item-hidden {
          opacity: 0.15;
        }
        .c3-legend-background {
          opacity: 0.75;
          fill: transparent;
          stroke: lightgray;
          stroke-width: 0;
        }
        /*-- Title --*/
        .c3-title {
          font-size: 14px;
        }
        /*-- Tooltip --*/
        .c3-tooltip-container {
          z-index: 10;
        }
        .c3-tooltip {
          border-collapse: collapse;
          border-spacing: 0;
          background-color: #ffffff;
          empty-cells: show;
          -webkit-box-shadow: 7px 7px 12px -9px #777777;
          -moz-box-shadow: 7px 7px 12px -9px #777777;
          box-shadow: 7px 7px 12px -9px #777777;
          opacity: 0.9;
        }
        .c3-tooltip tr {
          border: 1px solid #cccccc;
        }
        .c3-tooltip th {
          background-color: #aaaaaa;
          font-size: 14px;
          padding: 2px 5px;
          text-align: left;
          color: #ffffff;
        }
        .c3-tooltip td {
          font-size: 13px;
          padding: 3px 6px;
          background-color: #ffffff;
          border-left: 1px dotted #999999;
          text-align: left;
        }
        .c3-tooltip td > span {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 6px;
        }
        .c3-tooltip td.value {
          text-align: right;
        }
        /*-- Area --*/
        .c3-area {
          stroke-width: 0;
          opacity: 0.2;
        }
        /*-- Arc --*/
        .c3-chart-arcs-title {
          dominant-baseline: middle;
          font-size: 1.3em;
        }
        .c3-chart-arcs .c3-chart-arcs-background {
          fill: #e0e0e0;
          stroke: #ffffff;
        }
        .c3-chart-arcs .c3-chart-arcs-gauge-unit {
          fill: #000000;
          font-size: 16px;
        }
        .c3-chart-arcs .c3-chart-arcs-gauge-max {
          fill: #777777;
        }
        .c3-chart-arcs .c3-chart-arcs-gauge-min {
          fill: #777777;
        }
        .c3-chart-arc .c3-gauge-value {
          fill: #000000;
        /*  font-size: 28px !important;*/
        }
        .c3-chart-arc.c3-target g path {
          opacity: 1;
        }
        .c3-chart-arc.c3-target.c3-focused g path {
          opacity: 1;
        }
        /*-- Zoom --*/
        .c3-drag-zoom.enabled {
          pointer-events: all !important;
          visibility: visible;
        }
        .c3-drag-zoom.disabled {
          pointer-events: none !important;
          visibility: hidden;
        }
        .c3-drag-zoom .extent {
          fill-opacity: 0.1;
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
      <div id='chart'></div>
      <slot></slot>
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionChart };
