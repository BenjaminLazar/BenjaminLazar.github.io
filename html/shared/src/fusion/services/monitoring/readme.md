#Veeva Monitoring

In `config.json` we have object `veevaMonitoring` with fields `types` and `excludedTypes`. This is general config. Here we can add/remove custom types which we want to see in monitoring to `types` field, add excluded types (they won't be submitted to salesforce) to `excludedTypes` field. Both fields should be array.
In `analytics.json` we have all our monitoring data which should be submitted to salesforce.

`VeevaMonitoring` core service for tracking data in veeva salesforce.
For tracking 'slide', 'popup' or some another type where we should have usage duration we have methods:
    -`VeevaMonitoring.trackSlideEnter({id: xxx});` 
After this method was called service will start to watch time on this element.
    -`VeevaMonitoring.trackSlideExit({id: xxx});` 
After this method was called service will calc time spent on this element and submit. 
For tracking data without usage duration need t ouse next method:
    -`VeevaMonitoring.trackCustomData({id: xxx});`    
 `'xxx'` is  Vault name (for slides) or element DOM id (for popups, states etc). 
 
 `VeevaMonitoring` creates instance of `MonitoringItem` with data needed for clickstream creation and rest data for inner calculations.
 `MonitoringItem` creates instance of `ClickStream` with data which should be submitted to salesforce.
 
 In general we have next structure `one VeevaMonitoring -> many MonitoringItem` and `one MonitoringItem -> one ClickStream`
 
 If we need to extend `VeevaMonitoring` we can extend class for example `class VeevaMonitoring2 extends VeevaMonitoring` and call function `VeevaMonitoring.createInstance(VeevaMonitoring2)`.This is input gate for assigning  own extended class instead of default. This call should be done before `DOMContentLoaded` event in runtime as after that event `VeevaMonitoring` class will create default own instance.
 
 If we need to extend `MonitoringItem` or `ClickStream` we can extend classes.
 
 Extending `ClickStream` requires extending `MonitoringItem` and redefinition `VeevaMonitoring.generateMonitoringItem` method.
