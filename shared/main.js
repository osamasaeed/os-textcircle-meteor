Meteor.methods({
  addComment:function(comment){
          console.log("post a comment : "+this.userId);
    if (this.userId){
   comment.ownerId= this.userId;
      //comment.createdOn = new Date();
     // comment.userId = this.userId;
      return Comments.insert(comment);
    }
    return;
  },
  addDoc:function(){
    var doc;
    if (!this.userId){
      return;
    } else{
      doc = {owner:this.userId, createdOn:new Date(),title:"my new doc"};
    var id = Documents.insert(doc);
    return id;
    }

  },
  updateDocPrivacy:function(doc){
    console.log(Meteor.userId);
    console.log(this.userId);
   // console.log(this.user._id);
   // console.log(Meteor.user()._id);
    var realDoc = Documents.findOne({_id:doc._id, owner:this.userId});
   //console.log(realDoc);

    if(realDoc){
  realDoc.isPrivate = doc.isPrivate;
  Documents.update({_id:doc._id} , realDoc);
    }
  },
  addEditingUser:function(docid){
        var doc, user, eusers;
        doc = Documents.findOne({_id:docid});
        if(!doc){return;}/// no doc give up
        if(!this.userId){return;}
        // now Ihave a doc and possiibly a user
        user = Meteor.user().profile;
        eusers = EditingUsers.findOne({docid:doc._id});
        if(!eusers){
          eusers = {
              docid:doc._id,
              users:{},                                                                  
          };
        }
        user.lastEdit = new Date();
        eusers.users[this.userId] = user;
                EditingUsers.upsert({_id:eusers._id},eusers);

  }
});
