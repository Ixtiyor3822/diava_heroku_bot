process.env.NTBA_FIX_319 = 1;

const TeleramBot = require("node-telegram-bot-api")
const mongoose = require("mongoose")


const Channels = require("./model/channel")
const User = require("./model/user")
const Subdev = require("./model/subbed");


const token = "1900067244:AAHNm_Pnbsoe9T5OfKsmk_0X4C_JhkBDmUs"
const bot = new TeleramBot(token, { polling: true })


let name, phone_number;

/**
 * 
 * 
 * Malumotlar bazasi bilan bog`lanish.
 * 
 * 
 */



mongoose.connect("mongodb://localhost/bot", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log("Bazaga ulandi."))
    .catch(err => console.log("Qandaydir hato mavjud." + err))



/*

    Start berilganda bajariladigan qismi.

*/

bot.onText(/\/start/, async (msg) => {

    let { from: { id, first_name } } = msg


    /**
     * Barcha malumotlarni ulash
     */

    let people = await User.findOne({ userId: id })

    if (people) {
        const channel = await Channels.find()

        await User.findOneAndUpdate({ userId: id }, {
            channels: channel
        }, (err, doc) => {
            if (err) {
                console.log("Update qilishda hato bor, Start ", err)
            }
            console.log("Malumot update bo`ldi start ", doc)
        })

        bot.sendMessage(id, "Salom diava media botiga xush kelibsiz.", {
            reply_markup: {
                keyboard: [
                    ["Kanallar", "Qo`shilganlarim"]
                ],
                resize_keyboard: true
            }
        })
    } else {

        /**
         * Bazadagi channellarni userlarga qo`shish jarayoni.
         */

        // const channel = await Channels.find();

        // const subbed = new Subdev({
        //     userId: id,
        //     subbed: []
        // })

        // await subbed.save((err, doc) => {
        //     if (err) {
        //         console.log("Subbed qoshishda hatolik bor. ", err)
        //     }
        //     console.log("Subbed qo`shildi. ", doc)
        // })

        // const users = await User.find();
        // const order = users.length + 1;
        // const user = new User({
        //     order: order,
        //     userId: id,
        //     channels: channel,
        //     delchannels: []
        // })


        // await user.save((err, result) => {
        //     /**
        //      * Agar error bo`ladigan bo`lsa
        //      */

        //     if (err) {
        //         console.log(err)
        //     }


        //     /**
        //      * Agar hamasi ok bo`lsa
        //      */

        //     console.log(result)
        // })

        bot.sendMessage(
            id,
            `Assalom alaykum  ${first_name} \n🤓Diava Media Konkursining rasmiy botiga xush kelibsiz! \n🤩Konkurs ishtirok etish uchun Ro'yhatdan o'tish tugmasini bosing! \n➡️Ushbu tugmani bosganingizdan keyin kichkina so'rovnomani to'ldirishingiz kerak bo'ladi... `,
            {
                reply_markup: {
                    keyboard: [["Ro`yhatdan o`tish"]],
                    resize_keyboard: true,
                },
            }
        );

        // bot.sendMessage(id, "Salom diava media botiga xush kelibsiz.", {
        //     reply_markup: {
        //         keyboard: [
        //             ["Kanallar", "Qo`shilganlarim"]
        //         ],
        //         resize_keyboard: true
        //     }
        // })
    }

})


/**
 * 
 * Keyingisi qismi !
 * 
 */


