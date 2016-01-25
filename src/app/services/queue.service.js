'use strict';

angular.module('cloudnode.service.queue', [
  'cloudnode.structure.queue'
])

.factory('QueueService', function (QueueStruct, $rootScope) {

  var context = '';
  var queueInit = true;
  var currentItemObserver = null;
  var contextObserver = null;

  var QueueService = {

    add: function addToQueue(track, fromContext) {
      if (fromContext === context) {
        var queueObj = createQueueObject(track);
        QueueStruct.add(queueObj);
      }
    },

    addNext: function addToQueueNext(track) {
      var queueObj = createQueueObject(track);
      QueueStruct.addNext(queueObj);
    },

    addToEnd: function addToQueueEnd(track, fromContext) {
      if (fromContext === context){
        var queueObj = createQueueObject(track);
        QueueStruct.addToEnd(queueObj);
      }
    },

    addArray: function addArrayToQueue(trackArr, fromContext) {
      if (fromContext === context) {
        for (var i = trackArr.length - 1; i >= 0; i--) {
          QueueService.add(trackArr[i], fromContext);
        }
      }
    },

    addArrayToEnd: function addArrayToQueueEnd(trackArr, fromContext) {
      if (fromContext === context) {
        for (var i = trackArr.length - 1; i >= 0; i--) {
          QueueService.addToEnd(trackArr[i], fromContext);
        }
      }
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

      if (context === fromContext || context === '')
        return true;
      else
        return false;
    },

    onContextChange: function onContextChange(callback){
      contextObserver = callback;
    },

    removeOnContextChange: function removeOnContextChange() {
      contextObserver = null;
    },

    setContext: function setContext(newContext) {
      context = newContext;
    },

    getContext: function getContext() {
      return context;
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

    queue = contextObserver();

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

  function createQueueObject(item) {
    var queueObject = {
      title: item.title,
      artist: item.user.username,
      artistId: item.user.id,
      id: item.id,
      uuid: item.uuid,
      stream_url: item.uri + '/stream',
      duration: item.duration
    };
    return queueObject;
  }

  return QueueService;
});
