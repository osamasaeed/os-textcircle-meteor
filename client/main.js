Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");



Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navbar',{ to:"header"});
  this.render('docList',{ to:"main"});
});
      
Router.route('/documents/:_id', function () {
  this.render('navbar',{ to:"header"});
  Session.set("docid",this.params._id);
  this.render('docItem',{ to:"main"});
});



Template.editor.helpers({
  docid:function(){
    setupCurrentDocument();
    return Session.get("docid");
 },
 config:function(){
  return function(editor){
    editor.setOption("lineNumbers",true);
    editor.setOption("theme","cobalt");
    editor.on("change",function(cm_editor,info){
$("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
    Meteor.call("addEditingUser",Session.get("docid"));
    });
  }

 }

});

Template.editingUsers.helpers({
  users:function(){
    var doc, eusers, users;
    doc = Documents.findOne({_id:Session.get("docid")});
    if(!doc){return ;}// give up
    eusers = EditingUsers.findOne({docid:doc._id});
    if(!eusers){return;} // give up
    users = new Array();
    var i = 0;
    for(var user_id in eusers.users){
      users[i] = fixObjectKeys(eusers.users[user_id]);
      i++;
    }

    return users;
  }
});



Template.navbar.helpers({
documents:function(){
  return Documents.find();
}
});

Template.docMeta.helpers({
document:function(){
return Documents.findOne({_id:Session.get("docid")});
},
canEdit:function(){
var doc;
doc = Documents.findOne({_id:Session.get("docid")});
if (doc){
  if (doc.owner == Meteor.userId()){
    return true;
  }
}
return false;
}
});

Template.editableText.helpers({
userCanEdit : function(doc,Collection){
// can edit if the current doc is owned by me.
doc = Documents.findOne({_id:Session.get("docid"),owner:Meteor.userId()});
if (doc){
  return true;
}else {
  return false;
}
}
});

Template.docList.helpers({
documents:function(){
  return Documents.find();
}
});


Template.insertCommentForm.helpers({
  docid:function(){
    return Session.get("docid");
  }
});

Template.commentList.helpers({
  comments:function(){
    return Comments.find({docid:Session.get("docid")});
  }
});

Template.docList.helpers({
documents:function(){
  return Documents.find();
}
});

Template.docList.events({
"click .js-add-comments":function(){
  console.log("fire");
  Meteor.call("addComment");
}
});




Template.docMeta.events({
  "click .js-tog-private":function(event){
   // console.log(event.target.checked);
    var doc = {_id:Session.get("docid") , isPrivate:event.target.checked};
    Meteor.call("updateDocPrivacy",doc);
  } 
});
Template.navbar.events({
  "click .js-add-doc":function(event){
    event.preventDefault();
    if (!Meteor.user()){
      alert("Please! login first");
    } else {
      Meteor.call("addDoc",function(err,res){
        if (!err){
      Session.set("docid",res);          }
      });
    }
  },
  "click .js-load-doc":function(event){
            Session.set("docid",this._id);          

  }
});



function setupCurrentDocument(){
  var doc;
  if (!Session.get("docid")){ // no docid
doc = Documents.findOne();
if (doc){
  Session.set("docid", doc._id);
    }
  }
}


function fixObjectKeys(obj){
var newObj = {};
for(key in obj){
var key2 = key.replace("-","");
newObj[key2] = obj[key];
}
return newObj;
}
