headers = {
	list: {},
	get: function(header, callback) {
		return header ? this.list[header] : this.list;
	},
	getClientIP: function(proxyCount) {
		var chain = this.list['x-ip-chain'].split(',');
		proxyCount = proxyCount ? proxyCount + 1 : 1;
		return chain[chain.length - proxyCount];
	}
}

// This is the best all-round solution.  But we might consider only fetching the required headers, when needed,
 // with callbacks, and caching the result for future calls.  At time of writing, this is unneeded.
Meteor.call('getReqHeaders', function(error, result) {
	headers.list = result;
});
