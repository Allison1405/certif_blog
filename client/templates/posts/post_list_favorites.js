Template.listFavorites.helpers({
    favorites: function() {
    	var user = Meteor.user();
        return Posts.find({_id: {$in:user.favorites}}, {sort:{votes:-1, _id: -1}});
    }
});
