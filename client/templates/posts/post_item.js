Template.postItem.helpers({
  ownPost: function() {
    return this.userId === Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  fullText: function() {
    return this.fullText;
  },
  resume: function() {
    return this.resume;
  },
  shortResume: function() {
    var resume = this.resume;
    if(resume.length > 200) {
      resume = resume.substring(0, 200) + "...";
    }
    return resume;
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.contains(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  },
  favoredClass: function() {
    var user = Meteor.user();
    console.log(this._id);
    console.log(user.favorites);
    console.log('contains : '+_.contains(user.favorites, this._id));
    if (user != null && true == _.contains(user.favorites, this._id)) {
      return 'btn-warning';
    } 
    else {
      return 'btn-default';
    }
  }
});

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
  'click .favorite': function(e) {
    e.preventDefault();
    Meteor.call('favorite', this._id);
  }
});