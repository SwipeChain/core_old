const {
    Blocks
} = require('@swipechain/crypto')

exports.deserialize = data => {
    return Blocks.Deserializer.deserialize(data)
}
