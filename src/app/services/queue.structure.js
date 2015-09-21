'use strict';

angular.module('cloudnode.structure.queue', [
  ])

.factory('QueueStruct', function () {

  var Node = function(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  };


  var Queue = {};

  Queue.first   = null;
  Queue.last    = null;
  Queue.size    = 0;
  Queue.current = null;

  Queue.empty = function emptyQueue() {
    Queue.first   = null;
    Queue.last    = null;
    Queue.size    = 0;
    Queue.current = null;
  };

  Queue.add = function addToQueue(track) {
    var node  = new Node(track);

    if (Queue.first !== null) {
      node.next         = Queue.first;
      Queue.first.prev  = node;
    }

    Queue.first = node;
    Queue.size++;
  };

  Queue.addArray = function addArrayToQueue(trackArr) {
    for (var i = trackArr.length - 1; i >= 0; i--) {
      Queue.add(trackArr[i]);
    }
  };

  Queue.getCurrent = function getCurrent() {
    return Queue.current.data;
  };

  Queue.setCurrent = function setCurrent(item) {
    Queue.current = Queue.find(item);
  };

  Queue.getNext = function getNext() {
    if (Queue.current !== Queue.last) {
      Queue.current = Queue.current.next;
      return Queue.current.data;
    }
    return null;
  };

  Queue.getPrevious = function getPrevious() {
    if (Queue.current !== Queue.first) {
      Queue.current = Queue.current.prev;
      return Queue.current.data;
    }
    return null;
  };

  Queue.getSize = function getSize() {
    return Queue.size;
  };

  Queue.find = function findNode(item) {
    var node = Queue.first;

    while(node.next) {
      if (node.data.uuid === item.uuid) {
        return node;
      }
      node = node.next;
    }
  };

  Queue.remove = function removeFromQueue(trackId) {
    var node = Queue.find({uuid: trackId});

    if (node !== null) {

      // Node was first node
      if (node.prev === Queue.first)
        Queue.first = node.next;

      if (node.prev !== null)
        node.prev.next = node.next;

      if (node.next !== null)
        node.next.prev = node.prev;

      if (node === Queue.last)
        Queue.last = node.prev;

      if (node === Queue.current && node.next !== null)
        Queue.current = node.next;
      else
        Queue.current = node.prev;

      Queue.size--;

      return node;
    }
    return null;
  };

  return Queue;
});
