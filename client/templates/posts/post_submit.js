Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      resume: $(e.target).find('[name=resume]').val(),
      fullText: $(e.target).find('[name=fullText]').val(),
    };

    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);

    Meteor.call('postInsert', post, function(error, result) {
      // affiche l'erreur à l'utilisateur et s'interrompt
      if (error)
        return throwError(error.reason);

      // affiche ce résultat mais route quand même
      if (result.postExists)
        throwError('A similar post is already in the database. Try to change the title of your post.');

      Router.go('postPage', {_id: result._id});
    });
  }
});

Template.postSubmit.created = function() {
  Session.set('postSubmitErrors', {});
}

Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});