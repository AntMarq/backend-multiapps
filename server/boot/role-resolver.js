// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('teamMember', function(role, context, cb) {
    function reject() {
      console.log('reject' );

      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'project') {
      console.log("target model is not project");
      return reject();
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    console.log('  userId = ' + userId);
    if (!userId) {
      return reject();
    }

    // check if userId is in team table for the given project id
    context.model.findById(context.modelId, function(err, project) {
      console.log('findById bad access : context = ' + context);
      console.log('findById bad access : context.modelId = ' + context.modelId);
      console.log('findById bad access : project = ' + project);
      if (err || !project){
        console.log('erreurkokookoo');
        return reject();
      }

      var Team = app.models.Team;
      console.log('project.ownerId = '+ project.ownerId);
      console.log('userId = '+ userId);

      Team.count({
        ownerId: project.ownerId,
        memberId: userId
      }, function(err, count) {
        if (err) {
          console.log('Team error');
          console.log(err);
          return cb(null, false);
        }
        console.log('count = '+ count);

        cb(null, count > 0); // true = is a team member
      });
    });
  });
};
