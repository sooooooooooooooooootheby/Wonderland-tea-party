# 后端

应该有一个中间件验证 token, 如果 token 过期了就返回 401. (要排除`/api/user/login`)

应该有一个中间件对`api/admin`的请求进行验证, 如果 token 中包含的 id 不属于 admin 就返回 403

## 用户系统

登录

> 登录时返回的 token 应当包含用户 id 和 role

`post` `/api/user/login`

获取用户列表

`get` `/api/admin/user/getList`

添加用户
修改用户
删除用户

`post` `/api/admin/user`

## 模型系统

获取模型列表

`get` `/api/model/getList`

添加模型
修改模型
删除模型

`post` `/api/admin/model`
