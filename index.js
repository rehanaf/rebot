const {
    default: WabotSocket,
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const Pino = require("pino");
const useCode = process.argv.includes("--code");

const connect = async() => {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const bot = WabotSocket({
        logger: Pino({ level: "silent" }),
        browser: ["Chrome (Linux)", "", ""],
        auth: state,
        printQRInTerminal: !useCode,
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: false
    });
    if (useCode && !bot.user && !bot.authState.creds.registered) {
        const terhubungMenggunakanCode = async() => {
            const readline = require("readline").createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const question = text =>
                new Promise(resolve => {
                    readline.question(text, answer => {
                        resolve(answer);
                        readline.close();
                    });
                });
            let phoneNumber = "";
            if (!phoneNumber) {
                phoneNumber = await question("Masukkan nomor whatsapp anda: +");
            }
            try {
                console.log(phoneNumber);
                setTimeout(async () => {
                    let code = await bot.requestPairingCode(phoneNumber);
                    code = code?.match(/.{1,4}/g).join("-") || code;
                    console.log(code);
                }, 5000);
            } catch (err) {
                console.log(err);
            }
        }
        await terhubungMenggunakanCode();
    }
    bot.ev.on("messages.upsert", ({ messages }) => require("./lib/utilize.js")(bot,
    messages[0]));
    bot.ev.on("connection.update", c => {
        const { connection, lastDisconnect } = c;
        if (connection === "close") {
            console.log(lastDisconnect);
            connect();
        }
        if (connection === "open") {
            console.log(bot.user.id.split(":")[0]);
        }
    });
    bot.ev.on("creds.update", saveCreds);
}

connect();
