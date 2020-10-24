const { optimize } = require("webpack");

module.exports = {
    entry : {
        mian : './main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-react-jsx',{pragma:'createElement'}]]
                    }

                }
            }
        ]
    },
    mode : 'development',
    optimization : {
        minimize : false
    }
}