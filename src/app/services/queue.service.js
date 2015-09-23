'use strict';

angular.module('cloudnode.service.queue', [
  'cloudnode.structure.queue'
])

.factory('QueueService', function (QueueStruct, $rootScope) {

  var context = '';
  var contextObservers = [];
  var queueInit = true;
  var currentItemObserver = null;

  var QueueService = {

    add: function addToQueue(track, fromContext) {
      if (fromContext === context) {
        QueueStruct.add(track);
      }
    },

    addToEnd: function addToQueueEnd(track, fromContext) {
      if (fromContext === context)
        QueueStruct.addToEnd(track);
    },

    addArray: function addArrayToQueue(trackArr, fromContext) {
      if (fromContext === context)
        QueueStruct.addArray(trackArr);
    },

    addArrayToEnd: function addArrayToQueueEnd(trackArr, fromContext) {
      if (fromContext === context)
        QueueStruct.addArrayToEnd(trackArr);
    },

    setCurrent: function setCurrentQueueItem(item, ignoreStruct) {
      if (!ignoreStruct)
        QueueStruct.setCurrent(item);

      if (currentItemObserver !== null)
        currentItemObserver(item);
    },

    getCurrent: function getCurrentQueueItem() {
      return QueueStruct.getCurrent();
    },

    onCurrentItemChange: function onCurrentItemChange(callback) {
      currentItemObserver = callback;
    },

    removeCurrentItemChangeListener: function removeCurrentItemChangeListener(){
      currentItemObserver = null;
    },

    getNext: function getNextQueueItem() {
      var item = QueueStruct.getNext();

      this.setCurrent(item, true);

      return item;
    },

    getPrevious: function getPreviousQueueItem() {
      var item = QueueStruct.getPrevious();

      this.setCurrent(item, true);

      return item;
    },

    canAddToQueue: function canAddToQueue(fromContext) {
      if (queueInit)
      {
        queueInit = false;
        return true;
      }

      if (context === fromContext)
        return true;
      else
        return false;
    },

    onContextChange: function onContextChange(context, callback){
      contextObservers.push({context: context, callback: callback});
    },

    removeOnContextChange: function removeOnContextChange(context) {
      for (var i = contextObservers.length - 1; i >= 0; i--) {
        if (contextObservers[i].context === context)
          delete contextObservers[i];
      }
    },

    setContext: function setContext(newContext) {
      context = newContext;
    },

    removeFromQueue: function removeFromQueue(track) {
      return QueueStruct.remove(track);
    },

    emptyQueue: function emptyQueue() {
      QueueStruct.empty();
    },

    getQueue: function getQueue() {
      return QueueStruct.getQueue();
    }

  };

  function callContextObserver(context, track){
    var queue = [];
    for (var i = contextObservers.length - 1; i >= 0; i--) {

      if (contextObservers[i].context === context){
        queue = contextObservers[i].callback();
        break;
      }
    }

    QueueService.emptyQueue();
    QueueService.setContext(context);
    QueueService.addArray(queue, context);
    QueueService.setCurrent(track);
  }

  $rootScope.$on('queue.check', function (event, args){
    if (QueueService.canAddToQueue(context)) {
      callContextObserver(args.context, args.item);
    } else {
      QueueService.setCurrent(args.item);
    }
  });



  return QueueService;
});
