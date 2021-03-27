const path = require("path")

module.exports = {
	entry: "./index.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "/dist"
	},
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /(\.png)$/,
                use: ["file-loader"]
            }
        ]
    },
    devServer: {
        hot: true
    },
    mode: "development",
}
