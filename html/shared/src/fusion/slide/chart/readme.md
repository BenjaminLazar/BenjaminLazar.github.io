# Fusion Chart

### Props

* `this['show-labels']` - Show labels on each data points. 
* `this['show-legend']` - Show legend.
* `this['legend-position']` - Change the position of legend. Currently bottom, right and inset are supported..
* `this['x-axis-type']` - Set type of x axis (category or indexed).
* `this['x-axis-tick-rotate']` - Rotate x axis tick text. If you set negative value, it will rotate to opposite direction.
* `this['x-axis-tick-height']` - Height of x axis tick.
* `this['show-grid']` - Show grids along all axis.
* `this['show-line-point']` - Whether to show each point in line.
* `this['x-axis-label-text'] and this['y-axis-label-text']` - Set label on x(y) axis.
* `this['x-axis-label-position'] and this['x-axis-label-position']` - Set position for label on x(y) axis.
* `this['axis-rotate']` - Switch x and y axis position.

### Localization
When you want to change localization for the chart, you can use prepared localization files, they contain correct currency symbol placing and separators for thousands and decimals numbers. But, if you need some exclusive, you can use the file in `./chart/locale/custom.json`. In this file, you can configure custom localization for the chart.

`How it should use:`
```
{
  "decimal": ",", - the decimal point (e.g., ".")
  "thousands": ".", - the group separator (e.g., ",").
  "grouping": [3], - the array of group sizes (e.g., [3]), cycled as needed.
  "currency": ["", "\u00a0₴."], - the currency prefix and suffix (e.g., ["$", ""]).
  "numerals" : ["\u0660", "\u0661", "\u0662", "\u0663", "\u0664", "\u0665", "\u0666", "\u0667", "\u0668", "\u0669"], - optional; an array of ten strings to replace the numerals 0-9.
  "percent": "\u202f%" - optional; the percent suffix (defaults to "%").
}
```

