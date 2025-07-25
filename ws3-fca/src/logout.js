"use strict";

const utils = require("../utils");
// @NethWs3Dev

module.exports = function (defaultFuncs, api, ctx) {
  return function logout(callback) {
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

    const form = {
      pmid: "0",
    };

    defaultFuncs
      .post(
        "https://www.facebook.com/bluebar/modern_settings_menu/?help_type=364455653583099&show_contextual_help=1",
        ctx.jar,
        form,
      )
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        const elem = resData.jsmods.instances[0][2][0].filter(function (v) {
          return v.value === "logout";
        })[0];

        const html = resData.jsmods.markup.filter(function (v) {
          return v[0] === elem.markup.__m;
        })[0][1].__html;

        const form = {
          fb_dtsg: utils.getFrom(html, '"fb_dtsg" value="', '"'),
          ref: utils.getFrom(html, '"ref" value="', '"'),
          h: utils.getFrom(html, '"h" value="', '"'),
        };

        return defaultFuncs
          .post("https://www.facebook.com/logout.php", ctx.jar, form)
          .then(utils.saveCookies(ctx.jar));
      })
      .then(function (res) {
        if (!res.headers) {
          throw { error: "An error occurred when logging out." };
        }

        return defaultFuncs
          .get(res.headers.location, ctx.jar)
          .then(utils.saveCookies(ctx.jar));
      })
      .then(function () {
        ctx.loggedIn = false;
        utils.log("logout", "Logged out successfully.");
        callback();
      })
      .catch(function (err) {
        utils.error("logout", err);
        return callback(err);
      });

    return returnPromise;
  };
};