contestEndDate = new Date('01/30/2014 00:31');
//contestEndDate = new Date('11/30/2013 12:00');

/** COLLECTIONS **/
Meteor.subscribe('members');
Meteor.subscribe('vkmembers');

/** SESSION **/
Session.set('inProgress', new Date() < contestEndDate);
Session.setDefault('voted', false);
Session.setDefault('vkGroupUsers', null);
Session.setDefault('totalVotes', 0);

Meteor.startup(function() {
	Deps.autorun(function() {
		var total = 0;
		Members.find().forEach(function(m) { total += m.vote; });
		Session.set('totalVotes', total);
	});
});

/** TEMPLATES **/
Template.header.contestInProgress =
Template.page.contestInProgress = 
Template.footer.contestInProgress = function() {
	return Session.get('inProgress');
}

Template.members.members = function() {
	return Members.find({}, { sort: { vote: -1 }});
}

Template.members.events = {
	'click button': function(event) {
			var $btn = $(event.currentTarget);
			Session.set('voted', true);
			Meteor.call('vote',	$btn.data('id'), function(error, vote) {
				if (error) {		
					Session.set('voted', false);
				}
			});
		}
}

Template.members.voted = function() {
	return Session.get('voted');
}

Template.winner.winner = function() {
	return Members.findOne({}, { sort: { vote: -1 } });
};

Template.winner.second = function() {
	return Members.findOne({}, { sort: { vote: -1 }, skip: 1 });
};

Template.ratings.members = function() {
	return Members.find({}, {limit: 5, sort: { vote: -1 }});
};

Template.ratings.votes = 
Template.footer.votes = function() {
	return Session.get('totalVotes');
};

Template.social.users = function() {
	return VKMembers.find();
}

/** STARTUP **/
Meteor.startup(function() {
	
	// load css
	try {
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.id   = 'onload';
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = '/stylesheets/onload.css';
		link.media = 'screen';
		head.appendChild(link);
	} catch (err ) { }
	
	Meteor.call('canVote', function(e, can) {
		if (!e)	Session.set('voted', !can);
	});
	
	// Ratings
	Deps.autorun(function() {
		var top = Members.findOne({}, { sort: { vote: -1 }});
		// update ratings chart
		Members.find({}, { sort: { vote: -1 }, limit: 5 }).forEach(function(m, i) {
			var height = top ? Math.floor((m.vote / top.vote) * 190) + 100 : 100;
			$('.rating.num'+(i+1)).css('height', height);
		});
	});
	
	// Countdown 
	var targetDate = contestEndDate;
	var currentDate = new Date();
	var offsetSeconds = (targetDate.getTime() - currentDate.getTime()) / 1000;
	offsetSeconds = Math.max(0, offsetSeconds);
	var clock = $('#countdown').FlipClock(offsetSeconds, {
		clockFace: 'DailyCounter',
		defaultClockFace: 'DailyCounter',
		countdown: true,
		callbacks: {
			stop: function() {
				Session.set('inProgress', false);
			}
		}
	});
	
	Meteor.call('updateVKMembers');
	
	// Performs a smooth page scroll to an anchor on the same page.
	// @source http://css-tricks.com/snippets/jquery/smooth-scrolling/
	$('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
	        || location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	});
	
});
