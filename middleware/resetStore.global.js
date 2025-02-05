import { useGreetingsStore } from "~/stores/greetingsStore.js";

export default function ({ route, store, redirect }) {
    const greetingsStore = useGreetingsStore();
    greetingsStore.$reset();
}
