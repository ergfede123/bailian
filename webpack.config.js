module.exports = {
	entry:__dirname+"/client/src/js/main.js", 
	output:{
		path:__dirname+"/client/dist/js",
//		filename:"rigister.js"
//		filename:"login.js"
//		filename:"index.js"
//		filename:"list.js"
//		filename:"shopping.js"
		filename:"show.js"
	},
	module:{
		rules:[
			{
				test:/\.js/,
				use:{
					loader:"babel-loader",
					options:{presets:["env"]}
				},
				exclude:/node_modules/
			},
			{
				test:/\.(scss|css)/,
				use:[
					{loader:"style-loader"},
					{loader:"css-loader"},
					{loader:"sass-loader"}
				]
			}
			,{
				test: /\.(png|jpg|gif)$/, 
				loader: 'url-loader?limit=3000&name=[name].[ext]&outputPath=img/&publicPath=js/img',  
			},
			{
　　　　　		　test: /\.html$/,
　　　　　		　loader: 'html-withimg-loader'
　　　　		}
		]
	},
	devServer:{
		contentBase:"./dist", 
		historyApiFallback:true, 
		inline:true, 
		port:8080
	}
}