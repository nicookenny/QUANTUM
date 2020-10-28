const Axios = require("axios");
const { User, Account } = require("../../db");
const { MoleculerError } = require("moleculer").Errors;

module.exports = async (ctx) => {
    const { id } = ctx.meta.user;
    const {amount} = ctx.params;

    const user = await User.findOne({
        where:{
            id:id
        },
        include:{
            model:Account,
            through:'account_user',
            as:'accounts'
        }
    });

    if (user == null) {
		throw new MoleculerError("User doesn't exists by its was deleted", 410, "USER_NOT_FOUND", {
			nodeID: ctx.nodeID,
			action: ctx.action.name,
		});
    }

    let accounts_id = {};
    user.accounts.forEach(item => {
        accounts_id[item.currency] = item.id;
    });
    const account_usd = await Account.findOne({where:{id:accounts_id.usd}});
    
    if(account_usd.balance < amount){
        throw new MoleculerError("No puedes vender más dolares de los que posee.", 403, "INSUFFICIENT_FOUNDS", {
            nodeID: ctx.nodeID,
			action: ctx.action.name,
		});
    }

    const usd = await Axios.get('https://free.currconv.com/api/v7/convert?q=USD_ARS&compact=ultra&apiKey=771ba0bd5ac4f83cd414')
    .then(res => res.data)
    .then(res => {
        return res.USD_ARS;
    })
    .catch(err => {
        throw new MoleculerError("Requests exceeded on external API", 417, "TRY_AGAIN_ON_1_HOUR", {
			nodeID: ctx.nodeID,
			action: ctx.action.name,
		});
    });

    let cost = usd * amount;
    cost = cost + (cost * 0.30);
    cost = cost + (cost * 0.35);
    //const cost = 100;
    const account_ars = await Account.findOne({where:{id:accounts_id.ars}});
    
    account_usd.balance = account_usd.balance - amount;
    account_ars.balance = account_ars.balance + cost;

    await account_usd.save();
    await account_ars.save();

    
    return {accounts:{usd:account_usd,ars:account_ars}};
}