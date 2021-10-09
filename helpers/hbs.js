const moment = require("moment");

module.exports = {
  formatDate: (date, format) => {
    return moment(date).utcOffset(330).format(format);
  },
  trimText: (str, len) => {
    if (str.length > len && str.length > 0) {
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(""));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + ".....";
    }
    return str;
  },
  removeTags: (text) => {
    return text.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: (postUser, loggedUser, postId) => {
    if (postUser._id.toString() == loggedUser._id.toString()) {
      return `<a href="/posts/edit/${postId}" class='ms-auto'><button class="ms-auto btn p-3 btn-success rounded-circle"><i class="fas fa-pen"></i></button></a>`;
    } else {
      return "";
    }
  },
  select: (selected, options) => {
    return options
      .fn(this)
      .replace(new RegExp('value="' + selected + '"'), '$& selected="selected"')
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
  upperCase: (str) => {
    if (str == "publish") {
      return str.charAt(0).toUpperCase() + str.slice(1) + "ed";
    }
    if (str == "draft") {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
};
