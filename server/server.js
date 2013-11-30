Votes = new Meteor.Collection('votes');

Meteor.publish('members', function() { return Members.find(); });
Meteor.publish('vkmembers', function() { return VKMembers.find(); });

var CanVote = Match.Where(function(ip) {
	if (Meteor.absoluteUrl().indexOf('localhost') == 7)
		return true; // debug purposes
	check(ip, String);
	if (ip.length > 0) {
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return Votes.find({ ip: ip, date: { $gt: yesterday } }).count() == 0;
	}
	return false;
});

Meteor.methods({
	canVote: function() {
		return Match.test(headers.get('x-forwarded-for'), CanVote);
	},
	vote: function(memberId) {
		check(memberId, String);
		check(headers.get('x-forwarded-for'), CanVote);
		var voteId = Votes.insert({	memberId: memberId,	ip: headers.get('x-forwarded-for'), date: new Date() });
		Members.update(memberId, { $set: { vote: Votes.find({ memberId: memberId }).count() } });
		return voteId;
	},
	getMemberVotes: function(memberId) {
		check(memberId, String);
		return Votes.find({memberId:memberId}).count();
	},
	getTotalVotes: function() {
		return Votes.find().count();
	}
});

Meteor.startup(function () {
	if (Members.find().count() === 0) {
		Members.insert({ name: 'Александра Богинич', title: 'Александру', url: 'http://mariels.ru/member/profile_alexandra_igorevna.html', photo: 'images/member/Александра Богинич.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_450_1136_94.jpg', vote: 0 });
		Members.insert({ name: 'Алена Мансурова', title: 'Алену', url: 'http://mariels.ru/member/profile_Alionushka.html', photo: 'images/member/Алена Мансурова.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_444_1120_90.jpg', vote: 0 });
		Members.insert({ name: 'Анна Кожевникова', title: 'Анну', url: 'http://mariels.ru/member/profile_%D0%B0%D0%BD%D1%8E%D1%82%D0%B0.html', photo: 'images/member/Аня Кожевникова.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_447_1129_52.jpg', vote: 0 });
		Members.insert({ name: 'Анна Гавриченко', title: 'Анну', url: 'http://mariels.ru/member/profile_Ann.html', photo: 'images/member/Гавриченко Анна.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_441_1115_4.jpg', vote: 0 });
		Members.insert({ name: 'Настя Смирнова', title: 'Настю', url: 'http://mariels.ru/member/profile_Nastenka.html', photo: 'images/member/Смирнова Настя.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_445_1122_42.jpg', vote: 0 });
		Members.insert({ name: 'Таня Федорова', title: 'Таню', url: 'http://mariels.ru/member/profile_%D0%A2%D0%B0%D0%BD%D1%8E%D1%88%D0%B0.html', photo: 'images/member/Таня Федорова.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_443_1133_17.jpg', vote: 0 });
		Members.insert({ name: 'Марина Чекулаева', title: 'Марину', url: 'http://mariels.ru/member/profile_MarinaChe.html', photo: 'images/member/Марина Чекулаева.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_449_1134_79.jpg', vote: 0 });
		Members.insert({ name: 'Алина Креклина', title: 'Алину', url: 'http://mariels.ru/member/profile_%D0%90%D0%BB%D0%B8%D0%BD%D0%B0.html', photo: 'images/member/Алина Креклина.jpg', thumb: 'http://mariels.ru/$userfiles/thumb_379_1113_94.jpg', vote: 0 });
	}
});	