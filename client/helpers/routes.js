UI.registerHelper("currentRouteName",function(){
	return Router.current()?Router.current().route.getName():"";
});

UI.registerHelper("isRouteNameIs",function(routeName){
	if(routeName == Router.current().route.getName()) {
		return true;
	}
	return false;
});