bot.onText(/Ro`yhatdan o`tish/, async (message) => {
    let {
        from: { id },
    } = message;
    bot.sendMessage(
        id,
        "Ism Sharifingizni va Familiyangizni kiriting kiriting ...",
        {
            reply_markup: {
                remove_keyboard: true,
            },
        }
    );

    bot.once("text", async (message) => {
        let {
            text,
            from: { id },
        } = message;
        name = text;

        bot.sendMessage(
            id,
            "Telefon raqamingizni kiriting, Tugmani bossangiz kifoya ...",
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: "Telefon raqamni yuborish ...",
                                request_contact: true,
                            },
                        ],
                    ],
                    resize_keyboard: true,
                },
            }
        );

        bot.once("message", async (message) => {
            let {
                contact: { phone_number },
                from: { id },
            } = message;
            phone = phone_number;
            bot.sendMessage(id, "Ro`yhatdan o`tganingiz uchun katta rahmat. !", {
                reply_markup: {
                    remove_keyboard: true,
                },
            });

            const foydalanuvchi = await User.findOne({ userId: id });

            if (foydalanuvchi) {
                bot.sendMessage(
                    id,
                    `Ismingiz : ${name} \nTelefon raqamingiz : ${phone}`,
                    {
                        reply_markup: {
                            keyboard: [["Keyingisi"]],
                            resize_keyboard: true,
                        },
                    }
                );
            } else {

                const channel = await Channels.find();

                console.log("channel ketayapdi.", channel)

                const subbed = new Subdev({
                    userId: id,
                    subbed: []
                })

                await subbed.save((err, doc) => {
                    if (err) {
                        console.log("Subbed qoshishda hatolik bor. ", err)
                    }
                    console.log("Subbed qo`shildi. ", doc)
                })

                const users = await User.find();
                const order = users.length + 1;

                console.log("User id id 0,", id)

                let userId = id;

                const newUser = new User({
                    order: order,
                    userId: userId,
                    name: name,
                    phone: phone,
                    channels: channel
                });

                await newUser.save((err, data) => {
                    if (err) {
                        bot.sendMessage(
                            id,
                            "Foydalanuvchini saqlashda muammo bor. Qaytadan urinib ko`ring"
                        );
                    }
                    console.log("new user saqlandi ", newUser)
                    bot.sendMessage(
                        id,
                        `Ismingiz : ${name} \nTelefon raqamingiz : ${phone}`,
                        {
                            reply_markup: {
                                keyboard: [["Kanallar", "Qo`shilganlarim"]],
                                resize_keyboard: true,
                            },
                        }
                    );
                });
            }
        });

    });
});








/**
 * 
 * Kategoriyalarga bo`lingan holda ishlash.
 * Kanallar kategoriyasi.
 * 
 */

bot.onText(/Kanallar/, async (msg) => {
    const { from: { id } } = msg

    /**
     * Kanallar katalogini chiqarib berishim kerak.
     */

    let user = await User.findOne({ userId: id })

    console.log("user user", user)

    let kanallar = user.channels

    if (kanallar.length == 0) {
        return bot.sendMessage(id, "Kanal mavjud emas.!")
    }

    console.log(user.channels)

    let message = kanallar.map((item, index) => {
        return `<b>${index + 1}. </b> ${item.channelName} - /k${item._id}`
    }).join("\n")

    console.log("message ", message)
    bot.sendMessage(id, message, { parse_mode: "HTML" })

})


/**
 * Qo`shilganlarim bo`limini ishlash.
 */

bot.onText(/Qo`shilganlarim/, async (msg) => {
    const { from: { id } } = msg;

    const subdevs = await Subdev.findOne({ userId: id })

    console.log(subdevs)


    if (subdevs.length == 0) {
        return bot.sendMessage(id, "Siz hali kanalga obuna bo`lmadingiz.")
    }

    let kanal = []

    for (let i = 0; i < subdevs.subbed.length; i++) {

        let app = await Channels.findById(subdevs.subbed[i])
        kanal.push(app)
    }

    console.log("kanal ", kanal)
    let message = kanal.map((item, index) => {
        return `<b>${(index + 1).toString()}</b> ${item.channelName.toString()}`
    }).join("\n")

    bot.sendMessage(id, message.toString(), { parse_mode: "HTML" })


})
/**
 * 
 * Tanlangan kanal ustida amallar bajarish.
 * 
 */



