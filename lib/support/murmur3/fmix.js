// https://github.com/LinusU/fmix

module.exports = function fmix(input) {
    input ^= (input >>> 16)
    input = Math.imul(input, 0x85ebca6b)
    input ^= (input >>> 13)
    input = Math.imul(input, 0xc2b2ae35)
    input ^= (input >>> 16)

    return (input >>> 0)
}