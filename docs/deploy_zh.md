如果你想要部署这个项目, 会比较麻烦, 因为我不会 docker, 所以只能手动部署.

# 本地部署

## 准备工作

确认你的环境符合一下要求.

- MySQL > 8.0.0
- node.js > 20.11.1

先从 github 拉取下来

```bash
git clone https://github.com/sooooooooooooooooootheby/Wonderland-tea-party.git
```

## 数据库

首先你需要新建一个 mysql 数据库, 什么名字都好, 如果你不知道取什么名字就取`Wonderland-tea-party`吧.

数据库的字符集为`utf8mb4`, 排序规则为`utf8mb4_0900_ai_ci`.

然后打开你的 sql 工具, 运行`/docs/database/wonderland_tea_party.sql`, 导入表.

> 如果直接运行`wonderland_tea_party.sql`不行就单独运行另外三个单独的表 sql 文件.

## 环境变量

你需要在项目根目录新建一个`.env`文件保存环境变量.

```env
# API Keys
QWEN_API_KEY=       # QWEN API 密钥
DEEPSEEK_API_KEY=   # DeepSeek API 密钥

# 数据库配置
HOST=               # 数据库主机地址
USER=               # 数据库用户名
PASSWORD=           # 数据库密码
DATABASE=           # 数据库名称
CHARSET=            # 数据库字符集

# Token 配置
TOEKNKEY_SERVER=    # 服务器 token 密钥
TOKENOUTTIME=       # token 过期时间

# 公共配置
TOEKNKEY_CLIENT=    # 客户端 token 密钥
```

## 启动

在项目根目录执行以下命令.

```bash
# 安装依赖
pnpm i

# 启动!
pnpm run dev
```

# 通过 vercel 托管部署

## 准备工作

将这个项目fork一份到你的github上.

## 数据库

数据库操作同本地部署

## 部署

打开你的vercel, 如果你不会使用, 就打开[Google](https://google.com)搜索"如何在vercel部署".

## 环境变量

你需呀手动在 vercel > your project > setting > Environment Variables 设置环境变量.

```env
QWEN_API_KEY=       # QWEN API 密钥
DEEPSEEK_API_KEY=   # DeepSeek API 密钥
HOST=               # 数据库主机地址
USER=               # 数据库用户名
PASSWORD=           # 数据库密码
DATABASE=           # 数据库名称
CHARSET=            # 数据库字符集
TOEKNKEY_SERVER=    # 服务器 token 密钥
TOKENOUTTIME=       # token 过期时间
TOEKNKEY_CLIENT=    # 客户端 token 密钥
```

## 登陆

因为用户管理系统还没开始写, 所以只有一个sql文件中自带的一个账户

用户名: test

密码: 123456