bot.onText(/\/k(.+)/, async (msg, match) => {
    const { from: { id } } = msg
    const channelId = match[1]
    console.log(channelId)

    const channels = await Channels.findById(channelId)

    const subbed = await Subdev.findOne({ userId: id })
    console.log("subdevlar", subbed)
    // if(!subbed){
    //   const post = new Subdev({
    //       userId: id,
    //       subbed: [channelId]
    //   })
    //    post.save((err, doc)=>{
    //       if(err){
    //           console.log("saqlashda hatolik bor" ,err)
    //       }
    //        console.log("Malumotlar saqlandi. ", doc)
    //   })
    // }

    let channel = subbed.subbed;
    console.log("Oldingi " + channel)
    if (!channel.includes(channelId)) {
        channel.push(channelId)
    } else {
        return bot.sendMessage(id, "Bu kanalga ulangansizku ")
    }

    await Subdev.findOneAndUpdate({ userId: id }, {
        subbed: channel
    }, (err, doc) => {
        if (err) {
            console.log("hato ", err)
        }
        console.log("to`g`ri", doc)
    })

    console.log("Keyingi " + channel)

    /**
     * 
     * User yaratish qismini update qilish
     * 
     */

    const user = await User.findOne({ userId: id })

    if (!user) {
        return bot.sendMessage(id, "Siz ro`yhatdan o`tmagansiz.")
    }

    const kanal = user.channels;

    /**
     * 
     * 
     * Tanlangan channelni channel listidan chiqarib tashlash.
     * 
     * 
     */

    const newChannel = kanal.filter(item => {
        return item._id != channelId
    })

    await User.findOneAndUpdate({ _id: user._id }, {
        channels: newChannel,
    }, (err, doc) => {
        if (err) {
            console.log("Hato mavjud.", err)
        }
        console.log("Update bo`ldi.", doc)
    })


    const url = channels.channelUrl;
    console.log(url)
    const name = channels.channelName;

    const link = "<a href='https://twitter.com/jordanbpeterson'>Jordan B. Peterson</a>"

    bot.sendMessage(id, url + "?sub_confirmation=1");

    // bot.sendMessage(id, `<b>Salom</b> <a href=${""+ url}> ${name} </a>` , { parse_mode: "HTML"})

    bot.sendMessage(id, "Ushbu ssilkaga bosing va kanalimizga obuna bo`ling.")

})

bot.onText(/\/del/, async (msg) => {

    const { from: { id } } = msg;
    await User.findOneAndDelete({ userId: id }, (err, doc) => {
        if (err) {
            bot.sendMessage(id, "O`chirishda qandaydir muammo bor")
        }
        bot.sendMessage(id, "Malumot o`chirildi.")
    })

    await Subdev.findOneAndDelete({ userId: id }, (err, doc) => {
        if (err) {
            bot.sendMessage(id, "O`chirishda qandaydir muammo bor")
        }
        bot.sendMessage(id, "Malumot o`chirildi.")

    })

})

bot.onText(/\/baza/, async (msg) => {
    const subbed = await Subdev.find()
    bot.sendMessage(msg.from.id, subbed.toString())
})

bot.onText(/\/user/, async (msg) => {
    const user = await User.find()
    bot.sendMessage(msg.from.id, user.toString())
})



bot.onText(/\/doc/, async (msg) => {
    try {
        const users = await User.find();

        let data = []

        for (let i = 0; i < users.length; i++) {
            const usesub = await Subdev.findOne({ userId: users[i].userId })

            let foydalanuvchi = {
                order: users[i].order,
                name: users[i].name,
                phone: users[i].phone,
                userId: users[i].userId,
                subbed: usesub.subbed.length
            }

            data.push(foydalanuvchi)
        }
        console.log(users)
        console.log(data)

    } catch (e) {
        console.log(e)
    }
})

function yukla(id) {
    console.log(id)
}

bot.onText(/\/link/ , async(msg)=>{
    bot.sendMessage(msg.from.id, `<a onclick=${yukla(1)}  href='https://www.youtube.com/channel/UC0Q83dYrLW9_gRkAr9DFW7g'>1  Osmondagi bolalar </a>`, {parse_mode: 'HTML'})
})