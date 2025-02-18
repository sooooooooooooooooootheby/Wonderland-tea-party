# Wonderland tea party

一个个人向的 ai 聊天应用

> 个人向: 以个人使用为主, 而非多人使用

## 技术栈

-   框架: Nuxt3
-   UI 库: TailwindCSS + daisyUI
-   状态管理: pinia
-   数据存储: Mysql
-   密钥管理: .env 文件 + runtimeConfig

## api

-   Tongyi Qianwen
-   Deepseek

## 功能

优先级从高到低

-   主题切换 (使用 daisyUI 原生支持)
-   i18n

-   ai 对话
    -   消息流式输出
    -   对话历史侧边栏
    -   模型切换快捷入口
-   设置
    -   模型管理
    -   用户管理
    -   关于

## 阶段

-   阶段 1 (学习)

    -   使用单独的 demo 研究两个 api (Tongyi Qianwen, Deepseek) 的功能.
    -   学习使用 TailwindCSS + daisyUI

-   阶段 2 (最小 demo)

    -   demo1:

        -   主题切换
        -   i18n

    -   demo2:
        -   单页面聊天
        -   硬编码 API 密钥
        -   只接入一个 AI 服务商
        -   实现：
            -   消息发送/接收
            -   基础消息列表展示

-   阶段 3 (后端)

    -   用户系统
    -   模型系统
    -   接入 api
    -   聊天系统

-   阶段 4 (前端)
    -   功能接入
    -   页面美化
