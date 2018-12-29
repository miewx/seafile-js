'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');
var FormData = require('form-data');

var SeafileAPI = function () {
  function SeafileAPI() {
    _classCallCheck(this, SeafileAPI);
  }

  _createClass(SeafileAPI, [{
    key: 'init',
    value: function init(_ref) {
      var server = _ref.server,
          username = _ref.username,
          password = _ref.password,
          token = _ref.token;

      this.server = server;
      this.username = username;
      this.password = password;
      this.token = token; //none
      if (this.token && this.server) {
        this.req = axios.create({
          baseURL: this.server,
          headers: { 'Authorization': 'Token ' + this.token }
        });
      }
      return this;
    }
  }, {
    key: 'initForSeahubUsage',
    value: function initForSeahubUsage(_ref2) {
      var siteRoot = _ref2.siteRoot,
          xcsrfHeaders = _ref2.xcsrfHeaders;

      if (siteRoot && siteRoot.charAt(siteRoot.length - 1) === "/") {
        var server = siteRoot.substring(0, siteRoot.length - 1);
        this.server = server;
      } else {
        this.server = siteRoot;
      }

      this.req = axios.create({
        headers: {
          'X-CSRFToken': xcsrfHeaders
        }
      });
      return this;
    }
  }, {
    key: '_sendPostRequest',
    value: function _sendPostRequest(url, form) {
      if (form.getHeaders) {
        return this.req.post(url, form, {
          headers: form.getHeaders()
        });
      } else {
        return this.req.post(url, form);
      }
    }
  }, {
    key: 'getToken',
    value: function getToken() {
      var _this = this;

      var url = this.server + '/api2/auth-token/';
      axios.post(url, {
        username: this.username,
        password: this.password
      }).then(function (response) {
        _this.token = response.data;
        return _this.token;
      });
    }

    /**
     * Login to server and create axios instance for future usage
     */

  }, {
    key: 'login',
    value: function login() {
      var _this2 = this;

      var url = this.server + '/api2/auth-token/';
      return axios.post(url, {
        username: this.username,
        password: this.password
      }).then(function (response) {
        _this2.token = response.data.token;
        _this2.req = axios.create({
          baseURL: _this2.server,
          headers: { 'Authorization': 'Token ' + _this2.token }
        });
      });
    }
  }, {
    key: 'authPing',
    value: function authPing() {
      var url = this.server + '/api2/auth/ping/';
      return this.req.get(url);
    }

    //---- Account API

  }, {
    key: 'getAccountInfo',
    value: function getAccountInfo() {
      var url = this.server + '/api2/account/info/';
      return this.req.get(url);
    }

    //---- Group operation

  }, {
    key: 'listGroups',
    value: function listGroups() {
      var url = this.server + '/api2/groups/';
      return this.req.get(url);
    }
  }, {
    key: 'listGroupRepos',
    value: function listGroupRepos(groupID) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/libraries/';
      return this.req.get(url);
    }
  }, {
    key: 'listGroupsV2',
    value: function listGroupsV2(options) {
      var url = this.server + '/api/v2.1/groups/';
      return this.req.get(url, { params: options });
    }
  }, {
    key: 'getGroup',
    value: function getGroup(groupID) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/';
      return this.req.get(url);
    }
  }, {
    key: 'createGroup',
    value: function createGroup(name) {
      var url = this.server + '/api/v2.1/groups/';
      var form = new FormData();
      form.append('name', name);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'renameGroup',
    value: function renameGroup(groupID, name) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/';
      var params = {
        name: name
      };
      return this.req.put(url, params);
    }
  }, {
    key: 'deleteGroup',
    value: function deleteGroup(groupID) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'transferGroup',
    value: function transferGroup(groupID, ownerName) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/';
      var params = {
        owner: ownerName
      };
      return this.req.put(url, params);
    }
  }, {
    key: 'quitGroup',
    value: function quitGroup(groupID, userName) {
      var name = encodeURIComponent(userName);
      var url = this.server + '/api/v2.1/groups/' + groupID + '/members/' + name + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'listGroupMembers',
    value: function listGroupMembers(groupID) {
      var isAdmin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var avatarSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 64;

      var url = this.server + '/api/v2.1/groups/' + groupID + '/members/?avatar_size=' + avatarSize + '&is_admin=' + isAdmin;
      return this.req.get(url);
    }
  }, {
    key: 'addGroupMember',
    value: function addGroupMember(groupID, userName) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/members/';
      var params = {
        email: userName
      };
      return this.req.post(url, params);
    }
  }, {
    key: 'addGroupMembers',
    value: function addGroupMembers(groupID, userNames) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/members/bulk/';
      var form = new FormData();
      for (var i = 0; i < userNames.length; i++) {
        form.append("email", userNames[i]);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteGroupMember',
    value: function deleteGroupMember(groupID, userName) {
      var name = encodeURIComponent(userName);
      var url = this.server + '/api/v2.1/groups/' + groupID + '/members/' + name + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'setGroupAdmin',
    value: function setGroupAdmin(groupID, userName, isAdmin) {
      var name = encodeURIComponent(userName);
      var url = this.server + '/api/v2.1/groups/' + groupID + '/members/' + name + '/';
      var params = {
        is_admin: isAdmin
      };
      return this.req.put(url, params);
    }
  }, {
    key: 'createGroupOwnedLibrary',
    value: function createGroupOwnedLibrary(groupID, repo) {
      var repoName = repo.repo_name;
      var permission = repo.permission ? permission : 'rw';
      var url = this.server + '/api/v2.1/groups/' + groupID + '/group-owned-libraries/';
      var form = new FormData();
      form.append('name', repoName); // need to modify endpoint api;
      form.append('permission', permission);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteGroupOwnedLibrary',
    value: function deleteGroupOwnedLibrary(groupID, repoID) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/group-owned-libraries/' + repoID + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'shareGroupOwnedRepoToUser',
    value: function shareGroupOwnedRepoToUser(repoID, permission, username) {
      var url = this.server + '/api/v2.1/group-owned-libraries/' + repoID + '/user-share/';
      var form = new FormData();
      form.append('permission', permission);
      if (Array.isArray(username)) {
        username.forEach(function (item) {
          form.append('username', item);
        });
      } else {
        form.append('username', username);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'modifyGroupOwnedRepoUserSharedPermission',
    value: function modifyGroupOwnedRepoUserSharedPermission(repoID, permission, username) {
      //need check
      var url = this.server + '/api/v2.1/group-owned-libraries/' + repoID + '/user-share/';
      var form = new FormData();
      form.append('permission', permission);
      form.append('username', username);
      return this.req.put(url, form);
    }
  }, {
    key: 'deleteGroupOwnedRepoSharedUserItem',
    value: function deleteGroupOwnedRepoSharedUserItem(repoID, username) {
      var url = this.server + '/api/v2.1/group-owned-libraries/' + repoID + '/user-share/';
      var params = { username: username };
      return this.req.delete(url, { data: params });
    }
  }, {
    key: 'shareGroupOwnedRepoToGroup',
    value: function shareGroupOwnedRepoToGroup(repoID, permission, groupID) {
      var url = this.server + '/api/v2.1/group-owned-libraries/' + repoID + '/group-share/';
      var form = new FormData();
      form.append('permission', permission);
      if (Array.isArray(groupID)) {
        groupID.forEach(function (item) {
          form.append('group_id', item);
        });
      } else {
        form.append('group_id', groupID);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'modifyGroupOwnedRepoGroupSharedPermission',
    value: function modifyGroupOwnedRepoGroupSharedPermission(repoID, permission, groupID) {
      //need check
      var url = this.server + '/api/v2.1/group-owned-libraries/' + repoID + '/group-share/';
      var form = new FormData();
      form.append('permission', permission);
      form.append('group_id', groupID);
      return this.req.put(url, form);
    }
  }, {
    key: 'deleteGroupOwnedRepoSharedGroupItem',
    value: function deleteGroupOwnedRepoSharedGroupItem(repoID, groupID) {
      var url = this.server + '/api/v2.1/group-owned-libraries/' + repoID + '/group-share/';
      var params = { group_id: groupID };
      return this.req.delete(url, { data: params });
    }

    //---- share operation

    // share-link

  }, {
    key: 'listShareLinks',
    value: function listShareLinks() {
      var url = this.server + '/api/v2.1/share-links/';
      return this.req.get(url);
    }
  }, {
    key: 'listAllShareLinks',
    value: function listAllShareLinks() {
      var url = this.server + '/api/v2.1/share-links/';
      return this.req.get(url);
    }
  }, {
    key: 'listRepoShareLinks',
    value: function listRepoShareLinks(repoID) {
      var url = this.server + '/api/v2.1/share-links/?repo_id=' + repoID;
      return this.req.get(url);
    }
  }, {
    key: 'getShareLink',
    value: function getShareLink(repoID, filePath) {
      //list folder(file) links
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api/v2.1/share-links/?repo_id=' + repoID + '&path=' + path;
      return this.req.get(url);
    }
  }, {
    key: 'createShareLink',
    value: function createShareLink(repoID, path, password, expireDays, permissions) {
      var url = this.server + '/api/v2.1/share-links/';
      var form = new FormData();
      form.append('path', path);
      form.append('repo_id', repoID);
      form.append('permissions', permissions);
      if (password) {
        form.append('password', password);
      }
      if (expireDays) {
        form.append('expire_days', expireDays);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteShareLink',
    value: function deleteShareLink(token) {
      var url = this.server + '/api/v2.1/share-links/' + token + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'listSharedRepos',
    value: function listSharedRepos() {
      var url = this.server + '/api/v2.1/shared-repos/';
      return this.req.get(url);
    }

    // todo send email

    // upload-link

  }, {
    key: 'listUploadLinks',
    value: function listUploadLinks() {
      var url = this.server + '/api/v2.1/upload-links/';
      return this.req.get(url);
    }
  }, {
    key: 'getUploadLinks',
    value: function getUploadLinks(repoID, path) {
      var url = this.server + '/api/v2.1/upload-links/?repo_id=' + repoID + '&path=' + encodeURIComponent(path);
      return this.req.get(url);
    }
  }, {
    key: 'createUploadLink',
    value: function createUploadLink(repoID, path, password) {
      var url = this.server + '/api/v2.1/upload-links/';
      var form = new FormData();
      form.append('path', path);
      form.append('repo_id', repoID);
      if (password) {
        form.append('password', password);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteUploadLink',
    value: function deleteUploadLink(token) {
      var url = this.server + '/api/v2.1/upload-links/' + token + '/';
      return this.req.delete(url);
    }

    // todo send upload link email

    // shared-libraries

  }, {
    key: 'listSharedItems',
    value: function listSharedItems(repoID, path, shareType) {
      // shareType: user, group
      path = encodeURIComponent(path);
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/?p=' + path + '&share_type=' + shareType;
      return this.req.get(url);
    }
  }, {
    key: 'getBeSharedRepos',
    value: function getBeSharedRepos() {
      //listBeSharedRepos
      var url = this.server + '/api2/beshared-repos/';
      return this.req.get(url);
    }
  }, {
    key: 'leaveShareRepo',
    value: function leaveShareRepo(repoID, options) {
      // deleteBeSharedRepo
      var url = this.server + '/api2/beshared-repos/' + repoID + '/';
      return this.req.delete(url, { params: options });
    }

    // share repo to user is same to share Folder

    // unshare repo to user is same to unshare Folder

  }, {
    key: 'deleteShareToUserItem',
    value: function deleteShareToUserItem(repoID, path, shareType, username) {
      path = encodeURIComponent(path);
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/?p=' + path + '&share_type=' + shareType + '&username=' + username;
      return this.req.delete(url);
    }
  }, {
    key: 'updateShareToUserItemPermission',
    value: function updateShareToUserItemPermission(repoID, path, shareType, username, permission) {
      path = encodeURIComponent(path);
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/?p=' + path + '&share_type=' + shareType + '&username=' + username;
      var form = new FormData();
      form.append('permission', permission);
      return this._sendPostRequest(url, form);
    }

    // share repo to group is same to share folder

    // unshare repo to group is same to unshare folder

  }, {
    key: 'deleteShareToGroupItem',
    value: function deleteShareToGroupItem(repoID, path, shareType, groupID) {
      path = encodeURIComponent(path);
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/?p=' + path + '&share_type=' + shareType + '&group_id=' + groupID;
      return this.req.delete(url);
    }
  }, {
    key: 'updateShareToGroupItemPermission',
    value: function updateShareToGroupItemPermission(repoID, path, shareType, groupID, permission) {
      path = encodeURIComponent(path);
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/?p=' + path + '&share_type=' + shareType + '&group_id=' + groupID;
      var form = new FormData();
      form.append('permission', permission);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'leaveShareGroupOwnedRepo',
    value: function leaveShareGroupOwnedRepo(repoID) {
      var url = this.server + '/api/v2.1/group-owned-libraries/user-share-in-libraries/' + repoID + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'shareableGroups',
    value: function shareableGroups() {
      var url = this.server + '/api/v2.1/shareable-groups/';
      return this.req.get(url);
    }
  }, {
    key: 'getSharedRepos',
    value: function getSharedRepos() {
      var url = this.server + '/api2/shared-repos/';
      return this.req.get(url);
    }
  }, {
    key: 'updateRepoSharePerm',
    value: function updateRepoSharePerm(repoID, options) {
      var url = this.server + '/api/v2.1/shared-repos/' + repoID + '/';
      return this.req.put(url, options);
    }
  }, {
    key: 'unshareRepo',
    value: function unshareRepo(repoID, options) {
      var url = this.server + '/api/v2.1/shared-repos/' + repoID + '/';
      return this.req.delete(url, { params: options });
    }

    // shared folders

  }, {
    key: 'shareFolder',
    value: function shareFolder(repoID, path, shareType, permission, paramArray) {
      // shareType: user group
      path = encodeURIComponent(path);
      var form = new FormData();
      form.append('share_type', shareType);
      form.append('permission', permission);
      if (shareType == 'user') {
        for (var i = 0; i < paramArray.length; i++) {
          form.append('username', paramArray[i]);
        }
      } else {
        for (var _i = 0; _i < paramArray.length; _i++) {
          form.append('group_id', paramArray[_i]);
        }
      }
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/?p=' + path;
      return this.req.put(url, form);
    }
  }, {
    key: 'listSharedFolders',
    value: function listSharedFolders() {
      var url = this.server + '/api/v2.1/shared-folders/';
      return this.req.get(url);
    }
  }, {
    key: 'updateFolderSharePerm',
    value: function updateFolderSharePerm(repoID, data, options) {
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/';
      return this.req.post(url, data, { params: options }); // due to the old api, use 'post' here
    }
  }, {
    key: 'unshareFolder',
    value: function unshareFolder(repoID, options) {
      var url = this.server + '/api2/repos/' + repoID + '/dir/shared_items/';
      return this.req.delete(url, { params: options });
    }

    //---- repo(library) operation

  }, {
    key: 'createMineRepo',
    value: function createMineRepo(repo) {
      var url = this.server + '/api2/repos/?from=web';
      return this.req.post(url, repo);
    }
  }, {
    key: 'createGroupRepo',
    value: function createGroupRepo(groupID, repo) {
      var url = this.server + '/api/v2.1/groups/' + groupID + '/libraries/';
      var form = new FormData();
      form.append("repo_name", repo.repo_name);
      if (repo.password) {
        form.append("password", repo.password);
      }
      form.append("permission", repo.permission);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'listRepos',
    value: function listRepos(options) {
      /*
       * options: `{type: 'shared'}`, `{type: ['mine', 'shared', ...]}`
       */
      var url = this.server + '/api/v2.1/repos/';

      if (!options) {
        // fetch all types of repos
        return this.req.get(url);
      }

      return this.req.get(url, {
        params: options,
        paramsSerializer: function paramsSerializer(params) {
          var list = [];
          for (var key in params) {
            if (Array.isArray(params[key])) {
              for (var i = 0, len = params[key].length; i < len; i++) {
                list.push(key + '=' + encodeURIComponent(params[key][i]));
              }
            } else {
              list.push(key + '=' + encodeURIComponent(params[key]));
            }
          }
          return list.join('&');
        }
      });
    }
  }, {
    key: 'getRepoInfo',
    value: function getRepoInfo(repoID) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/';
      return this.req.get(url);
    }
  }, {
    key: 'getRepoHistoryLimit',
    value: function getRepoHistoryLimit(repoID) {
      var url = this.server + '/api2/repos/' + repoID + '/history-limit/';
      return this.req.get(url);
    }
  }, {
    key: 'setRepoHistoryLimit',
    value: function setRepoHistoryLimit(repoID, historyDays) {
      var url = this.server + '/api2/repos/' + repoID + '/history-limit/';
      var form = new FormData();
      form.append('keep_days', historyDays);
      return this.req.put(url, form);
    }
  }, {
    key: 'deleteRepo',
    value: function deleteRepo(repoID) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'renameRepo',
    value: function renameRepo(repoID, newName) {
      var url = this.server + '/api2/repos/' + repoID + '/?op=rename';
      var form = new FormData();
      form.append('repo_name', newName);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'transferRepo',
    value: function transferRepo(repoID, owner) {
      var url = this.server + '/api2/repos/' + repoID + '/owner/';
      var form = new FormData();
      form.append('owner', owner);
      return this.req.put(url, form);
    }
  }, {
    key: 'setRepoDecryptPassword',
    value: function setRepoDecryptPassword(repoID, password) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/set-password/';
      var form = new FormData();
      form.append('password', password);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'createPublicRepo',
    value: function createPublicRepo(repo) {
      var url = this.server + '/api2/repos/public/';
      return this.req.post(url, repo);
    }
  }, {
    key: 'selectOwnedRepoToPublic',
    value: function selectOwnedRepoToPublic(repoID, options) {
      // todo change a exist repo to public
      var url = this.server + '/api/v2.1/shared-repos/' + repoID + '/';
      return this.req.put(url, options);
    }

    // remove public repo is same to unshareRepo;

  }, {
    key: 'getSource',
    value: function getSource() {
      // for search
      var CancelToken = axios.CancelToken;
      var source = CancelToken.source();
      return source;
    }
  }, {
    key: 'searchFiles',
    value: function searchFiles(searchParams, cancelToken) {
      var url = this.server + '/api2/search/';
      return this.req.get(url, { params: searchParams, cancelToken: cancelToken });
    }

    //admin

  }, {
    key: 'listDeletedRepo',
    value: function listDeletedRepo() {
      var url = this.server + '/api/v2.1/deleted-repos/';
      return this.req.get(url);
    }
  }, {
    key: 'restoreDeletedRepo',
    value: function restoreDeletedRepo(repoID) {
      var url = this.server + '/api/v2.1/deleted-repos/';
      var form = new FormData();
      form.append('repo_id', repoID);
      return this._sendPostRequest(url, form);
    }

    //---- directory operation

  }, {
    key: 'listDir',
    value: function listDir(repoID, dirPath) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var recursive = opts.recursive;

      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api/v2.1/repos/' + repoID + '/dir/?p=' + path;
      if (recursive) {
        url = url + '&recursive=1';
      }
      return this.req.get(url);
    }
  }, {
    key: 'listWikiDir',
    value: function listWikiDir(slug, dirPath) {
      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api/v2.1/wikis/' + slug + '/dir/?p=' + path;
      return this.req.get(url);
    }
  }, {
    key: 'getDirInfo',
    value: function getDirInfo(repoID, dirPath) {
      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api/v2.1/repos/' + repoID + '/dir/detail/?path=' + path;
      return this.req.get(url);
    }
  }, {
    key: 'createDir',
    value: function createDir(repoID, dirPath) {
      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api2/repos/' + repoID + '/dir/?p=' + path;
      var form = new FormData();
      form.append('operation', 'mkdir');
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'renameDir',
    value: function renameDir(repoID, dirPath, newdirName) {
      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api2/repos/' + repoID + '/dir/?p=' + path;
      var form = new FormData();
      form.append("operation", 'rename');
      form.append("newname", newdirName);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteDir',
    value: function deleteDir(repoID, dirPath) {
      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api2/repos/' + repoID + '/dir/?p=' + path;
      return this.req.delete(url);
    }

    //---- multiple(File&Folder) operation

  }, {
    key: 'copyDir',
    value: function copyDir(repoID, dstrepoID, dstfilePath, dirPath, direntNames) {
      var fileNames = direntNames;
      if (Array.isArray(direntNames)) {
        fileNames = '';
        for (var i = 0; i < direntNames.length; i++) {
          if (i < direntNames.length - 1) {
            fileNames += direntNames[i] + ':';
          } else {
            fileNames += direntNames[i];
          }
        }
      }
      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api2/repos/' + repoID + '/fileops/copy/?p=' + path;
      var form = new FormData();
      form.append('dst_repo', dstrepoID);
      form.append('dst_dir', dstfilePath);
      form.append('file_names', fileNames);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'moveDir',
    value: function moveDir(repoID, dstrepoID, dstfilePath, dirPath, direntNames) {
      var fileNames = direntNames;
      if (Array.isArray(direntNames)) {
        fileNames = '';
        for (var i = 0; i < direntNames.length; i++) {
          if (i < direntNames.length - 1) {
            fileNames += direntNames[i] + ':';
          } else {
            fileNames += direntNames[i];
          }
        }
      }
      var path = encodeURIComponent(dirPath);
      var url = this.server + '/api2/repos/' + repoID + '/fileops/move/?p=' + path;
      var form = new FormData();
      form.append('dst_repo', dstrepoID);
      form.append('dst_dir', dstfilePath);
      form.append('file_names', fileNames);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteMutipleDirents',
    value: function deleteMutipleDirents(repoID, parentDir, direntNames) {
      var fileNames = '';
      for (var i = 0; i < direntNames.length; i++) {
        if (i < direntNames.length - 1) {
          fileNames += direntNames[i] + ':';
        } else {
          fileNames += direntNames[i];
        }
      }
      var path = encodeURIComponent(parentDir);
      var url = this.server + '/api2/repos/' + repoID + '/fileops/delete/?p=' + path;
      var form = new FormData();
      form.append('file_names', fileNames);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'zipDownload',
    value: function zipDownload(repoID, parent_dir, dirents) {
      // can download one dir
      var url = '';
      if (Array.isArray(dirents)) {
        var params = '';
        for (var i = 0; i < dirents.length; i++) {
          params += '&dirents=' + dirents[i];
        }
        url = this.server + '/api/v2.1/repos/' + repoID + '/zip-task/?parent_dir=' + parent_dir + params;
      } else {
        url = this.server + '/api/v2.1/repos/' + repoID + '/zip-task/?parent_dir=' + parent_dir + '&dirents=' + dirents;
      }
      return this.req.get(url);
    }
  }, {
    key: 'queryZipProgress',
    value: function queryZipProgress(zip_token) {
      var url = this.server + '/api/v2.1/query-zip-progress/?token=' + zip_token;
      return this.req.get(url);
    }
  }, {
    key: 'cancelZipTask',
    value: function cancelZipTask(zip_token) {
      var url = this.server + '/api/v2.1/cancel-zip-task/';
      var form = new FormData();
      form.append("token", zip_token);
      return this.req.post(url, form);
    }

    //---- File Operation

  }, {
    key: 'getFileInfo',
    value: function getFileInfo(repoID, filePath) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api2/repos/' + repoID + '/file/detail/?p=' + path;
      return this.req.get(url);
    }
  }, {
    key: 'getFileHistory',
    value: function getFileHistory(repoID, folderPath) {
      var url = this.server + "/api2/repos/" + repoID + "/file/history/?p=" + folderPath;
      return this.req.get(url);
    }
  }, {
    key: 'getFileDownloadLink',
    value: function getFileDownloadLink(repoID, filePath) {
      // reuse default to 1 to eliminate cross domain request problem
      //   In browser, the browser will send an option request to server first, the access Token
      //   will become invalid if reuse=0
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api2/repos/' + repoID + '/file/?p=' + path + '&reuse=1';
      return this.req.get(url);
    }
  }, {
    key: 'getFileContent',
    value: function getFileContent(downloadLink) {
      return axios.create().get(downloadLink);
    }
  }, {
    key: 'createFile',
    value: function createFile(repoID, filePath, isDraft) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file/?p=' + path;
      var form = new FormData();
      form.append('operation', 'create');
      form.append('is_draft', isDraft);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'renameFile',
    value: function renameFile(repoID, filePath, newfileName) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file/?p=' + path;
      var form = new FormData();
      form.append('operation', 'rename');
      form.append('newname', newfileName);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'lockfile',
    value: function lockfile(repoID, filePath) {
      var url = this.server + '/api2/repos/' + repoID + '/file/';
      var params = { p: filePath, operation: 'lock' };
      return this.req.put(url, params);
    }
  }, {
    key: 'unlockfile',
    value: function unlockfile(repoID, filePath) {
      var url = this.server + '/api2/repos/' + repoID + '/file/';
      var params = { p: filePath, operation: 'unlock' };
      return this.req.put(url, params);
    }

    // move need to add

    // copy need to add

  }, {
    key: 'revertFile',
    value: function revertFile(repoID, path, commitID) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file/?p=' + path;
      var form = new FormData();
      form.append("operation", 'revert');
      form.append("commit_id", commitID);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteFile',
    value: function deleteFile(repoID, filePath) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api2/repos/' + repoID + '/file/?p=' + path;
      return this.req.delete(url);
    }
  }, {
    key: 'getUploadLink',
    value: function getUploadLink(repoID, folderPath) {
      var url = this.server + '/api2/repos/' + repoID + '/upload-link/?p=' + encodeURIComponent(folderPath) + '&replace=0';
      return this.req.get(url);
    }
  }, {
    key: 'getFileUploadedBytes',
    value: function getFileUploadedBytes(repoID, filePath, fileName) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file-uploaded-bytes/';
      var params = {
        parent_dir: filePath,
        file_name: fileName
      };
      return this.req.get(url, { params: params });
    }
  }, {
    key: 'uploadImage',
    value: function uploadImage(uploadLink, formData) {
      return axios.create()({
        method: "post",
        data: formData,
        url: uploadLink
      });
    }
  }, {
    key: 'getUpdateLink',
    value: function getUpdateLink(repoID, folderPath) {
      var url = this.server + '/api2/repos/' + repoID + '/update-link/?p=' + folderPath;
      return this.req.get(url);
    }
  }, {
    key: 'updateFile',
    value: function updateFile(uploadLink, filePath, fileName, data) {
      var formData = new FormData();
      formData.append("target_file", filePath);
      formData.append("filename", fileName);
      var blob = new Blob([data], { type: "text/plain" });
      formData.append("file", blob);
      return axios.create()({
        method: 'post',
        url: uploadLink,
        data: formData
      });
    }
  }, {
    key: 'listFileHistoryRecords',
    value: function listFileHistoryRecords(repoID, path, page, per_page) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file/new_history/';
      var params = {
        path: path,
        page: page,
        per_page: per_page
      };
      return this.req.get(url, { params: params });
    }
  }, {
    key: 'getFileRevision',
    value: function getFileRevision(repoID, commitID, filePath) {
      var url = this.server + '/api2/' + 'repos/' + repoID + '/file' + '/revision/?p=' + filePath + '&commit_id=' + commitID;
      return this.req.get(url);
    }

    // file commit api

  }, {
    key: 'deleteComment',
    value: function deleteComment(repoID, commentID) {
      var url = this.server + '/api2/repos/' + repoID + '/file/comments/' + commentID + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'listComments',
    value: function listComments(repoID, filePath, resolved) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api2/repos/' + repoID + '/file/comments/?p=' + path;
      if (resolved) {
        url = url + '&resolved=' + resolved;
      }
      return this.req.get(url);
    }
  }, {
    key: 'postComment',
    value: function postComment(repoID, filePath, comment, detail) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api2/repos/' + repoID + '/file/comments/?p=' + path;
      var form = new FormData();
      form.append("comment", comment);
      if (detail) {
        form.append("detail", detail);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'getCommentsNumber',
    value: function getCommentsNumber(repoID, path) {
      var p = encodeURIComponent(path);
      var url = this.server + '/api2/repos/' + repoID + '/file/comments/counts/?p=' + p;
      return this.req.get(url);
    }
  }, {
    key: 'updateComment',
    value: function updateComment(repoID, commentID, resolved, detail) {
      var url = this.server + '/api2/repos/' + repoID + '/file/comments/' + commentID + '/';
      var params = {
        resolved: resolved
      };
      if (detail) {
        params.detail = detail;
      }
      return this.req.put(url, params);
    }

    // draft operation api

  }, {
    key: 'getDraft',
    value: function getDraft(id) {
      var url = this.server + '/api/v2.1/drafts/' + id + '/';
      return this.req.get(url);
    }
  }, {
    key: 'listDrafts',
    value: function listDrafts() {
      var url = this.server + '/api/v2.1/drafts';
      return this.req.get(url);
    }
  }, {
    key: 'createDraft',
    value: function createDraft(repoID, filePath) {
      var url = this.server + '/api/v2.1/drafts/';
      var form = new FormData();
      form.append("repo_id", repoID);
      form.append("file_path", filePath);
      return this.req.post(url, form);
    }
  }, {
    key: 'deleteDraft',
    value: function deleteDraft(id) {
      var url = this.server + '/api/v2.1/drafts/' + id + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'publishDraft',
    value: function publishDraft(id) {
      var url = this.server + '/api/v2.1/drafts/' + id + '/';
      var params = {
        operation: 'publish'
      };
      return this.req.put(url, params);
    }

    // review api

  }, {
    key: 'createDraftReview',
    value: function createDraftReview(id) {
      var url = this.server + '/api/v2.1/reviews/';
      var params = {
        draft_id: id
      };
      return this.req.post(url, params);
    }
  }, {
    key: 'createFileReview',
    value: function createFileReview(repoID, filePath) {
      var url = this.server + '/api/v2.1/file-review/';
      var form = new FormData();
      form.append("repo_id", repoID);
      form.append("file_path", filePath);
      return this.req.post(url, form);
    }
  }, {
    key: 'listReviews',
    value: function listReviews(status) {
      var url = this.server + '/api/v2.1/reviews/?status=' + status;
      return this.req.get(url);
    }
  }, {
    key: 'listReviewers',
    value: function listReviewers(reviewID) {
      var url = this.server + '/api/v2.1/review/' + reviewID + '/reviewer/';
      return this.req.get(url);
    }
  }, {
    key: 'addReviewers',
    value: function addReviewers(reviewID, reviewers) {
      var url = this.server + '/api/v2.1/review/' + reviewID + '/reviewer/';
      var form = new FormData();
      for (var i = 0; i < reviewers.length; i++) {
        form.append('reviewer', reviewers[i]);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteReviewer',
    value: function deleteReviewer(reviewID, reviewer) {
      var url = this.server + '/api/v2.1/review/' + reviewID + '/reviewer/?username=' + reviewer;
      return this.req.delete(url);
    }
  }, {
    key: 'updateReviewStatus',
    value: function updateReviewStatus(id, st) {
      var url = this.server + '/api/v2.1/review/' + id + '/';
      var params = {
        status: st
      };
      return this.req.put(url, params);
    }

    // review comments api

  }, {
    key: 'addReviewComment',
    value: function addReviewComment(reviewID, comment, detail) {
      var url = this.server + '/api2/review/' + reviewID + '/comments/';
      var form = new FormData();
      form.append('comment', comment);
      if (detail) {
        form.append('detail', detail);
      }
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'listReviewComments',
    value: function listReviewComments(reviewID, page, perPage, avatarSize) {
      var url = this.server + '/api2/review/' + reviewID + '/comments/?page=' + page + '&per_page=' + perPage + '&avatar_size=' + avatarSize;
      return this.req.get(url);
    }
  }, {
    key: 'deleteReviewComment',
    value: function deleteReviewComment(reviewID, commentID) {
      var url = this.server + '/api2/review/' + reviewID + '/comment/' + commentID + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'updateReviewComment',
    value: function updateReviewComment(reviewID, commentID, resolved, detail) {
      var url = this.server + '/api2/review/' + reviewID + '/comment/' + commentID + '/';
      var params = {
        resolved: resolved
      };
      if (detail) {
        params.detail = detail;
      }
      return this.req.put(url, params);
    }

    // starred

  }, {
    key: 'listStarred',
    value: function listStarred() {
      var url = this.server + '/api2/starredfiles/';
      return this.req.get(url);
    }
  }, {
    key: 'starFile',
    value: function starFile(repoID, filePath) {
      var url = this.server + '/api2/starredfiles/';
      var form = new FormData();
      form.append('repo_id', repoID);
      form.append('p', filePath);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'unStarFile',
    value: function unStarFile(repoID, filePath) {
      var path = encodeURIComponent(filePath);
      var url = this.server + "/api2/starredfiles/?repo_id=" + repoID + "&p=" + path;
      return this.req.delete(url);
    }

    //---- tags module api
    // repo tags

  }, {
    key: 'listRepoTags',
    value: function listRepoTags(repoID) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/repo-tags/';
      return this.req.get(url);
    }
  }, {
    key: 'createRepoTag',
    value: function createRepoTag(repoID, name, color) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/repo-tags/';
      var form = new FormData();
      form.append('name', name);
      form.append('color', color);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteRepoTag',
    value: function deleteRepoTag(repoID, repo_tag_id) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/repo-tags/' + repo_tag_id + '/';
      return this.req.delete(url);
    }
  }, {
    key: 'updateRepoTag',
    value: function updateRepoTag(repoID, repo_tag_id, name, color) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/repo-tags/' + repo_tag_id + '/';
      var params = {
        name: name,
        color: color
      };
      return this.req.put(url, params);
    }
  }, {
    key: 'listTaggedFiles',
    value: function listTaggedFiles(repoID, repoTagId) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/tagged-files/' + repoTagId + '/';
      return this.req.get(url);
    }

    // file tag api

  }, {
    key: 'listFileTags',
    value: function listFileTags(repoID, filePath) {
      var p = encodeURIComponent(filePath);
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file-tags/?file_path=' + p;
      return this.req.get(url);
    }
  }, {
    key: 'addFileTag',
    value: function addFileTag(repoID, filePath, repoTagId) {
      var form = new FormData();
      form.append('file_path', filePath);
      form.append('repo_tag_id', repoTagId);
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file-tags/';
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteFileTag',
    value: function deleteFileTag(repoID, fileTagId) {
      var url = this.server + '/api/v2.1/repos/' + repoID + '/file-tags/' + fileTagId + '/';
      return this.req.delete(url);
    }

    //---- RelatedFile API

  }, {
    key: 'listRelatedFiles',
    value: function listRelatedFiles(repoID, filePath) {
      var p = encodeURIComponent(filePath);
      var url = this.server + '/api/v2.1/related-files/?repo_id=' + repoID + '&file_path=' + p;
      return this.req.get(url);
    }
  }, {
    key: 'addRelatedFile',
    value: function addRelatedFile(oRepoID, rRepoID, oFilePath, rFilePath) {
      var form = new FormData();
      form.append('o_repo_id', oRepoID);
      form.append('r_repo_id', rRepoID);
      form.append('o_path', oFilePath);
      form.append('r_path', rFilePath);
      var url = this.server + '/api/v2.1/related-files/';
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteRelatedFile',
    value: function deleteRelatedFile(repoID, filePath, relatedID) {
      var url = this.server + '/api/v2.1/related-files/' + relatedID + '/';
      var params = {
        repo_id: repoID,
        file_path: filePath
      };
      return this.req.delete(url, { data: params });
    }
  }, {
    key: 'getInternalLink',
    value: function getInternalLink(repoID, filePath) {
      var path = encodeURIComponent(filePath);
      var url = this.server + '/api/v2.1/smart-link/?repo_id=' + repoID + '&path=' + path + '&is_dir=false';
      return this.req.get(url);
    }
  }, {
    key: 'getWikiFileContent',
    value: function getWikiFileContent(slug, filePath) {
      var path = encodeURIComponent(filePath);
      var time = new Date().getTime();
      var url = this.server + '/api/v2.1/wikis/' + slug + '/content/' + '?p=' + path + '&_=' + time;
      return this.req.get(url);
    }

    //---- Avatar API

  }, {
    key: 'getUserAvatar',
    value: function getUserAvatar(user, size) {
      var url = this.server + '/api2/avatars/user/' + user + '/resized/' + size + '/';
      return this.req.get(url);
    }

    //---- Notification API

  }, {
    key: 'listPopupNotices',
    value: function listPopupNotices() {
      var url = this.server + '/ajax/get_popup_notices/';
      return this.req.get(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    }
  }, {
    key: 'updateNotifications',
    value: function updateNotifications() {
      var url = this.server + '/api/v2.1/notifications/';
      return this.req.put(url);
    }
  }, {
    key: 'getUnseenNotificationCount',
    value: function getUnseenNotificationCount() {
      var url = this.server + '/api/v2.1/notifications/';
      return this.req.get(url);
    }

    //---- Linked Devices API

  }, {
    key: 'listLinkedDevices',
    value: function listLinkedDevices() {
      var url = this.server + '/api2/devices/';
      return this.req.get(url);
    }
  }, {
    key: 'unlinkDevice',
    value: function unlinkDevice(platform, device_id) {
      var url = this.server + "/api2/devices/";
      var param = {
        platform: platform,
        device_id: device_id
      };
      return this.req.delete(url, { data: param });
    }

    //---- Activities API

  }, {
    key: 'listActivities',
    value: function listActivities(pageNum) {
      var avatarSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 36;

      var url = this.server + '/api/v2.1/activities/?page=' + pageNum + '&size=' + avatarSize;
      return this.req.get(url);
    }

    //---- Thumbnail API

  }, {
    key: 'createThumbnail',
    value: function createThumbnail(repo_id, path, thumbnail_size) {
      var url = this.server + '/thumbnail/' + repo_id + '/create/?path=' + encodeURIComponent(path) + '&size=' + thumbnail_size;
      return this.req.get(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    }

    //---- Users API

  }, {
    key: 'searchUsers',
    value: function searchUsers(searchParam) {
      var url = this.server + '/api2/search-user/?q=' + encodeURIComponent(searchParam);
      return this.req.get(url);
    }

    //---- wiki module API

  }, {
    key: 'listWikis',
    value: function listWikis(options) {
      /*
       * options: `{type: 'shared'}`, `{type: ['mine', 'shared', ...]}`
       */
      var url = this.server + '/api/v2.1/wikis/';
      if (!options) {
        // fetch all types of wikis
        return this.req.get(url);
      }
      return this.req.get(url, {
        params: options,
        paramsSerializer: function paramsSerializer(params) {
          var list = [];
          for (var key in params) {
            if (Array.isArray(params[key])) {
              for (var i = 0, len = params[key].length; i < len; i++) {
                list.push(key + '=' + encodeURIComponent(params[key][i]));
              }
            } else {
              list.push(key + '=' + encodeURIComponent(params[key]));
            }
          }
          return list.join('&');
        }
      });
    }
  }, {
    key: 'addWiki',
    value: function addWiki(isExist, name, repoID) {
      var url = this.server + '/api/v2.1/wikis/';
      var form = new FormData();
      form.append('use_exist_repo', isExist);
      form.append('repo_id', repoID);
      form.append('name', name);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'renameWiki',
    value: function renameWiki(slug, name) {
      var url = this.server + '/api/v2.1/wikis/' + slug + '/';
      var form = new FormData();
      form.append('wiki_name', name);
      return this._sendPostRequest(url, form);
    }
  }, {
    key: 'deleteWiki',
    value: function deleteWiki(slug) {
      var url = this.server + '/api/v2.1/wikis/' + slug + '/';
      return this.req.delete(url);
    }

    //----MetaData API

  }, {
    key: 'fileMetaData',
    value: function fileMetaData(repoID, filePath) {
      var url = this.server + '/api2/repos/' + repoID + '/file/metadata/?p=' + filePath;
      return this.req.get(url);
    }
  }, {
    key: 'dirMetaData',
    value: function dirMetaData(repoID, dirPath) {
      var url = this.server + '/api2/repos/' + repoID + '/dir/metadata/?p=' + dirPath;
      return this.req.get(url);
    }
  }]);

  return SeafileAPI;
}();

exports.SeafileAPI = SeafileAPI;