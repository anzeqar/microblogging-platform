const moment = require("moment");

module.exports = {
  formatDate: (date, format) => {
    return moment(date).format(format);
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
      return `<a href="/posts/edit/${postId}" class='ms-auto'><button class="ms-auto btn btn-success">Edit</button></a>`;
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
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
