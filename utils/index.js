var functions = {
  getUserMentionsFromComment: function(commentBody) {
    console.log(commentBody);
    return new Promise(function(resolve, reject) {
      //let userMentions = commentBody.match(/(\[~[\S]+\])/g)
      let userMentions = commentBody.match(/(\[~[a-zA-Z0-9\.:\.-]+\])/g)
      console.log ('Got '+userMentions.length);
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
