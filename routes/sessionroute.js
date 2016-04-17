var sessionModel=require("../models/session")

exports.getAllsession = function(req,res){
    var callback = req.query.callback;
    sessionModel.find({},null,{sort: {'_id':-1}},function(err,docs){
        if(err){
            console.log("data load error");
        }
        else{
            var session = {
                "data":[]
            };
            for(var i = 0;i < docs.length; ++i){
                session.data.push(docs[i].session);
            }
            res.send(JSON.stringify(session));
        }
    });
};

exports.getCount= function(req,res){
    var callback = req.query.callback;
    sessionModel.find({},null,{sort: {'_id':-1}},function(err,docs){
        if(err){
            console.log("data load error");
        }
        else{
            data=docs.length;
            res.send(JSON.stringify(data));
        }
    });
};

exports.getListByName = function (req,res) {
    var name = req.query.name;
    var callback = req.query.callback;
    sessionModel.findOne({session:name}, function (err,docs) {
        if(err){
            console.log("data load error");
        }else{
            if(docs==null)
            {
                res.send("none");
            }
            var session = {
                "playlist":[]
            };
            for(var i = 0;i < docs.playlist.length; ++i){
                session.playlist.push(docs.playlist[i]);
            }
            res.send(JSON.stringify(session));
            //res.jsonp(JSON.stringify(event));
        }
    });
};

exports.register = function (req,res) {
    var name = req.body.name;
    console.log("name="+name);
    sessionModel.findOne({session:name}, function (err,docs) {
        if(err)
            console.log("data load err");
        if(docs){
            res.send('exists');
        }else{
            var newUser = new sessionModel({session:name,playlist:[]});
            newUser.save(function (err) {
                if(err){
                    console.log(err);
                    res.send('error');
                }else{
                    //req.session.user = docs;
                    res.send('success');
                }
            });
        }
    });
};

exports.addSession = function (req,res) {
  var name = req.body.session;
  var events = req.body.events;
  if(!Array.isArray(events)){
      events = events.split(",");
  }
  sessionModel.update({session:name}, {"$addToSet":{"playlist":{"$each":events}}},function (err,docs) {
      if(err)
        console.log(err);
      else{
          res.send("success");
      }
  });
};

exports.clearAll = function (req,res) {
  var name = req.body.session;
  //console.log(name);
  sessionModel.remove({session:name},function(err,docs)
  {
    if(err)
    {
        console.log(err);
    }
  });
  //console.log("remove");
        var newUser = new sessionModel({session:name,playlist:[]});
        newUser.save(function (err) {
            if(err){
                console.log(err);
                res.send('error');
                }else{
                res.send('success');
                }
        });

};