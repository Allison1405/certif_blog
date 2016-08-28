Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]; 
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  limit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().fetch().length === this.limit();
    return {
      posts: this.posts(),
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});
NewPostsListController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment})
  }
});
BestPostsListController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.limit() + this.increment})
  }
});
Router.map(function() {
  this.route('home', {
    path: '/',
    controller: NewPostsListController
  });
  this.route('newPosts', {
    path: '/new/:postsLimit?',
    controller: NewPostsListController
  });
  this.route('bestPosts', {
    path: '/best/:postsLimit?',
    controller: BestPostsListController
  });
  this.route('listFavorites', {
    path: '/fav',
    waitOn: function() {
      return Meteor.subscribe('posts');
      return Meteor.subscribe('userData');
    },  
    data: function() { 
      var user = Meteor.user();
      if (user && typeof user.favorites != 'undefined')
        return Posts.find({_id:{$in:user.favorites}}, {sort: {}}); 
      return null;
    }
  });
  this.route('notFound', {
    path: '*'
  });
});
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
    Meteor.subscribe('singlePost', this.params._id),
    Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/submit', {
  name: 'postSubmit'
});
Router.route('/:postsLimit?', {
  name: 'postsList'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};


Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});



