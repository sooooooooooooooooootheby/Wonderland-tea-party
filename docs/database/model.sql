/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : wonderland_tea_party

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 11/03/2025 21:59:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for model
-- ----------------------------
DROP TABLE IF EXISTS `model`;
CREATE TABLE `model` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `display` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `model` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isRea` enum('true','false') COLLATE utf8mb4_general_ci DEFAULT 'false',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` enum('active','stop') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of model
-- ----------------------------
BEGIN;
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (1, 'deepseek 聊天', 'deepseek', 'deepseek-chat', 'false', 'deepseek', 'DeepSeek-V3是深度求索公司推出的高性能多模态AI模型，具备复杂任务处理能力', 'active');
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (2, 'deepseek 推理', 'deepseek', 'deepseek-reasoner', 'true', 'deepseek', 'DeepSeek-R1是其研发的搜索增强型智能助手，专注于实时交互与精准信息响应。', 'active');
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (3, '通义千问-Max', 'qwen', 'qwen-max', 'false', 'qwen', '通义千问系列效果最好的模型，适合复杂、多步骤的任务。', 'active');
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (4, '通义千问-Plus', 'qwen', 'qwen-plus', 'false', 'qwen', '能力均衡，推理效果、成本和速度介于通义千问-Max和通义千问-Turbo之间，适合中等复杂任务。', 'active');
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (5, '通义千问-Turbo', 'qwen', 'qwen-turbo', 'false', 'qwen', '通义千问系列速度最快、成本极低的模型，适合简单任务。', 'active');
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (6, '通义千问-Long', 'qwen', 'qwen-long', 'false', 'qwen', '通义千问系列上下文窗口最长，能力均衡且成本较低的模型，适合长文本分析、信息抽取、总结摘要和分类打标等任务。', 'active');
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (7, '通义千问VL', 'qwen', 'qwen-vl-max', 'false', 'qwen', '通义千问VL是具有视觉（图像）理解能力的文本生成模型，不仅能进行OCR（图片文字识别），还能进一步总结和推理。', 'active');
INSERT INTO `model` (`id`, `display`, `type`, `model`, `isRea`, `icon`, `info`, `state`) VALUES (10, '通义千问-qwq', 'qwen', 'qwq-plus', 'true', 'qwen', '基于 Qwen2.5 模型训练的 QwQ 推理模型，通过强化学习大幅度提升了模型推理能力。', 'active');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
