import { css, html } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionApi } from '../../api';
import { FusionStore } from '../../services/fusion-store';
import {
  applyMixins,
  EnvDependComponent,
  SlideComponentBase,
} from '../../mixins';
import {
  getValueObject, createObjectItem,
} from '../../utils';
import { FusionLogger } from '../../services/fusion-logger';
import { FusionTableCell } from './table-cell';
import { DOMObservable } from '../../services/dom-observable';
import {
  Container,
  Typography,
  Dimensions,
  Border,
  Display,
  FieldDefinition,
} from '../../mixins/props';
import { BorderUpdateHandler } from '../../services/border-update-handler';

class FusionTable extends applyMixins(FusionBase, [
  SlideComponentBase,
  Container,
  Typography,
  Dimensions,
  Display,
  Border,
  FieldDefinition,
  EnvDependComponent,
]) {
  static get properties() {
    const {
      width,
      height,
      'max-height': maxHeight,
      'min-height': minHeight,
      'max-width': maxWidth,
      'min-width': minWidth,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      'border-width': borderWidth,
      'border-left-width': borderLeftWidth,
      'border-top-width': borderTopWidth,
      'border-right-width': borderRightWidth,
      'border-bottom-width': borderBottomWidth,
      'border-radius': borderRadius,
      'letter-spacing': letterSpacing,
      'line-height': lineHeight,
      'should-shown': shouldShown,
      overflow,
      ...rest
    } = super.properties;
    return {
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      width: {
        ...width,
        value: '304px',
      },
      rows: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'table',
        value: '3',
        min: 0,
      },
      columns: {
        type: String,
        fieldType: 'Number',
        propertyGroup: 'table',
        value: '3',
        min: 0,
        prop: true,
      },
      'border-collapse': {
        type: String,
        fieldType: 'Select',
        value: 'separate',
        selectOptions: ['separate', 'collapse'],
      },
      'padding-top': {
        ...paddingTop,
        value: '10px',
      },
      'padding-bottom': {
        ...paddingBottom,
        value: '10px',
      },
      'padding-left': {
        ...paddingLeft,
        value: '10px',
      },
      'padding-right': {
        ...paddingRight,
        value: '10px',
      },
      'background-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'background',
        value: 'rgba(255, 255, 255, 1)',
      },
      'border-width': {
        ...borderWidth,
        value: '1px',
      },
      'border-left-width': {
        ...borderLeftWidth,
        value: '1px',
      },
      'border-top-width': {
        ...borderTopWidth,
        value: '1px',
      },
      'border-right-width': {
        ...borderRightWidth,
        value: '1px',
      },
      'border-bottom-width': {
        ...borderBottomWidth,
        value: '1px',
      },
      'border-radius': {
        ...borderRadius,
        value: '0px',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-table',
      componentCategory: 'data',
      componentUIName: 'Table',
      componentDescription: 'Basic table component',
      nestedComponents: [],
      resizable: 'e,w',
      methods: [
        'merge',
        'split',
      ],
    };
  }

  constructor() {
    super();
    const cellEvents = this.constructor.getCellEvents(FusionTableCell);
    this.cell = createObjectItem(FusionTableCell, cellEvents);
    this.cellDefaultWidth = this.cell.component.properties.width.value;
    this.selectedCells = [];
  }

  environmentDataReceived() {
    if (FusionStore.isActivator) {
      this.initObserver();
    }
  }

  initObserver() {
    const config = {
      attributes: true,
      childList: false,
      characterData: false,
      subtree: true,
    };
    this.mutationObserver = new DOMObservable();
    this.mutationObserver.setConfig(config);
    this.mutationObserver.init(this.mutationHandler.bind(this), false);
    this.mutationObserver.observe(this);
  }

  /**
   * Save table only once after changing different cells and last cell deselect
   * */
  mutationHandler(mutations) {
    const deselectMutation = mutations.find((mutation) => mutation.attributeName === 'data-mo-selected');
    if (deselectMutation && deselectMutation.target.id !== this.id) {
      this.saveContent();
    }
  }

  static getCellEvents(component) {
    const { componentName } = component.options;
    return {
      resize: `${componentName}:resized`,
      bgChange: `${componentName}:bg-changed`,
      select: `${componentName}:select`,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.cellResizeEventHandler = this.cellResizeHandler.bind(this);
    this.cellAddEventHandler = this.cellAddHandler.bind(this);
    this.cellRemoveEventHandler = this.cellRemoveHandler.bind(this);
    this.cellBgChangeEventHandler = this.cellBgChangeHandler.bind(this);
    this.cellSelectEventHandler = this.cellSelectHandler.bind(this);
    this.clearSelectEventHandler = this.clearSelectedCells.bind(this);
    this.applyMethodEventHandler = this.applyMethod.bind(this);
    this.handleListeners(true);
  }

  applyMethod(e) {
    const method = e.detail;
    if (this[method]) {
      this[method]();
    } else {
      FusionLogger.error(`Table doesnt support method: ${method}`, 'FusionTable');
    }
  }

  getExistCells() {
    return Array.from(this.getElementsByTagName(this.cell.name));
  }

  /**
   * experimental function to skip execution getExistCells.
   * @author Roman Savitskyi
   * @warn Should regenerate array on add/delete and change structure
   * */
  getExistCellsSlotObject(forceUpdate = false) {
    if (!this.existCellsSlot || forceUpdate) {
      const data = this.getExistCells();
      this.existCellsSlot = data.reduce((obj, item) => ({ ...obj, [item.getAttribute('slot')]: item }), {});
      this.existCellsCount = data.length;
    }
    return this.existCellsSlot;
  }

  getExistCellsCount() {
    if (this.existCellsSlot === undefined) {
      this.getExistCellsSlotObject();
    }
    return this.existCellsCount;
  }

  isCellsExist() {
    return this.getExistCellsCount() > 0;
  }

  cellSelectHandler({ currentTarget }) {
    this.updateSelectedCells(currentTarget);
  }

  updateSelectedCells(fusionCell) {
    fusionCell.classList.contains('selected') ? this.clearSelectedCell(fusionCell) : this.addSelectedCell(fusionCell);
  }

  clearSelectedCells() {
    this.selectedCells = [];
    this.getExistCells().forEach((fusionCell) => this.clearSelectedCell(fusionCell));
    this.getExistCellsSlotObject(true);
  }

  clearSelectedCell(fusionCell) {
    fusionCell.classList.remove('selected');
    this.selectedCells = this.selectedCells.filter((cell) => cell.slot !== fusionCell.slot);
  }

  addSelectedCell(fusionCell) {
    fusionCell.classList.add('selected');
    this.selectedCells.push(fusionCell);
  }

  cellAddHandler({ target }) {
    this.changeCellListeners(target, true);
    this.getExistCellsSlotObject(true);
  }

  cellRemoveHandler({ target }) {
    const tableCell = this.getTableCell(target);
    let tableRow;
    if (tableCell) {
      tableRow = tableCell.parentElement;
      tableCell.remove();
    }
    this.changeCellListeners(target);
    this.getExistCellsSlotObject(true);

    if (tableRow && !tableRow.children.length) {
      this.lastRowCellRemoveHandler(tableRow.rowIndex);
    }
  }

  lastRowCellRemoveHandler(index) {
    const { rows } = this.tbody;
    this.emptyRowIndex = index;
    let deleteRowsCount = 1;

    if (this.emptyRowIndex !== rows.length - 1) {
      deleteRowsCount += this.getEmptyRowspanRowsCount(this.emptyRowIndex);
    }

    this.setAttribute('rows', this.rows - deleteRowsCount);
  }

  getEmptyRowspanRowsCount(emptyRowIndex) {
    const { rows } = this.tbody;
    let count = 0;
    for (let i = emptyRowIndex + 1; i < rows.length; i += 1) {
      if (!rows[i].children.length) {
        count += 1;
      } else {
        break;
      }
    }
    return count;
  }

  getTableCell({ slot }) {
    return this.table.querySelector(`[data-slot="${slot}"]`);
  }

  changeCellListeners(fusionCell, isAdd) {
    const action = isAdd ? 'addEventListener' : 'removeEventListener';
    const { remove, bgChange, select } = this.cell.events;
    fusionCell[action](remove, this.cellRemoveEventHandler);
    fusionCell[action](bgChange, this.cellBgChangeEventHandler);
    fusionCell[action](select, this.cellSelectEventHandler);
  }

  cellBgChangeHandler(e) {
    const fusionCell = e.target;
    const tableCell = this.getTableCell(fusionCell);
    if (tableCell) {
      this.constructor.setTableCellStyle(tableCell, fusionCell);
    } else {
      FusionLogger.error('Can\'t find target cell', 'FusionTable');
    }
  }

  static getDependColumnIndex(cols, columnIndexToResize) {
    const lastColIndex = cols.length - 1;
    return columnIndexToResize === lastColIndex ? 0 : lastColIndex;
  }

  changeSameColumnCells(widthDifference, columnIndexToResize, targetCell) {
    const cellsToResize = this.getCellsByColumnIndex(columnIndexToResize)
      .filter((tableCell) => tableCell.slot !== targetCell.slot);
    this.constructor.updateColumnCellsWidth(cellsToResize, widthDifference);
    const tableCol = this.getTableCol(columnIndexToResize);
    tableCol.width = targetCell.width;
    return cellsToResize;
  }

  cellResizeHandler(e) {
    const targetCell = e.target;
    const widthDifference = this.constructor.getWidthDifference(e);
    if (targetCell.hasAttribute('data-mo-selected')) {
      const columnIndexToResize = this.getColIndex(targetCell);
      this.changeSameColumnCells(widthDifference, columnIndexToResize, targetCell);
      this.setupTableWidth(widthDifference);
    }
  }

  saveContent() {
    FusionApi.saveOuterDataContent(this);
  }

  static setTableCellStyle(tableCell, fusionCell) {
    tableCell.style.background = fusionCell['background-color'];
  }

  getCellsByColumnIndex(columnIndex) {
    return this.getExistCells()
      .filter((tableCell) => {
        const [, col] = this.constructor.getCellParams(tableCell);
        const spanValue = +tableCell.dataset.colspan;
        const isSameColumn = col === columnIndex;
        const isColSpanned = spanValue + col - 1 >= columnIndex && col < columnIndex;
        return (isSameColumn || isColSpanned);
      });
  }

  static getWidthDifference(e) {
    const { target, detail } = e;
    const { oldWidth } = detail;
    const { num } = getValueObject(oldWidth);
    const currentWidthNum = getValueObject(target.width).num;
    return currentWidthNum - num;
  }

  getTableCol(index) {
    return this.getTableCols()[index];
  }

  getColIndex(fusionCell) {
    const [, col] = this.constructor.getCellParams(fusionCell);
    const spanValue = +fusionCell.dataset.colspan;
    return spanValue > 1 ? col + spanValue - 1 : col;
  }

  static updateColumnCellsWidth(cells, diff) {
    cells.forEach((fusionCell) => {
      const { num, unit } = getValueObject(fusionCell.width);
      const widthValue = num + diff;
      fusionCell.width = widthValue + unit;
      fusionCell.style.width = widthValue + unit;
    });
  }

  static getCellParams({ slot }) {
    return slot
      .split('_')
      .map((item) => +item);
  }

  /* activatorOnly:start */
  merge() {
    if (this.canMerge()) {
      const restCells = this.applyMerge();
      this.clearCell(restCells);
    } else {
      FusionLogger.log('Can not merge selected cells', 'FusionTable');
    }
    this.clearSelectedCells();
    this.getExistCellsSlotObject(true);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  canMerge() {
    this.rowsData = this.getRowsData();
    const virtualCells = this.getVirtualCells();
    let canMerge = false;
    if (this.constructor.isMultiMerge(virtualCells)) {
      canMerge = this.canMultiMerge(virtualCells);
    } else {
      const isRowOrderedCells = this.isHorizontalOrderedCells(this.sortCellsByColumn(virtualCells));
      const isColOrderedCells = this.isVerticalOrderedCells(this.sortCellsByRow(virtualCells));
      canMerge = isRowOrderedCells || isColOrderedCells;
    }
    return canMerge && virtualCells.length;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static isMultiMerge(virtualCells) {
    return virtualCells.length > 2;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  canMultiMerge(virtualCells) {
    const [firstCol] = this.getSortedCellsByCol(virtualCells);
    const [firstRow] = this.getSortedCellsByRow(virtualCells);
    const isRowOrderedCells = this.getSortedCellsByRow(virtualCells).every((item) => item.length === firstRow.length && this.isHorizontalOrderedCells(item));
    const isColOrderedCells = this.getSortedCellsByCol(virtualCells).every((item) => item.length === firstCol.length && this.isVerticalOrderedCells(item));
    return isRowOrderedCells && isColOrderedCells;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  getVirtualCells() {
    const virtualCells = [];
    this.selectedCells.forEach((fusionCell) => {
      const initCell = this.constructor.createVirtualCell(fusionCell);
      virtualCells.push(initCell);
      this.createInnerVirtualCells(fusionCell, virtualCells);
    });
    return virtualCells;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  createInnerVirtualCells(fusionCell, virtualCells) {
    this.createInnerVirtualCellsHorizontally(fusionCell, virtualCells);
    this.createInnerVirtualCellsVertically(fusionCell, virtualCells, this.createInnerVirtualCellsHorizontally.bind(this));
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static createVirtualCell(fusionCell) {
    const virtualCell = fusionCell.cloneNode(true);
    this.setDefaultCellAttr(virtualCell);
    return virtualCell;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  createInnerVirtualCellsHorizontally(fusionCell, virtualCells, colspan = fusionCell.dataset.colspan) {
    const [row, col] = this.constructor.getCellParams(fusionCell);
    for (let index = 1; index < colspan; index += 1) {
      const virtualCell = this.constructor.createVirtualCell(fusionCell);
      const key = this.constructor.getSlotKey(row, col + index);
      virtualCell.setAttribute('slot', key);
      virtualCells.push(virtualCell);
    }
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  createInnerVirtualCellsVertically(fusionCell, virtualCells, cb) {
    const { rowspan, colspan } = fusionCell.dataset;
    const [row, col] = this.constructor.getCellParams(fusionCell);
    for (let index = 1; index < rowspan; index += 1) {
      const virtualCell = this.constructor.createVirtualCell(fusionCell);
      const key = this.constructor.getSlotKey(row + index, col);
      virtualCell.setAttribute('slot', key);
      virtualCells.push(virtualCell);
      if (cb && colspan > 1) {
        cb(virtualCell, virtualCells, colspan);
      }
    }
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  isVerticalOrderedCells(arr) {
    return arr
      .every((fusionCell, index, array) => {
        const [rowCur, colCur] = this.constructor.getCellParams(fusionCell);
        const nexItem = array[index + 1];
        let isValid = true;
        if (nexItem) {
          const [rowNext, colNext] = this.constructor.getCellParams(nexItem);
          const isSameColumn = colCur === colNext;
          const currentRowIndex = this.rowsData.indexOf(rowCur);
          const isOrderedCells = this.rowsData[currentRowIndex + 1] === rowNext;
          isValid = isSameColumn && isOrderedCells;
        }
        return isValid;
      });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  isHorizontalOrderedCells(arr) {
    return arr
      .every((fusionCell, index, array) => {
        const [rowCur, colCur] = this.constructor.getCellParams(fusionCell);
        const nexItem = array[index + 1];
        let isValid = true;
        if (nexItem) {
          const [rowNext, colNext] = this.constructor.getCellParams(nexItem);
          const isSameRow = rowCur === rowNext;
          const isOrderedCells = colCur + 1 === colNext;
          isValid = isSameRow && isOrderedCells;
        }
        return isValid;
      });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  getSortedCellsByCol(arr = this.selectedCells) {
    const cellsByCol = [];
    arr.forEach((fusionCell) => {
      const [, col] = this.constructor.getCellParams(fusionCell);
      cellsByCol[col] = cellsByCol[col] || [];
      cellsByCol[col].push(fusionCell);
    });
    return cellsByCol
      .filter((item) => item)
      .map((item) => this.sortCellsByRow(item));
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  getSortedCellsByRow(arr = this.selectedCells) {
    const cellsByRow = [];
    arr.forEach((fusionCell) => {
      const [row] = this.constructor.getCellParams(fusionCell);
      cellsByRow[row] = cellsByRow[row] || [];
      cellsByRow[row].push(fusionCell);
    });
    return cellsByRow
      .filter((item) => item)
      .map((item) => this.sortCellsByColumn(item));
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  sortCellsByRow(array) {
    return array
      .sort((fusionCell1, fusionCell2) => {
        const [row1] = this.constructor.getCellParams(fusionCell1);
        const [row2] = this.constructor.getCellParams(fusionCell2);
        return row1 - row2;
      });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  sortCellsByColumn(array) {
    return array
      .sort((fusionCell1, fusionCell2) => {
        const [, col1] = this.constructor.getCellParams(fusionCell1);
        const [, col2] = this.constructor.getCellParams(fusionCell2);
        return col1 - col2;
      });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  applyMerge() {
    const sortedCellsByRow = this.getSortedCellsByRow();
    const sortedCellsByCol = this.getSortedCellsByCol();
    const [firstRow] = sortedCellsByRow;
    const [firstCol] = sortedCellsByCol;
    const [initFusionCell] = firstRow;
    const tableCell = this.getTableCell(initFusionCell);
    tableCell.colSpan = this.calcTotalSpanValue(firstRow, 'colSpan');
    tableCell.rowSpan = this.calcTotalSpanValue(firstCol, 'rowSpan');
    initFusionCell.setAttribute('data-colspan', tableCell.colSpan);
    initFusionCell.setAttribute('data-rowspan', tableCell.rowSpan);
    initFusionCell.width = `${tableCell.clientWidth}px`;
    return this.selectedCells.filter((fusionCell) => fusionCell.slot !== initFusionCell.slot);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  calcTotalSpanValue(sortedArray, spanValue) {
    return sortedArray.reduce((totalColSpan, curr) => {
      totalColSpan += this.getTableCell(curr)[spanValue];
      return totalColSpan;
    }, 0);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  clearCell(cellsArr) {
    cellsArr.forEach((fusionCell) => {
      const tableCell = this.getTableCell(fusionCell);
      tableCell.remove();
      this.deleteFusionCell(tableCell);
    });
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  split() {
    this.rowsData = this.getRowsData();
    if (this.selectedCells.length === 1) {
      const [fusionCell] = this.selectedCells;
      const tableCell = this.getTableCell(fusionCell);
      this.applySplit(tableCell);
      this.resetSplitCell(fusionCell, tableCell);
    } else {
      FusionLogger.log('Please select one cell to split', 'FusionTable');
    }
    this.clearSelectedCells();
    this.getExistCellsSlotObject(true);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  applySplit(tableCell) {
    this.applyHorizontalSplit(tableCell);
    this.applyVerticalSplit(tableCell, this.applyHorizontalSplit.bind(this));
    this.getExistCellsSlotObject(true);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  applyHorizontalSplit(tableCell, colSpanInitValue = tableCell.colSpan) {
    const { colSpan } = tableCell;
    const [row, col] = this.constructor.getCellParams(tableCell.dataset);
    const rowIndexFromData = this.rowsData.indexOf(row);
    for (let colIndex = 1; colIndex < colSpan; colIndex += 1) {
      const cellColIndex = col + colIndex;
      const rowItem = this.table.querySelectorAll('tr')[rowIndexFromData];
      const index = this.constructor.getTableCellIndexToInsert(cellColIndex, rowItem);
      const tableCellItem = rowItem.insertCell(index);
      this.addCustomCell(tableCellItem, row, cellColIndex);
    }
    tableCell.colSpan = colSpanInitValue;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static getTableCellIndexToInsert(index, row) {
    const rowCells = [...row.cells];
    let resultIndex;
    if (rowCells.length) {
      resultIndex = rowCells.findIndex((element) => this.getCellParams(element.dataset)[1] > index);
      if (resultIndex < 0) {
        resultIndex = rowCells.length;
      }
    } else {
      resultIndex = 0;
    }
    return resultIndex;
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  applyVerticalSplit(tableCell, cb) {
    const { rowSpan, colSpan } = tableCell;
    const [row, col] = this.constructor.getCellParams(tableCell.dataset);
    const rowIndexFromData = this.rowsData.indexOf(row);
    for (let rowIndex = 1; rowIndex < rowSpan; rowIndex += 1) {
      const cellRowIndex = rowIndexFromData + rowIndex;
      const rowItem = this.table.querySelectorAll('tr')[cellRowIndex];
      const index = this.constructor.getTableCellIndexToInsert(col, rowItem);
      const tableCellItem = rowItem.insertCell(index);
      tableCellItem.colSpan = colSpan;
      this.addCustomCell(tableCellItem, this.rowsData[rowIndexFromData + rowIndex], col);
      if (colSpan > 1 && cb) {
        cb(tableCellItem, 1);
      }
    }
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  static setDefaultCellAttr(fusionCell) {
    fusionCell.setAttribute('data-rowspan', 1);
    fusionCell.setAttribute('data-colspan', 1);
  }
  /* activatorOnly:end */

  /* activatorOnly:start */
  resetSplitCell(fusionCell, tableCell) {
    tableCell.rowSpan = 1;
    tableCell.colSpan = 1;
    const { cellIndex } = tableCell;
    const tableCol = this.getTableCol(cellIndex);
    fusionCell.width = tableCol.width;
    this.constructor.setDefaultCellAttr(fusionCell);
    this.getExistCellsSlotObject(true);
  }
  /* activatorOnly:end */

  synchronizeWidth() {
    const { num, unit } = getValueObject(this.width);
    if (unit === '%' && this.parentNode.offsetWidth) {
      const cols = this.getTableCols();
      const totalColsWidth = this.constructor.getTotalColsWidth(cols);
      // @todo border-bug
      const totalBorderWidth = this.getBorderWidth() * 2 * this.columns;
      const widthDiff = ((this.parentNode.offsetWidth * num) / 100) - totalColsWidth - totalBorderWidth;
      if (widthDiff) {
        this.changeColsWidth(cols, widthDiff);
      }
    }
  }

  initTable() {
    this.table = document.createElement('table');
    this.table.classList.add('main-part');
    this.initCols();
    this.initTbody();
    this.table.appendChild(this.tbody);
  }

  initCols() {
    this.colgroup = document.createElement('colgroup');
    const countColumns = parseInt(this.columns, 10);
    this.colgroup.innerHTML = this.addCol().repeat(countColumns);
    this.table.appendChild(this.colgroup);
  }

  addCol() {
    return `<col width="${this.cellDefaultWidth}"></col>`;
  }

  applyColState(fusionCell) {
    const [, col] = this.constructor.getCellParams(fusionCell);
    const tableCol = this.getTableCol(col);
    if (+fusionCell.dataset.colspan === 1) {
      tableCol.width = fusionCell.width;
    }
  }

  applyFusionCellsState() {
    const rows = this.tbody.querySelectorAll('tr');
    for (let rowIndex = 0; rowIndex < parseInt(this.rows, 10); rowIndex += 1) {
      const tr = rows[rowIndex];
      const columns = tr.querySelectorAll('td');
      for (let cellIndex = 0; cellIndex < parseInt(this.columns, 10); cellIndex += 1) {
        const tableCell = columns[cellIndex];
        const fusionCell = this.getFusionCell(tableCell);
        if (fusionCell && tableCell) {
          this.constructor.applyCellState(fusionCell, tableCell);
          this.applyColState(fusionCell);
        } else if (!fusionCell && tableCell) {
          tr.removeChild(tableCell);
        }
      }
      // @todo But we are not ready to implement it
      // if (!tr.children.length) this.tbody.removeChild(tr);
    }
  }

  static applyCellState(fusionCell, tableCell) {
    const { rowspan, colspan } = fusionCell.dataset;
    tableCell.rowSpan = rowspan;
    tableCell.colSpan = colspan;
  }

  initTbody() {
    this.tbody = document.createElement('tbody');
    if (!this.isCellsExist()) {
      // method where we will generate fulltable
      this.addRows();
      // case if we removed all table content
      const { num } = getValueObject(this.width);
      if (!num) {
        this.increaseTableWidth(this.columns);
      }
    } else {
      // method where we will work with current content
      this.addRowsByCellsSlotData();
      this.applyFusionCellsState();
    }
  }

  addRows() {
    for (let index = 0; index < this.rows; index += 1) {
      if (!this.tbody.rows[index]) {
        const tr = this.tbody.insertRow(index);
        for (let colIndex = 0; colIndex < parseInt(this.columns, 10); colIndex += 1) {
          if (!tr.cells[colIndex]) {
            const tableCell = tr.insertCell(colIndex);
            this.addCustomCell(tableCell, index, colIndex, false);
          }
        }
      }
    }
  }

  addRowsByCellsSlotData() {
    this.rowsData = this.getRowsData();
    for (let index = 0; index < this.rows; index += 1) {
      if (!this.tbody.rows[index]) {
        const tr = this.tbody.insertRow(index);
        for (let colIndex = 0; colIndex < parseInt(this.columns, 10); colIndex += 1) {
          if (!tr.cells[colIndex]) {
            const tableCell = tr.insertCell(colIndex);
            this.addCustomCell(tableCell, this.rowsData[index], colIndex, false);
          }
        }
      }
    }
  }

  getRowsData() {
    const cellsData = [...Object.entries(this.existCellsSlot)].reduce((result, element) => {
      result[element[0]] = +(element[1].getAttribute('data-rowspan'));
      return result;
    }, {});
    return this.constructor.getUniqueCellsRowsData(cellsData);
  }

  static sortSlotsData(slotsData) {
    return [...Object.entries(slotsData)].sort((a, b) => {
      let compareResult = this.getCellParams({ slot: a[0] })[0] - this.getCellParams({ slot: b[0] })[0];
      if (compareResult === 0) {
        compareResult = this.getCellParams({ slot: a[0] })[1] - this.getCellParams({ slot: b[0] })[1];
      }
      return compareResult;
    });
  }

  static getUniqueCellsRowsData(slotsData) {
    const data = this.sortSlotsData(slotsData);
    const result = [];
    let currentRowIndex;
    let rowspanReservedRowsCount = 0;
    for (let i = 0; i < data.length; i += 1) {
      const currentCellRowIndex = this.getCellParams({ slot: data[i][0] })[0];

      // set needed variables init value on cycle start
      if (i === 0) {
        currentRowIndex = currentCellRowIndex;
        rowspanReservedRowsCount = data[i][1] - 1;
      }

      // if current row index different than previous add row and rowspan reserved rows data from variables
      // to result array than set needed variables value from current cell data
      if (currentCellRowIndex !== currentRowIndex) {
        result.push(currentRowIndex);
        if (currentCellRowIndex !== currentRowIndex + 1) {
          for (let ind = 1; ind <= rowspanReservedRowsCount; ind += 1) {
            result.push(currentRowIndex + ind);
          }
        }
        currentRowIndex = currentCellRowIndex;
        rowspanReservedRowsCount = data[i][1] - 1;
      }

      // find min rowspan value in elements with same row index
      if ((data[i][1] - 1) < rowspanReservedRowsCount) {
        rowspanReservedRowsCount = data[i][1] - 1;
      }

      // on last cycle loop add last row and rowspan reserved rows data from variables to result array
      if (i === data.length - 1) {
        result.push(currentRowIndex);
        for (let ind = 1; ind <= rowspanReservedRowsCount; ind += 1) {
          result.push(currentRowIndex + ind);
        }
      }
    }
    return result;
  }

  addRowsOnUpdate(count) {
    const start = this.rows - count;
    let rowIndexIncreaseNumber = 0;
    for (let index = start; index < this.rows; index += 1) {
      rowIndexIncreaseNumber += 1;
      const tr = this.tbody.insertRow(index);
      for (let colIndex = 0; colIndex < +this.columns; colIndex += 1) {
        const tableCell = tr.insertCell(colIndex);
        this.addCustomCell(tableCell, this.rowsData[start - 1] + rowIndexIncreaseNumber, colIndex, true);
      }
    }
  }

  static getSlotKey(rowIndex, cellIndex) {
    return `${rowIndex}_${cellIndex}`;
  }

  addCustomCell(tableCell, rowIndex, cellIndex, isUpdate = true) {
    const key = this.constructor.getSlotKey(rowIndex, cellIndex);
    if (this.getCellBySlot(key)) {
      this.generateMissedSlots(tableCell, key);
    } else if (!this.isCellsExist() || isUpdate) {
      this.constructor.setCellSlotAttr(tableCell, key);
      const tableCol = this.getTableCol(cellIndex);
      this.addFusionCell(key, tableCol.width);
    }
  }

  addFusionCell(key, width = this.cellDefaultWidth) {
    const { componentName, defaultTemplate } = this.cell.component.options;
    return FusionApi.createElement(
      componentName,
      {
        width: {
          value: width,
        },
        color: {
          value: this.color,
        },
        'font-size': {
          value: this['font-size'],
        },
        slot: {
          value: key,
        },
        'data-colspan': {
          value: 1,
        },
        'data-rowspan': {
          value: 1,
        },
        required: {
          value: false,
        },
        hidden: {
          value: false,
        },
        'show-in-editor': {
          value: true,
        },
        'data-flag-on': {
          value: false,
        },
      },
      defaultTemplate,
      this,
      `#${this.id}`,
      { setActive: false, setState: false },
    );
  }

  generateMissedSlots(tableCell, key) {
    const fusionCell = this.getExistCellsSlotObject()[key];
    if (fusionCell) {
      this.constructor.setCellSlotAttr(tableCell, key);
      this.constructor.setTableCellStyle(tableCell, fusionCell);
    }
  }

  static setCellSlotAttr(tableCell, key) {
    tableCell.setAttribute('data-slot', key);
    tableCell.innerHTML = `<slot name="${key}"></slot>`;
  }

  updateCellsRowSpans(rows, removedRowIndex) {
    Array.from(rows).forEach((row) => {
      const { rowIndex, cells } = row;
      Array.from(cells).forEach((tableCell) => {
        const shouldUpdateCellRowspan = rowIndex + tableCell.rowSpan - 1 === removedRowIndex;
        if (shouldUpdateCellRowspan) {
          tableCell.rowSpan -= 1;
          const fusionCell = this.getFusionCell(tableCell);
          fusionCell.setAttribute('data-rowspan', tableCell.rowSpan);
        }
      });
    });
  }

  deleteRows(count) {
    const { rows } = this.tbody;
    if (this.emptyRowIndex >= 0 && this.emptyRowIndex !== undefined) {
      if (count > rows.length) {
        this.emptyRowIndex = -1;
      }
      for (let i = 0; i < count; i += 1) {
        this.tbody.deleteRow(this.emptyRowIndex);
      }
      this.emptyRowIndex = undefined;
    } else {
      for (let index = 0; index < count; index += 1) {
        const rowIndex = rows.length - 1;
        const row = rows[rowIndex];
        this.tbody.deleteRow(rowIndex);
        this.deleteRowFusionCells(row);
        this.updateCellsRowSpans(rows, rowIndex);
      }
    }
  }

  addRowCells(row, count) {
    const rowIndex = !this.rowsData ? row.rowIndex : this.rowsData[row.rowIndex];
    const oldColumns = +this.columns - count;
    for (let index = oldColumns; index < +this.columns; index += 1) {
      let cellIndex = index;
      if (row.cells.length < index) {
        cellIndex = row.cells.length;
      }
      const tableCell = row.insertCell(cellIndex);
      this.addCustomCell(tableCell, rowIndex, index);
    }
  }

  deleteRowFusionCells(row) {
    const cells = Array.from(row.cells);
    cells.forEach((tableCell) => {
      this.deleteFusionCell(tableCell);
    });
  }

  deleteAllFusionCells() {
    // @todo Remove from DOM server????
    this.getExistCells().forEach((fusionCell) => {
      this.removeChild(fusionCell);
    });
  }

  getFusionCell(tableCell) {
    const { slot } = tableCell.dataset;
    return this.getCellBySlot(slot);
  }

  getCellBySlot(slot) {
    return this.getExistCellsSlotObject()[slot];
  }

  deleteFusionCell(tableCell) {
    const fusionCell = this.getFusionCell(tableCell);
    this.removeChild(fusionCell);
  }

  deleteFusionCells(row, count) {
    const oldColumns = +this.columns + count;
    const { cells } = row;
    if (cells.length) {
      for (let index = oldColumns; index > +this.columns; index -= 1) {
        const cellIndex = index - 1;
        const tableCellToRemove = Array.from(cells).find((tableCell) => {
          const [, col] = this.constructor.getCellParams(tableCell.dataset);
          return col === cellIndex;
        });
        if (tableCellToRemove) {
          row.removeChild(tableCellToRemove);
          this.deleteFusionCell(tableCellToRemove);
        } else {
          this.decreaseLastCellColspan(cells);
        }
      }
    }
  }

  decreaseLastCellColspan(rowCells) {
    const lastCell = rowCells[rowCells.length - 1];
    if (lastCell) {
      const fusionCell = this.getFusionCell(lastCell);
      const [, col] = this.constructor.getCellParams(fusionCell);
      const isEnableToDecrease = col + lastCell.colSpan !== +this.columns;
      if (lastCell.colSpan > 1 && isEnableToDecrease) {
        lastCell.colSpan -= 1;
        fusionCell.setAttribute('data-colspan', lastCell.colSpan);
        const cols = this.getTableCols();
        const lastCol = cols[cols.length - 1];
        const { num: cellWidth, unit: cellUnit } = getValueObject(fusionCell.width);
        const { num: colWidth } = getValueObject(lastCol.width);
        const totalBorderWidth = this.getBorderWidth() * 2;
        const newWidth = cellWidth - colWidth;
        fusionCell.width = `${newWidth - totalBorderWidth}${cellUnit}`;
      }
    }
  }

  addCols(count) {
    this.colgroup.innerHTML += this.addCol().repeat(count);
  }

  deleteCols(count) {
    const oldColumns = +this.columns + count;
    for (let index = oldColumns; index > +this.columns; index -= 1) {
      const cols = this.getTableCols();
      const col = cols[cols.length - 1];
      this.table.querySelector('colgroup').removeChild(col);
    }
  }

  addColumns(count) {
    this.addCols(count);
    const { rows } = this.tbody;
    Array.from(rows).forEach((row) => {
      this.addRowCells(row, count);
    });
  }

  deleteColumns(count) {
    this.deleteCols(count);
    const { rows } = this.tbody;
    Array.from(rows).forEach((row) => {
      this.deleteFusionCells(row, count);
    });
  }

  static isCountIncreased(oldVal, newVal) {
    return newVal > oldVal;
  }

  updateContent(attr, oldVal, newVal) {
    this.rowsData = this.getRowsData();
    const isIncreased = this.constructor.isCountIncreased(oldVal, newVal);
    const difference = this.constructor.checkDifference(oldVal, newVal);
    switch (attr) {
      case 'rows':
        this.updateRows(difference, isIncreased);
        break;
      case 'columns':
        this.updateColumns(difference, isIncreased);
        break;
      default:
        break;
    }
  }

  static checkDifference(oldVal, newVal) {
    return Math.abs(oldVal - newVal);
  }

  updateRows(count, isIncreased) {
    if (isIncreased) {
      this.addRowsOnUpdate(count);
      // @todo must be here but ERROR
      // this.applyFusionCellsState();
    } else {
      this.deleteRows(count);
    }
  }

  updateColumns(count, isIncreased) {
    if (isIncreased) {
      this.addColumns(count);
      this.increaseTableWidth(count);
    } else {
      this.decreaseTableWidth(count);
      this.deleteColumns(count);
    }
  }

  fillTable(prop, oldV, newV) {
    (!oldV) ? this.initTable() : this.updateContent(prop, oldV, newV);
  }

  updateTable(changedProps) {
    Array.from(changedProps.keys()).every((prop) => {
      const newV = +this[prop];
      const oldV = +changedProps.get(prop);
      (!newV) ? this.clearTable() : this.fillTable(prop, oldV, newV);
      return true;
    });
  }

  clearTable() {
    this.table.innerHTML = '';
    this.deleteAllFusionCells();
    const { unit } = getValueObject(this.width);
    this.setAttribute('width', `0${unit}`);
    FusionApi.updateDynamicProperty({ options: {}, value: `0${unit}`, name: 'width' });
  }

  static isStructureAttr(changedProps) {
    return changedProps.has('rows') || changedProps.has('columns');
  }

  static isTableStyleAttrs(changedProps) {
    const tableStyleProps = [
      'border-width',
    ];
    return tableStyleProps.filter((prop) => changedProps.has(prop)).pop();
  }

  static isCellStyleAttrs(changedProps) {
    const cellStyleProps = [
      'color',
      'font-size',
      'font-family',
      'font-weight',
      'font-style',
      'padding-top',
      'padding-bottom',
      'padding-left',
      'padding-right',
    ];
    return cellStyleProps.filter((prop) => changedProps.has(prop)).pop();
  }

  getTableWidthDiff(oldWidth) {
    const { unit } = getValueObject(this.width);
    let currentTableWidth = getValueObject(this.width).num;
    let oldTableWidth = getValueObject(oldWidth).num;
    const oldTableUnit = getValueObject(oldWidth).unit;
    if (unit === '%' && oldTableUnit === '%') {
      currentTableWidth = this.parentNode.offsetWidth * (currentTableWidth / 100);
      oldTableWidth = this.parentNode.offsetWidth * (oldTableWidth / 100);
    } else if (unit === '%' && oldTableUnit === 'px') {
      currentTableWidth = this.parentNode.offsetWidth * (currentTableWidth / 100);
    } else if (unit === 'px' && oldTableUnit === '%') {
      oldTableWidth = this.parentNode.offsetWidth * (oldTableWidth / 100);
    }
    return currentTableWidth - oldTableWidth;
  }

  static getTotalColsWidth(cols) {
    return cols.reduce((total, curr) => {
      total += getValueObject(curr.width).num;
      return total;
    }, 0);
  }

  getTableCols() {
    return Array.from(this.colgroup.children);
  }

  getBorderWidth() {
    return getValueObject(this['border-width']).num;
  }

  setupTableWidth(widthDiff, isDynamic) {
    const { num, unit } = getValueObject(this.width);
    let size = num + widthDiff;
    let sizeUnit = unit;
    if (unit === '%') {
      if (this.offsetWidth) {
        const pxWidth = widthDiff + this.offsetWidth;
        size = (num * pxWidth) / this.offsetWidth;
      } else {
        // case if we clear table with '%' unit - we setup default 'px' unit
        sizeUnit = 'px';
      }
    }
    this.setAttribute('width', `${size}${sizeUnit}`);
    if (isDynamic) FusionApi.updateDynamicProperty({ options: {}, value: `${size}${sizeUnit}`, name: 'width' });
  }

  decreaseTableWidth(count) {
    const totalBorderWidth = this.getBorderWidth() * 2 * count;
    const cols = this.getTableCols();
    const totalColsWidth = this.constructor.getChangedColumnsTotalWidth(cols, count);
    const widthDiff = -1 * (totalBorderWidth + totalColsWidth);
    this.setupTableWidth(widthDiff, true);
  }

  static getChangedColumnsTotalWidth(cols, count) {
    const changedCols = cols.slice(-count);
    return this.getTotalColsWidth(changedCols);
  }

  increaseTableWidth(count) {
    const cols = this.getTableCols();
    const totalBorderWidth = this.getBorderWidth() * 2 * count;
    const totalColsWidth = this.constructor.getChangedColumnsTotalWidth(cols, count);
    const widthDiff = totalColsWidth + totalBorderWidth;
    this.setupTableWidth(widthDiff, true);
  }

  changeColsWidth(cols, widthDiff) {
    const totalColsWidth = this.constructor.getTotalColsWidth(cols);
    const MIN_CELL_WIDTH = 1;
    cols.forEach((col, index) => {
      const { num, unit } = getValueObject(col.width);
      const percent = num / totalColsWidth;
      const colWidthDiff = widthDiff * percent;
      const value = (num + colWidthDiff) || MIN_CELL_WIDTH;
      col.width = value + unit;
      const cellsToResize = this.getCellsByColumnIndex(index);
      this.constructor.updateColumnCellsWidth(cellsToResize, colWidthDiff);
    });
  }

  updateColumnsWidth(oldTableWidth) {
    const widthDiff = this.getTableWidthDiff(oldTableWidth);
    if (widthDiff) {
      const cols = this.getTableCols();
      this.changeColsWidth(cols, widthDiff);
    } else {
      this.setAttribute('width', `${this.parentNode.offsetWidth * (getValueObject(oldTableWidth).num / 100)}px`);
    }
  }

  update(changedProps) {
    const tableStyleProps = this.constructor.isTableStyleAttrs(changedProps);
    const cellsStyleProps = this.constructor.isCellStyleAttrs(changedProps);
    if (changedProps.get('width') && this.hasAttribute('data-mo-selected')) {
      this.updateColumnsWidth(changedProps.get('width'));
    }
    if (!this.isRendered) {
      this.initTable();
    } else if (this.constructor.isStructureAttr(changedProps)) {
      this.updateTable(changedProps);
    } else if (tableStyleProps) {
      this.setAttribute(tableStyleProps, this[tableStyleProps]);
    } else if (cellsStyleProps) {
      this.setupItemsStyles(cellsStyleProps);
    }
    super.update(changedProps);
  }

  setupItemsStyles(prop) {
    this.getExistCells().forEach((fusionCell) => {
      fusionCell.setAttribute(prop, this[prop]);
    });
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.clearSelectedCells();
    // poor performance here
    this.synchronizeWidth();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.handleListeners();
    this.mutationObserver.disconnect();
  }

  handleListeners(isAdd) {
    const method = isAdd ? 'addEventListener' : 'removeEventListener';
    const { componentName } = this.constructor.options;
    this[method](this.cell.events.resize, this.cellResizeEventHandler);
    this[method](this.cell.events.add, this.cellAddEventHandler);
    this[method](`${componentName}:clear-all-select`, this.clearSelectEventHandler);
    this[method](`${componentName}:run-method`, this.applyMethodEventHandler);
  }

  get dynamicStyles() {
    return html`
      ${super.dynamicStyles}
      :host table td,
      :host table th {
        ${BorderUpdateHandler.getBorderStyles(this)}
      }
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: 0;
          border: none;
          height: auto !important;
        }
        :host table.main-part {
          width: 100%;
          height: 100%;
          border-collapse: var(--border-collapse);
          border-spacing: 0;
          background: var(--background-color);
          border-radius: var(--border-radius);
          padding: unset;
        }
        :host tr:last-child td:first-child {
          border-bottom-left-radius: var(--border-radius);
        }
        :host tr:first-child td:first-child {
          border-top-left-radius: var(--border-radius);
        }
        :host tr:first-child td:last-child {
          border-top-right-radius: var(--border-radius);
        }
        :host tr:last-child td:last-child {
          border-bottom-right-radius: var(--border-radius);
        }
        :host td {
          position: relative;
          padding: 0;
          color: var(--color);
          font-size: var(--font-size);
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        ${this.dynamicStyles}
      </style>
      ${this.table}
      ${this.constructor.systemSlotTemplate}
    `;
  }
}

export { FusionTable };
