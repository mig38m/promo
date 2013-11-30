Members = new Meteor.Collection('members');
VKMembers = new Meteor.Collection('vkmembers');

/** UTILITY METHODS **/
Meteor.methods({
	updateVotes: function() {
		Members.find().forEach(function(m) {
			Members.update(m._id, { $set: { vote: Votes.find({ memberId: m._id }).count() } });
		});
	},
	updateThumb: function(memberId, thumb) {
		check(memberId, String);
		check(thumb, String);
		Members.update(memberId, { $set: { thumb: thumb } });
	},
	updateUrls: function() {
		Members.find().forEach(function(m) {
			if (m.url.indexOf('?aff_id') == -1) {
				Members.update(m._id, { $set: { url: m.url+'?aff_id=1' } });
			}
		});
	},
	updateVKMembers: function() {
		HTTP.get('https://api.vk.com/method/groups.getMembers', {
			params: { group_id: 57779695, sort: 'time_desc', count: 100	} 
		}, function(error, r) {
			if (error) {
				console.log(error);
				return;
			}
			HTTP.get('https://api.vk.com/method/users.get', {
				params: { user_ids: r.data.response.users.join(','), fields: 'screen_name,photo_100' }
			}, function(error, r) {
				if (error) {
					console.log(error);
					return;
				}
				_.each(r.data.response, function(member) {
					if (member.deactivated || 
						member.photo_100 == 'http://vk.com/images/camera_b.gif')
						return;
					member._id = member.uid;
					VKMembers.upsert(member.uid, member);
				});
			});
		});
	}
})