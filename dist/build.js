!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e(require("remotestoragejs"));else if("function"==typeof define&&define.amd)define(["remotestoragejs"],e);else{var n=e("object"==typeof exports?require("remotestoragejs"):t.RemoteStorage);for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(this,function(t){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s=n(1);s.defineModule("chat-messages",function(t,e){var n={type:"object",properties:{"@context":{type:"string",default:"https://kosmos.org/ns/v1",enum:["https://kosmos.org/ns/v1"]},"@id":{type:"string",required:!0},"@type":{type:"string",default:"ChatChannel",enum:["ChatChannel"]},name:{type:"string",required:!0},ircURI:{type:"string",format:"uri"},xmppURI:{type:"string",format:"uri"},today:{type:"object",properties:{"@id":{type:"string",pattern:"^[0-9]{4}/[0-9]{2}/[0-9]{2}$",required:!0},"@type":{type:"string",default:"ChatLog",pattern:"^ChatLog$"},messageType:{type:"string",default:"InstantMessage",pattern:"^InstantMessage$"},previous:{type:"string",pattern:"^[0-9]{4}/[0-9]{2}/[0-9]{2}$"},next:{type:"string",pattern:"^[0-9]{4}/[0-9]{2}/[0-9]{2}$"},messages:{type:"array",required:!0,items:{type:"object",properties:{date:{type:"string",format:"date-time"},user:{type:"string"},text:{type:"string"},type:"string",default:"text",enum:["text","join","leave","action"]}}}}}},required:[]};t.declareType("daily-archive","https://kosmos.org/ns/v1",n),e.declareType("daily-archive","https://kosmos.org/ns/v1",n);var a=function(n){if(n.isPublic=n.isPublic||!1,"object"!==("undefined"==typeof n?"undefined":i(n)))throw"options must be an object";if("object"!==i(n.server)||"string"!=typeof n.server.type||"string"!=typeof n.server.name)throw'server must be an object containing at least server "type" and "name"';if("string"!=typeof n.channelName)throw"channelName must be a string";if(!(n.date instanceof Date))throw"date must be a date object";if("boolean"!=typeof n.isPublic)throw"isPublic must be a boolean value";switch(this.server=n.server,this.channelName=n.channelName,this.date=n.date,this.isPublic=n.isPublic,this.parsedDate=h(this.date),this.dateId=this.parsedDate.year+"/"+this.parsedDate.month+"/"+this.parsedDate.day,this.server.type){case"irc":if(this.channelName.match(/^#/)){var r=this.channelName.replace(/^#/,"");this.path=this.server.name+"/channels/"+r+"/"+this.dateId}else this.path=this.server.name+"/users/"+this.channelName+"/"+this.dateId;break;default:this.path=this.server.name+"/"+this.channelName+"/"+this.dateId}this.client=this.isPublic?e:t,this.previous=n.previous,this.next=n.next};a.prototype={addMessage:function(t){var e=this;return this.isPublic&&!this.channelName.match(/^#/)?Promise.resolve(!1):(t.type=t.type||"text",this.client.getObject(this.path).then(function(n){return"object"===("undefined"==typeof n?"undefined":i(n))?e._updateDocument(n,t):e._createDocument(t)}))},addMessages:function(t,e){var n=this;return this.isPublic&&!this.channelName.match(/^#/)?Promise.resolve(!1):(e=e||!1,t.forEach(function(t){t.type=t.type||"text"}),e?this._createDocument(t):this.client.getObject(this.path).then(function(e){return"object"===("undefined"==typeof e?"undefined":i(e))?n._updateDocument(e,t):n._createDocument(t)}))},remove:function(){return this.client.remove(this.path)},_updateDocument:function(t,e){return s.log("[chat-messages] Updating archive document",t),Array.isArray(e)?e.forEach(function(e){t.today.messages.push(e)}):t.today.messages.push(e),this._sync(t)},_createDocument:function(t){var e=this;s.log("[chat-messages] Creating new archive document");var n=this._buildArchiveObject();return Array.isArray(t)?t.forEach(function(t){n.today.messages.push(t)}):n.today.messages.push(t),this.previous||this.next?(this.previous&&(n.today.previous=this.previous),this.next&&(n.today.next=this.next),this._sync(n)):this._updatePreviousArchive().then(function(t){return"object"===("undefined"==typeof t?"undefined":i(t))&&(n.today.previous=t.today["@id"]),e._sync(n)})},_buildArchiveObject:function(){var t=this.channelName.replace(/#/,""),e={"@id":"chat-messages/"+this.server.name+"/channels/"+t+"/","@type":"ChatChannel",name:this.channelName,today:{"@id":this.dateId,"@type":"ChatLog",messageType:"InstantMessage",messages:[]}};switch(this.server.type){case"irc":this.channelName.match(/^#/)||(e["@id"]="chat-messages/"+this.server.name+"/users/"+this.channelName+"/"),e.ircURI=this.server.ircURI+"/"+t;break;case"xmpp":e.xmppURI="xmpp:"+this.channelName+"@"+this.server.xmppMUC}return e},_updatePreviousArchive:function(){var t=this;return this._findPreviousArchive().then(function(e){if("object"===("undefined"==typeof e?"undefined":i(e))&&e.today){e.today.next=t.dateId;var n=t.path.substring(0,t.path.length-t.dateId.length)+e.today["@id"];return t.client.storeObject("daily-archive",n,e).then(function(){return s.log("[chat-messages] Previous archive written to remote storage",n,e),e})}return s.log("[chat-messages] Previous archive not found"),!1})},_findPreviousArchive:function(){var t=this,e=this.path.substring(0,this.path.length-2),n=this.path.substring(0,this.path.length-5),i=this.path.substring(0,this.path.length-10);return this.client.getListing(e).then(function(s){var a=Object.keys(s).map(function(t){return parseInt(t)}).map(function(e){return e<parseInt(t.parsedDate.day)?e:null}).filter(function(t){return null!=t});if(a.length>0){var h=o(Math.max.apply(Math,r(a)).toString());return t.client.getObject(e+h)}return t.client.getListing(n).then(function(e){var s=Object.keys(e).map(function(t){return parseInt(t.substr(0,2))}).map(function(e){return e<parseInt(t.parsedDate.month)?e:null}).filter(function(t){return null!=t});if(s.length>0){var a=o(Math.max.apply(Math,r(s)).toString());return t.client.getListing(n+a+"/").then(function(e){var i=Object.keys(e).map(function(t){return parseInt(t)}),s=o(Math.max.apply(Math,r(i)).toString());return t.client.getObject(n+a+"/"+s)})}return t.client.getListing(i).then(function(e){var n=Object.keys(e).map(function(t){return parseInt(t.substr(0,4))}).map(function(e){return e<parseInt(t.parsedDate.year)?e:null}).filter(function(t){return null!=t});if(n.length>0){var s=Math.max.apply(Math,r(n)).toString();return t.client.getListing(i+s+"/").then(function(e){var n=Object.keys(e).map(function(t){return parseInt(t.substr(0,2))}),a=o(Math.max.apply(Math,r(n)).toString());return t.client.getListing(i+s+"/"+a+"/").then(function(e){var n=Object.keys(e).map(function(t){return parseInt(t)}),h=o(Math.max.apply(Math,r(n)).toString());return t.client.getObject(i+s+"/"+a+"/"+h)})})}return!1})})})},_sync:function(t){return s.log("[chat-messages] Writing archive object",t),this.client.storeObject("daily-archive",this.path,t).then(function(){return s.log("[chat-messages] Archive written to remote storage"),!0},function(t){return console.log("[chat-messages] Error trying to store object",t),t})}};var o=function(t){return t=String(t),1===t.length&&(t="0"+t),t},h=function(t){return{year:t.getUTCFullYear(),month:o(t.getUTCMonth()+1),day:o(t.getUTCDate())}},c={DailyArchive:a,privateClient:t,publicClient:e};return{exports:c}})},function(e,n){e.exports=t}])});