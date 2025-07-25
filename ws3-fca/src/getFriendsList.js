"use strict";

const utils = require("../utils");
// @NethWs3Dev

// [almost] copy pasted from one of FB's minified file (GenderConst)
const GENDERS = {
  0: "unknown",
  1: "female_singular",
  2: "male_singular",
  3: "female_singular_guess",
  4: "male_singular_guess",
  5: "mixed",
  6: "neuter_singular",
  7: "unknown_singular",
  8: "female_plural",
  9: "male_plural",
  10: "neuter_plural",
  11: "unknown_plural",
};

function formatData(obj) {
  return Object.keys(obj).map(function (key) {
    const user = obj[key];
    return {
      alternateName: user.alternateName,
      firstName: user.firstName,
      gender: GENDERS[user.gender],
      userID: utils.formatID(user.id.toString()),
      isFriend: user.is_friend != null && user.is_friend ? true : false,
      fullName: user.name,
      profilePicture: user.thumbSrc,
      type: user.type,
      profileUrl: user.uri,
      vanity: user.vanity,
      isBirthday: !!user.is_birthday,
    };
  });
}

module.exports = function (defaultFuncs, api, ctx) {
  return function getFriendsList(callback) {
    let resolveFunc = function () {};
    let rejectFunc = function () {};
    const returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, friendList) {
        if (err) {
          return rejectFunc(err);
        }
        resolveFunc(friendList);
      };
    }

    defaultFuncs
      .postFormData(
        "https://www.facebook.com/chat/user_info_all",
        ctx.jar,
        {},
        { viewer: ctx.userID },
      )
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (!resData) {
          throw { error: "getFriendsList returned empty object." };
        }
        if (resData.error) {
          throw resData;
        }
        callback(null, formatData(resData.payload));
      })
      .catch(function (err) {
        utils.error("getFriendsList", err);
        return callback(err);
      });

    return returnPromise;
  };
};