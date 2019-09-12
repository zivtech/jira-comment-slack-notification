var functions = {
  getUserMentionsFromComment: function(commentBody) {
    console.log(commentBody);
    return new Promise(function(resolve, reject) {
      let userMentions = commentBody.match(/(\[~[\S]+\])/g)
      if (userMentions.length > 0) {
        return resolve(userMentions)
      } else {
        return reject(false)
      }
    });
  },
  addJiraMarkupToUsername: function(username) {
    return `[~${username}]`
  },
  stripJiraMarkupFromUsername: function(username) {
    return username.split('[~')[1].split(']')[0]
  },
  stripJiraMarkupAccountFromUsername: function(username) {
    return username.split('[~accountid:')[1].split(']')[0]
  }
}

module.exports = functions;
