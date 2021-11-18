const {
    Transactions
} = require('@swipechain/crypto')

exports.deserialize = data => {
    return Transactions.Deserializer.deserialize(data)
}
