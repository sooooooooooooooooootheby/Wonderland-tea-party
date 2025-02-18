import { useGreetingsStore } from "~/stores/greetingsStore.js";
import { useChatStore } from "~/stores/chatStore.js";

export default function ({ route, store, redirect }) {
    const greetingsStore = useGreetingsStore();
    const chatStore = useChatStore();
    greetingsStore.$reset();
    chatStore.chat = [];
}
