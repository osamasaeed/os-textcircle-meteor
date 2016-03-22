Meteor.startup(function () {
// code to run on server at startup
if(!Documents.findOne()){// no documets
    Documents.insert({title:"my new document"});
}
});


Meteor.publish("documents", function(){
return Documents.find({
 $or :[ {isPrivate:{$ne:true}},
        {owner:this.userId}
       ]
  });
});

Meteor.publish("editingUsers", function(){
return EditingUsers.find();
});

Meteor.publish("comments", function(){
return Comments.find();
});
