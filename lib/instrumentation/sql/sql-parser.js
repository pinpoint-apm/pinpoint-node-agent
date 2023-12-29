/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const NormalizedSql = require('./normalized-sql')

// ref: DefaultSqlParser.java
class SqlParser {
    static separator = ','
    static symbolReplace = '$'
    static numberReplace = '#'
    static nextTokenNotExist = -1
    static normalizedSqlBuffer = 32

    static normalizedSql(sql) {
        if (!sql) {
            return NormalizedSql.nullObject;
        }

        let change = false
        let normalized = ''

        let parsedParameter = new ParsedParameter()

        let replaceIndex = 0
        let numberTokenStartEnable = true

        for (let i = 0; i < sql.length; i++) {
            const ch = sql.charAt(i)
            switch (ch) {
                case '/':
                    const lookAhead1Char = lookAhead1(sql, i)
                    if (lookAhead1Char === '*') {
                        normalized += '/*'
                        i += 2
                        for (; i < sql.length; i++) {
                            const stateCh = sql.charAt(i)
                            if (stateCh === '*') {
                                const lookAhead1Char = lookAhead1(sql, i)
                                if (lookAhead1Char === '/') {
                                    normalized += '*/'
                                    i++
                                    break
                                }
                            }
                            normalized += stateCh
                        }
                        break
                    } else if (lookAhead1Char === '/') {
                        normalized += '//'
                        i += 2
                        i = readLine(sql, normalized, i)
                        break
                    } else {
                        numberTokenStartEnable = true
                        normalized += ch
                        break
                    }
                case '-':
                    // single line comment state
                    if (lookAhead1(sql, i) == '-') {
                        normalized += '--'
                        i += 2
                        i = readLine(sql, normalized, i)
                        break
                    } else {
                        numberTokenStartEnable = true
                        normalized += ch
                        break
                    }
                // SYMBOL
                case '\'':
                    // empty symbol
                    if (lookAhead1(sql, i) === '\'') {
                        normalized += '\'\''
                        i++
                        break
                    } else {
                        change = true
                        normalized += '\''
                        i++
                        parsedParameter.appendOutputSeparator()
                        for (; i < sql.length; i++) {
                            const stateCh = sql.charAt(i)
                            if (stateCh === '\'') {
                                if (lookAhead1(sql, i) === '\'') {
                                    i++
                                    parsedParameter.appendOutputParam('\'')
                                    continue
                                } else {
                                    normalized += replaceIndex++
                                    normalized += SqlParser.symbolReplace
                                    normalized += '\''
                                    break
                                }
                            }
                            parsedParameter.appendSeparatorCheckOutputParam(stateCh)
                        }
                        break
                    }
                // number start check
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    if (numberTokenStartEnable) {
                        change = true
                        normalized += replaceIndex++
                        normalized += SqlParser.numberReplace
                        parsedParameter.appendOutputSeparator()
                        parsedParameter.appendOutputParam(ch)
                        i++
                        tokenEnd:
                        for (; i < sql.length; i++) {
                            const ch = sql.charAt(i)
                            switch (ch) {
                                case '0':
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                case '9':
                                case '.':
                                case 'E':
                                case 'e':
                                    parsedParameter.appendOutputParam(ch)
                                    break
                                default:
                                    i--
                                    break tokenEnd
                            }
                        }
                        break
                    } else {
                        normalized += ch
                        break
                    }
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    numberTokenStartEnable = true
                    normalized += ch
                    break
                // http://msdn.microsoft.com/en-us/library/ms174986.aspx
                case '*':
                case '+':
                case '%':
                case '=':
                case '<':
                case '>':
                case '&':
                case '|':
                case '^':
                case '~':
                case '!':
                    numberTokenStartEnable = true
                    normalized += ch
                    break

                case '(':
                case ')':
                case ',':
                case ';':
                    numberTokenStartEnable = true
                    normalized += ch
                    break

                case '.':
                case '_':
                case '@': // Assignment Operator
                case ':': // Oracle's bind variable is possible with :bindvalue
                    numberTokenStartEnable = false
                    normalized += ch
                    break

                default:
                    if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z') {
                        numberTokenStartEnable = false
                    } else {
                        numberTokenStartEnable = true
                    }
                    normalized += ch
                    break
            }
        }

        if (!change) {
            return new NormalizedSql(sql, '')
        }

        let parsedParameterString
        if (parsedParameter.length > 0) {
            parsedParameterString = parsedParameter.toString()
        } else {
            parsedParameterString = ''
        }

        return new NormalizedSql(normalized, parsedParameterString)
    }
}

function lookAhead1(sql, index) {
    index++
    if (index < sql.length) {
        return sql.charAt(index)
    } else {
        return SqlParser.nextTokenNotExist
    }
}

function readLine(sql, normalized, index) {
    for (; index < sql.length; index++) {
        const ch = sql.charAt(index)
        normalized += ch
        if (ch === '\n') {
            break
        }
    }
    return index
}

class ParsedParameter {
    constructor() {
        this.buffer = new Array(SqlParser.normalizedSqlBuffer)
        this.bufferIndex = 0
    }

    get length() {
        return this.bufferIndex
    }

    appendOutputSeparator() {
        if (this.bufferIndex <= 0) {
            return
        }
        this.buffer[this.bufferIndex++] = SqlParser.separator
    }

    appendOutputParam(ch) {
        this.buffer[this.bufferIndex++] = ch
    }

    appendSeparatorCheckOutputParam(ch) {
        if (ch === ',') {
            this.buffer[this.bufferIndex++] = ','
            this.buffer[this.bufferIndex++] = ',' // double comma
        } else {
            this.buffer[this.bufferIndex++] = ch
        }
    }


    toString() {
        return this.buffer.slice(0, this.bufferIndex).join('')
    }
}

module.exports = SqlParser