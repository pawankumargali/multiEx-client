// import { ChainId, Token, TokenAmount, Pair, TradeType, Route } from '@uniswap/sdk';

// const uniswapSDK = require('@uniswap/sdk');
// const { ChainId, Token, TokenAmount, Pair, TradeType, Route, Trade } = uniswapSDK;

// const DAI = new Token(ChainId.KOVAN, '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', 18, 'DAI', 'DAI')
// const WETH = new Token(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether')
// const HOT_NOT = new Pair(new TokenAmount(WETH, '2000000000000000000'), new TokenAmount(DAI, '1000000000000000000'))
// const NOT_TO_HOT = new Route([HOT_NOT], DAI)

// const trade = new Trade(NOT_TO_HOT, new TokenAmount(DAI, '1000000000000000'), TradeType.EXACT_INPUT)

// // console.log(Route.path);
// // console.log(trade.minimumAmountOut.toString());
// console.log(trade.outputAmount);

// // console.log(trade);