Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});
Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title', 'resume', 'fullText').length > 0);
  }
});
Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
      var errors = validatePost(modifier.$set);
      return errors.title || errors.url;
    }
});

validatePost = function (post) {
  var errors = {};
  if (!post.title)
    errors.title = "Veuillez renseigner le titre";
  if (!post.url)
    errors.url = "Veuillez renseigner l'URL";
  return errors;
}

Meteor.methods({
    postInsert: function(postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            title: String,
            url: String,
            resume: String,
            fullText: String
        });

        var errors = validatePost(postAttributes);
        if (errors.title || errors.url)
            throwError("Title and URL are required.");


        var postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        var user = Meteor.user();
        // vérifier qu'il n'y a pas d'articles déjà existant avec le même lien
        if (postAttributes.url && postWithSameLink) {
          throwError('[302] This link has already been posted');
        }

        // pick out the whitelisted keys
        var post = _.extend(_.pick(postAttributes, 'url', 'title', 'resume', 'fullText', 'message'), {
          userId: user._id, 
          author: user.username, 
          submitted: new Date().getTime(),
          commentsCount: 0,
          upvoters: [], 
          votes: 0
        });

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },  
    upvote: function(postId) {
      var user = Meteor.user();
      // ensure the user is logged in
      if (!user)
        throwError("[401] Vous devez vous connecter pour upvoter le lien");
      var post = Posts.findOne(postId);
      if (!post)
        throwError('[422] Sujet non trouvé');
      if (_.include(post.upvoters, user._id))
        throwError('[422] Vous avez déjà upvoté ce sujet.');
      Posts.update(
        {
          _id: postId, 
          upvoters: {$ne: user._id}
        }, 
        {
          $addToSet: {upvoters: user._id},
          $inc: {votes: 1}
        }
      );
    },
    favorite: function(postId) {
      var user = Meteor.user();
      // ensure the user is logged in
      if (!user)
        throwError("[401] You must log in to put this post in your favorites");
      var post = Posts.findOne(postId);
      if (!post)
        throwError('[422] Post not found');
      if (_.contains(user.favorites, post._id)) 
        throwError('[422] This post is already in your favorites');
      
      Meteor.users.update(
        {_id : Meteor.userId()},
        {
          $addToSet: {'favorites': post._id},
        }
      );
    }
});