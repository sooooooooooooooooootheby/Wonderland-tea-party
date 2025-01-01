import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const handleData = (messages) => {
    const grouped = {};
    const today = dayjs().format("YYYY-MM-DD"); // 获取今天的日期
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD"); // 获取昨天的日期

    // 遍历消息并按日期分类
    messages.forEach((msg) => {
        // 转换时间为 UTC+8 的日期
        const localDate = dayjs.utc(msg.data).tz("Asia/Shanghai").format("YYYY-MM-DD");

        if (!grouped[localDate]) {
            grouped[localDate] = []; // 初始化日期分组
        }
        grouped[localDate].push(msg); // 将消息添加到对应日期组
    });

    // 转换分组结果为数组形式返回
    return Object.entries(grouped).map(([date, messages]) => {
        // 判断是否为今天或昨天
        let displayDate = date;
        if (date === today) {
            displayDate = "今天";
        } else if (date === yesterday) {
            displayDate = "昨天";
        }

        return {
            date: displayDate, // 显示为今天或昨天
            messages, // 当天的消息数组
        };
    });
};

const scrollToBottom = (element) => {
    return element.scrollIntoView({ behavior: "smooth", block: "end" });
};

const tool = {
    handleData,
    scrollToBottom,
};

export default tool;
